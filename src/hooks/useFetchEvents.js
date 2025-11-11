import { useState, useEffect } from 'react';
import { EventsAPI } from '../utils/api';

export const useFetchEvents = (profileId) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    if (!profileId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await EventsAPI.list(profileId);
      setEvents(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [profileId]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
};

