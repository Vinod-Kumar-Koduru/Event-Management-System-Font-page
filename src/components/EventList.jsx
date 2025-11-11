import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import EventCard from "./EventCard";
import { fetchEventsForProfile } from "../store/eventsSlice";

export default function EventList({ currentProfile }) {
  const dispatch = useDispatch();
  const events = useSelector((s) => s.events.items);
  const [viewTz, setViewTz] = useState(
    currentProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  React.useEffect(() => {
    if (currentProfile) {
      setViewTz(currentProfile.timezone);
      dispatch(fetchEventsForProfile(currentProfile._id));
    }
  }, [currentProfile?._id]);

  if (!currentProfile)
    return <div className="empty">Select a profile to view events</div>;

  return (
    <div>
      <div className="list-header">
        <label>View in Timezone</label>
        <select value={viewTz} onChange={(e) => setViewTz(e.target.value)}>
          <option>{currentProfile.timezone}</option>
          <option>UTC</option>
          <option>Europe/London</option>
          <option>America/New_York</option>
          <option>Asia/Kolkata</option>
        </select>
      </div>

      <div className="events">
        {events.length === 0 ? (
          <div className="empty">No events found</div>
        ) : (
          events.map((ev) => (
            <EventCard
              key={ev._id}
              event={ev}
              currentProfile={currentProfile}
              viewTimezone={viewTz}
            />
          ))
        )}
      </div>
    </div>
  );
}
