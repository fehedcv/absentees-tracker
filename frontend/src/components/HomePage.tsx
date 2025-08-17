import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, FileText, Plus } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Polyfy
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Manage student attendance efficiently with Polyfy
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mark Attendance Card */}
        <div
          onClick={() => handleNavigation('/mark-attendance')}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 mx-auto">
            <UserCheck size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Mark Attendance
          </h2>
          <p className="text-gray-600 text-center leading-relaxed">
            Record student attendance for your classes with easy roll number input and session selection.
          </p>
        </div>

        {/* View Attendance Card */}
        <div
          onClick={() => handleNavigation('/view-attendance')}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 mx-auto">
            <FileText size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            View Attendance
          </h2>
          <p className="text-gray-600 text-center leading-relaxed">
            View detailed attendance records and analytics with calendar visualization.
          </p>
        </div>

        {/* Future Feature Placeholder Cards */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 opacity-60">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6 mx-auto">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-400 text-center mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-400 text-center leading-relaxed">
            More features will be added here in future updates.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 opacity-60">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6 mx-auto">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-400 text-center mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-400 text-center leading-relaxed">
            Additional functionality will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
