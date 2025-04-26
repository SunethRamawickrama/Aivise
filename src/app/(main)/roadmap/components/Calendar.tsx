'use client';
import React, { useState } from 'react';
import dayjs from 'dayjs';

export interface Assignment {
  dueDate: string; // Various formats (e.g., "Feb 10", "Before class starts")
  effortNotes: string;
  assignmentName: string;
  estimatedEffort: string;
}

interface CalendarProps {
  assignments: Assignment[];
}

export default function Calendar({ assignments }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Handle navigation between months
  const goToNextMonth = () => setCurrentDate((prevDate) => prevDate.add(1, 'month'));
  const goToPreviousMonth = () => setCurrentDate((prevDate) => prevDate.subtract(1, 'month'));

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const daysInMonth = endOfMonth.date();
  const startWeekDay = startOfMonth.day(); // 0 = Sunday
  const daysArray = Array.from({ length: startWeekDay + daysInMonth }, (_, i) => {
    if (i < startWeekDay) return null;
    return startOfMonth.date(i - startWeekDay + 1);
  });

  // Function to fetch assignments for a specific date
  const getAssignmentsForDay = (date: dayjs.Dayjs) => {
    return assignments.filter((assignment) => {
      const assignmentDate = dayjs(assignment.dueDate, ['MMM D', 'YYYY-MM-DD', 'MMM D, h:mmA']);
      return assignmentDate.isSame(date, 'day');
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {/* Month Navigation */}
      <div className="flex justify-between mb-4">
        <button onClick={goToPreviousMonth} className="text-xl font-semibold">{'<'}</button>
        <h2 className="text-2xl font-bold">{currentDate.format('MMMM YYYY')}</h2>
        <button onClick={goToNextMonth} className="text-xl font-semibold">{'>'}</button>
      </div>

      {/* Calendar Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-sm text-center font-semibold text-gray-700 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {daysArray.map((date, index) => (
          <div
            key={index}
            className="border rounded-lg min-h-[80px] p-2 text-sm bg-white shadow-sm"
          >
            {date && (
              <div>
                <div className="font-semibold">{date.date()}</div>
                <ul className="mt-1 space-y-1">
                  {getAssignmentsForDay(date).map((assignment, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-blue-700 bg-blue-100 rounded px-1 py-0.5"
                    >
                      {assignment.assignmentName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
