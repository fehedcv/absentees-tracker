import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';

interface Class {
  id: number;
  name: string;
}

interface Student {
  roll_number: number;
  name: string;
}
const backend="http://localhost:8000"

const MarkAttendance: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSession, setSelectedSession] = useState<'fullday' | 'forenoon' | 'afternoon'>('fullday');
  const [rollNumber, setRollNumber] = useState('');
  const [absentees, setAbsentees] = useState<number[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Mock API calls - replace with actual endpoints
  useEffect(() => {
  const fetchClasses = async () => {
    try {
      const res = await fetch(`${backend}/classes`);
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };
  fetchClasses();
}, []);


useEffect(() => {
  if (selectedClass) {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${backend}/classes/${selectedClass}/students`);
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }
}, [selectedClass]);


  const handleAddAbsentee = () => {
    const roll = parseInt(rollNumber);
    if (roll && !absentees.includes(roll) && students.some(s => s.roll_number === roll)) {
      setAbsentees([...absentees, roll]);
      setRollNumber('');
    }
  };

  const handleRemoveAbsentee = (roll: number) => {
    setAbsentees(absentees.filter(r => r !== roll));
  };

  const getStudentName = (rollNumber: number): string => {
    const student = students.find(s => s.roll_number === rollNumber);
    return student ? student.name : 'Unknown';
  };

  const handleSubmit = async () => {
  if (!selectedClass) return;

  
  const attendanceData = {
    class_id: selectedClass,
    date: selectedDate,
    session: selectedSession,  
    absentees: absentees,
    marked_by: 1
  };
    
  try {
    const response = await fetch(`${backend}/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(attendanceData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Server response:", data);

    // Store session for later use
    localStorage.setItem("savedSession", selectedSession);

    setSubmittedData(attendanceData);
    setShowModal(true);
  } catch (error) {
    console.error("Error submitting attendance:", error);
  }
};


  const handleWhatsAppShare = () => {
    if (!submittedData) return;

    const className = classes.find(c => c.id === submittedData.class_id)?.name;
    const absentStudents = submittedData.absentees.map((roll: number) => 
      `${roll}. ${getStudentName(roll)}`
    ).join('\n');

    const message = `*Attendance Report*\n\n*Class:* ${className}\n*Date:* ${submittedData.date}\n*Session:* ${submittedData.session.toUpperCase()}\n\n*Absentees:*\n${absentStudents}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Mark Attendance</h1>
        <p className="text-gray-600">Select class, date, and mark absentees</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 space-y-6">
        {/* Class Selection */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <Users size={16} />
            <span>Select Class</span>
          </label>
          <select
            value={selectedClass || ''}
            onChange={(e) => setSelectedClass(Number(e.target.value))}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <Calendar size={16} />
            <span>Date</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Session Selection */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <Clock size={16} />
            <span>Session</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['fullday', 'forenoon', 'afternoon'].map(session => (
              <button
                key={session}
                onClick={() => setSelectedSession(session as any)}
                className={`p-3 rounded-xl border-2 font-medium transition-all ${
                  selectedSession === session
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {session.charAt(0).toUpperCase() + session.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Roll Number Input */}
        {selectedClass && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Mark Absentees (Enter Roll Numbers)
            </label>
            <div className="flex space-x-3">
              <input
                type="number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter roll number"
                className="flex-1 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddAbsentee()}
              />
              <button
                onClick={handleAddAbsentee}
                className="px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Absentees List */}
        {absentees.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Absentees ({absentees.length})</h3>
            <div className="space-y-2">
              {absentees.map(roll => (
                <div key={roll} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-sm">
                    <strong>Roll {roll}:</strong> {getStudentName(roll)}
                  </span>
                  <button
                    onClick={() => handleRemoveAbsentee(roll)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedClass || absentees.length === 0}
          className="w-full p-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <Send size={20} />
          <span>Submit Attendance</span>
        </button>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onWhatsAppShare={handleWhatsAppShare}
        data={submittedData}
        getStudentName={getStudentName}
        classes={classes}
      />
    </div>
  );
};

export default MarkAttendance;