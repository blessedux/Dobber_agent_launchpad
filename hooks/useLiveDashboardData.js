import { useState, useEffect } from 'react';

export function useLiveDashboardData(refreshInterval = 5000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        // Use relative URL to work in both development and production
        const res = await fetch('/api/dashboard');
        
        if (!res.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const json = await res.json();
        
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchDashboard();
    
    // Set up interval for periodic updates
    const interval = setInterval(fetchDashboard, refreshInterval);

    // Clean up interval and prevent state updates if component unmounts
    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, [refreshInterval]);

  return { data, loading, error };
}

export default useLiveDashboardData; 