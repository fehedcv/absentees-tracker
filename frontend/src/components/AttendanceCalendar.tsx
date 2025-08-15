import React from 'react';
import {
  format,
  eachDayOfInterval,
  parseISO,
  startOfWeek,
  endOfWeek,
  addWeeks,
  differenceInWeeks
} from 'date-fns';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
}

interface AttendanceCalendarProps {
  attendanceData: AttendanceRecord[];
  startDate: string;
  endDate: string;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendanceData,
  startDate,
  endDate
}) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const startWeek = startOfWeek(start);
  const endWeek = endOfWeek(end);
  const weeks = differenceInWeeks(endWeek, startWeek) + 1;

  const getAttendanceStatus = (
    date: Date
  ): 'present' | 'absent' | 'no-data' => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = attendanceData.find(r => r.date === dateStr);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      return 'no-data';
    }

    // Outside range
    if (date < start || date > end) {
      return 'no-data';
    }

    return record ? record.status : 'no-data';
  };

  const getCellStyle = (status: string): string => {
    switch (status) {
      case 'present':
        return 'bg-green-500 hover:bg-green-600';
      case 'absent':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-100 border border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm"></div>
            <span>No Data / Weekend</span>
          </div>
        </div>
      </div>

      {/* GitHub-style weeks as columns */}
      <div className="overflow-x-auto">
        <div className="flex space-x-1">
          {Array.from({ length: weeks }).map((_, weekIndex) => {
            const weekStart = addWeeks(startWeek, weekIndex);
            const days = eachDayOfInterval({
              start: weekStart,
              end: weekStart.setDate(weekStart.getDate() + 6)
            });

            return (
              <div key={weekIndex} className="flex flex-col space-y-1">
                {days.map(day => {
                  const status = getAttendanceStatus(day);
                  return (
                    <div
                      key={day.toISOString()}
                      className={`w-4 h-4 rounded-sm transition-colors ${getCellStyle(
                        status
                      )}`}
                      title={`${format(day, 'MMM dd, yyyy')}: ${
                        status === 'no-data' ? 'No data' : status
                      }`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Hover over squares to see details. Weeks are columns, days are rows.
      </div>
    </div>
  );
};

export default AttendanceCalendar;
