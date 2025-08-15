import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import AttendanceCalendar from './AttendanceCalendar';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
}

const ViewAttendance: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      // Mock API call - replace with actual endpoint
      // const response = await fetch(`/api/attendance/${studentId}?start=${startDate}&end=${endDate}`);
      
      // Mock attendance data
      const mockData: AttendanceRecord[] = [];
      const days = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) });
      
      days.forEach(day => {
        // Random attendance for demo - replace with actual data
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        if (!isWeekend) {
          mockData.push({
            date: format(day, 'yyyy-MM-dd'),
            status: Math.random() > 0.2 ? 'present' : 'absent'
          });
        }
      });

      setAttendanceData(mockData);
      setStudentName(`Student ${studentId}`); // Mock student name
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const presentDays = attendanceData.filter(record => record.status === 'present').length;
  const absentDays = attendanceData.filter(record => record.status === 'absent').length;
  const totalDays = attendanceData.length;
  const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">View Attendance</h1>
        <p className="text-gray-600">Search for student attendance records</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Search size={16} />
              <span>Student ID / Roll Number</span>
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter student ID"
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Calendar size={16} />
              <span>Start Date</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Calendar size={16} />
              <span>End Date</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={!studentId || loading}
          className="w-full p-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <Search size={20} />
          <span>{loading ? 'Searching...' : 'Search Attendance'}</span>
        </button>
      </div>

      {/* Results */}
      {attendanceData.length > 0 && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Attendance Summary for {studentName}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{presentDays}</div>
                <div className="text-sm text-green-700 font-medium">Present Days</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{absentDays}</div>
                <div className="text-sm text-red-700 font-medium">Absent Days</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{totalDays}</div>
                <div className="text-sm text-blue-700 font-medium">Total Days</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{attendancePercentage}%</div>
                <div className="text-sm text-purple-700 font-medium">Attendance</div>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Attendance Calendar</h3>
            <AttendanceCalendar
              attendanceData={attendanceData}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;