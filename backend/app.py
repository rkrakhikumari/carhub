from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import pandas as pd
from io import BytesIO
import os

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///attendance.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class Driver(db.Model):
    __tablename__ = 'drivers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    attendance = db.relationship('Attendance', backref='driver', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email
        }

class Attendance(db.Model):
    __tablename__ = 'attendance'
    
    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=False)
    driver_name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False)  # Present, Leave, PWC, Not Marked
    date = db.Column(db.Date, nullable=False)
    timestamp = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'driver_id': self.driver_id,
            'driver_name': self.driver_name,
            'status': self.status,
            'date': str(self.date),
            'timestamp': self.timestamp
        }

# Create tables
with app.app_context():
    db.create_all()

# Routes

# Get all drivers
@app.route('/api/drivers', methods=['GET'])
def get_drivers():
    drivers = Driver.query.all()
    return jsonify([driver.to_dict() for driver in drivers])

# Add new driver
@app.route('/api/drivers', methods=['POST'])
def add_driver():
    try:
        data = request.json
        driver = Driver(name=data['name'], phone=data.get('phone'), email=data.get('email'))
        db.session.add(driver)
        db.session.commit()
        return jsonify(driver.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Get all attendance records
@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    attendance = Attendance.query.all()
    return jsonify([a.to_dict() for a in attendance])

# Mark attendance
@app.route('/api/attendance', methods=['POST'])
def mark_attendance():
    try:
        data = request.json
        
        # Check if attendance already marked for today
        existing = Attendance.query.filter_by(
            driver_id=data['driver_id'],
            date=data['date']
        ).first()
        
        if existing:
            existing.status = data['status']
            existing.timestamp = data['timestamp']
        else:
            attendance = Attendance(
                driver_id=data['driver_id'],
                driver_name=data['driver_name'],
                status=data['status'],
                date=data['date'],
                timestamp=data['timestamp']
            )
            db.session.add(attendance)
        
        db.session.commit()
        return jsonify({'message': 'Attendance marked successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Export all attendance to Excel
@app.route('/api/attendance/export', methods=['GET'])
def export_attendance():
    try:
        attendance = Attendance.query.all()
        drivers = Driver.query.all()
        
        if not attendance:
            return jsonify({'error': 'No attendance records found'}), 404
        
        # Create a dictionary with driver names as keys
        data_dict = {driver.name: {} for driver in drivers}
        
        # Get all unique dates
        dates = sorted(set([a.date for a in attendance]))
        
        # Initialize date columns for each driver
        for driver_name in data_dict:
            for date in dates:
                data_dict[driver_name][str(date)] = 'Not Marked'
        
        # Fill in the actual attendance data
        for attendance_record in attendance:
            date_str = str(attendance_record.date)
            data_dict[attendance_record.driver_name][date_str] = attendance_record.status
        
        # Create DataFrame
        df = pd.DataFrame.from_dict(data_dict, orient='index')
        df = df.fillna('Not Marked')
        df.insert(0, 'Driver Name', df.index)
        df = df.reset_index(drop=True)
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Attendance', index=False)
        
        output.seek(0)
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f'attendance_{datetime.now().strftime("%Y_%m_%d")}.xlsx'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)