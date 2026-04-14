import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface Activity {
  id: string;
  title: string;
  subtitle: string;
}

interface DashboardData {
  studentCount: number;
  eventCount: number;
  facultyCount: number;
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

export const useDashboard = (): DashboardData => {
  const [studentCount, setStudentCount] = useState<number>(0);
  const [eventCount, setEventCount] = useState<number>(0);
  const [facultyCount, setFacultyCount] = useState<number>(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsRes, eventsRes, facultyRes] = await Promise.all([
        api.get('/api/students'),
        api.get('/api/events'),
        api.get('/api/faculty'),
      ]);
      const getArray = (data: any) => {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.content)) return data.content;
        return [];
      };
      
      const sArr = getArray(studentsRes.data);
      const eArr = getArray(eventsRes.data);
      const fArr = getArray(facultyRes.data);

      setStudentCount(sArr.length);
      setEventCount(eArr.length);
      setFacultyCount(fArr.length);

      const recentActivities: Activity[] = [];
      const recentStudents = [...sArr].sort((a,b) => b.id - a.id).slice(0, 2);
      recentStudents.forEach(s => recentActivities.push({
          id: `student-${s.id}`,
          title: `New student registration: ${s.name}`,
          subtitle: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recently'
      }));

      const recentEvents = [...eArr].sort((a,b) => b.id - a.id).slice(0, 2);
      recentEvents.forEach(e => recentActivities.push({
          id: `event-${e.id}`,
          title: `New event scheduled: ${e.name}`,
          subtitle: `Date: ${e.date}`
      }));

      const recentFaculty = [...fArr].sort((a,b) => b.id - a.id).slice(0, 2);
      recentFaculty.forEach(f => recentActivities.push({
          id: `faculty-${f.id}`,
          title: `New faculty joined: ${f.name}`,
          subtitle: `Dept: ${f.department}`
      }));

      setActivities(recentActivities.sort(() => Math.random() - 0.5)); // shuffle visually
    } catch (error: any) {
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.error('Dashboard fetch error:', error);
      setError(error?.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { studentCount, eventCount, facultyCount, activities, loading, error };
};
