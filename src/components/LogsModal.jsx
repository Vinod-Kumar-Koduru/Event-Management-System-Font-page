import React, { useEffect } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogs } from "../store/eventsSlice";
import { formatForUser } from "../utils/time";

export default function LogsModal({ eventId, onClose, userTz }) {
  const dispatch = useDispatch();
  const logs = useSelector((s) => s.events.logsByEvent[eventId] || []);

  useEffect(() => {
    dispatch(fetchLogs(eventId));
  }, [eventId, dispatch]);

  return (
    <Modal onClose={onClose}>
      <h3>Event Update History</h3>
      {logs.length === 0 ? (
        <div style={{ padding: 12 }}>No update history yet</div>
      ) : (
        <ul className="logs-list">
          {logs.map((l) => (
            <li key={l._id} className="log-item">
              <div className="log-time">
                {formatForUser(l.changedAtUTC, userTz, "MMM DD, YYYY hh:mm A")}
              </div>
              <pre className="log-diff">{JSON.stringify(l.diff, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
