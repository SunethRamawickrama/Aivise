"use client";
import { useEffect, useState } from "react";

export interface ScheduleItem {
  id: string;
  task: string;
  dueDate: Date;
  content: string;
  completed: boolean;
}

export default function ScheduleList({
  courseId,
}: Readonly<{ courseId: string }>) {
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/schedule?courseId=${courseId}&page=${page}&limit=${limit}`
      );
      const { data, pagination } = await res.json();

      setSchedules(data);
      setTotalPages(pagination.totalPages);
      setLoading(false);
    };

    fetchSchedule();
  }, [courseId, page]);

  return (
    <div className="p-4 m-6 mt-0">
      <h2 className="text-xl font-bold mb-4 mt-6">Schedule</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {schedules.map((item) => (
            <li key={item.id} className="p-3 border rounded shadow">
              <strong>{item.task}</strong> — Due on{" "}
              {new Date(item.dueDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex items-center space-x-4 justify-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
