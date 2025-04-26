'use client'
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

interface Assignment {
  date: string; // in YYYY-MM-DD format
  title: string;
}

const assignments: Assignment[] = [
  { date: '2025-04-10', title: 'Math Homework' },
  { date: '2025-04-15', title: 'CS Project Milestone' },
  { date: '2025-04-15', title: 'History Essay' },
  { date: '2025-04-22', title: 'Physics Lab Report' },
  { date: '2025-04-25', title: 'Final Exam Review' },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const daysInMonth = endOfMonth.date();

  const startWeekDay = startOfMonth.day(); // 0 = Sunday
  const daysArray = Array.from({ length: startWeekDay + daysInMonth }, (_, i) => {
    if (i < startWeekDay) return null;
    return startOfMonth.date(i - startWeekDay + 1);
  });

  const getAssignmentsForDay = (date: dayjs.Dayjs) =>
    assignments.filter(a => a.date === date.format('YYYY-MM-DD'));

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {currentDate.format('MMMM YYYY')}
      </h2>
      <div className="grid grid-cols-7 gap-2 text-sm text-center font-semibold text-gray-700 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysArray.map((date, index) => (
          <div key={index} className="border rounded-lg min-h-[80px] p-2 text-sm bg-white shadow-sm">
            {date && (
              <div>
                <div className="font-semibold">{date.date()}</div>
                <ul className="mt-1 space-y-1">
                  {getAssignmentsForDay(date).map((assignment, idx) => (
                    <li key={idx} className="text-xs text-blue-700 bg-blue-100 rounded px-1 py-0.5">
                      {assignment.title}
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
