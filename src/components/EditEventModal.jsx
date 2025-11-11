import React, { useState } from "react";
import Modal from "./Modal";
import MultiProfileSelect from "./MultiProfileSelect";
import { useDispatch } from "react-redux";
import { updateEvent } from "../store/eventsSlice";
import dayjs from "dayjs";

export default function EditEventModal({ event, onClose, currentProfile }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [participants, setParticipants] = useState(event.participants || []);
  const [eventTimezone, setEventTimezone] = useState(
    event.eventTimezone ||
      currentProfile?.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [startLocal, setStartLocal] = useState(
    dayjs(event.startAtUTC).tz
      ? dayjs.utc(event.startAtUTC).local().format("YYYY-MM-DDTHH:mm")
      : ""
  );
  const [endLocal, setEndLocal] = useState(
    dayjs(event.endAtUTC).tz
      ? dayjs.utc(event.endAtUTC).local().format("YYYY-MM-DDTHH:mm")
      : ""
  );

  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateEvent({
          id: event._id,
          payload: {
            title,
            description,
            participants,
            eventTimezone,
            startLocal,
            endLocal,
            updatedBy: currentProfile?._id || null,
          },
        })
      ).unwrap();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3>Edit Event</h3>
      <form onSubmit={submit} className="edit-form">
        <label>Profiles</label>
        <MultiProfileSelect value={participants} onChange={setParticipants} />
        <label>Timezone</label>
        <input
          value={eventTimezone}
          onChange={(e) => setEventTimezone(e.target.value)}
        />
        <label>Start Date & Time</label>
        <input
          type="datetime-local"
          value={startLocal}
          onChange={(e) => setStartLocal(e.target.value)}
        />
        <label>End Date & Time</label>
        <input
          type="datetime-local"
          value={endLocal}
          onChange={(e) => setEndLocal(e.target.value)}
        />
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary">
            Update Event
          </button>
        </div>
      </form>
    </Modal>
  );
}
