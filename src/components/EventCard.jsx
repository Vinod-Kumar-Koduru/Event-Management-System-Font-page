import React, { useState } from "react";
import { formatForUser } from "../utils/time";
import EditEventModal from "./EditEventModal";
import LogsModal from "./LogsModal";

export default function EventCard({ event, currentProfile, viewTimezone }) {
  const [editOpen, setEditOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  const userTz = currentProfile?.timezone || viewTimezone || "UTC";

  return (
    <div className="event-card">
      <div className="participants">{event.participants?.length} profiles</div>
      <h4>{event.title}</h4>
      <p className="desc">{event.description}</p>

      <div className="times">
        <div>
          Start: <b>{formatForUser(event.startAtUTC, userTz)}</b>
        </div>
        <div>
          End: <b>{formatForUser(event.endAtUTC, userTz)}</b>
        </div>
      </div>

      <div className="meta">
        <small>Created: {formatForUser(event.createdAtUTC, userTz)}</small>
        <small>Updated: {formatForUser(event.updatedAtUTC, userTz)}</small>
      </div>

      <div className="actions">
        <button onClick={() => setEditOpen(true)}>Edit</button>
        <button onClick={() => setLogsOpen(true)}>View Logs</button>
      </div>

      {editOpen && (
        <EditEventModal
          event={event}
          onClose={() => setEditOpen(false)}
          currentProfile={currentProfile}
        />
      )}
      {logsOpen && (
        <LogsModal
          eventId={event._id}
          onClose={() => setLogsOpen(false)}
          userTz={userTz}
        />
      )}
    </div>
  );
}
