import { useState, useEffect } from 'react';
import { ProfilesAPI } from '../utils/api';

export const useFetchProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProfilesAPI.list();
      setProfiles(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles
  };
};

