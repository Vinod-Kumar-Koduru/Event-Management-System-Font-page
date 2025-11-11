import React, { useState, useEffect } from "react";
import MultiProfileSelect from "./MultiProfileSelect";
import { useDispatch } from "react-redux";
import { createEvent } from "../store/eventsSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(tz);

export default function EventForm({ currentProfile }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState([]);
  const [eventTimezone, setEventTimezone] = useState(
    currentProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [startLocal, setStartLocal] = useState("");
  const [endLocal, setEndLocal] = useState("");

  useEffect(() => {
    if (currentProfile?.timezone) setEventTimezone(currentProfile.timezone);
  }, [currentProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM DATA CHECK:", {
      title,
      participants,
      startLocal,
      endLocal,
      eventTimezone,
    });

    console.log("Participants array contents:", participants);

    // checkfild
    if (
      title.trim() === "" ||
      participants.length === 0 ||
      !startLocal ||
      !endLocal
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // check datatime
    const start = dayjs.tz(startLocal, eventTimezone);
    const end = dayjs.tz(endLocal, eventTimezone);

    if (!start.isValid() || !end.isValid()) {
      alert("Invalid start or end time");
      return;
    }

    if (end.isBefore(start)) {
      alert("End time must be after start time");
      return;
    }

    try {
      await dispatch(
        createEvent({
          title,
          description,
          participants,
          eventTimezone,
          startLocal,
          endLocal,
          createdBy: currentProfile?._id || null,
        })
      ).unwrap();
      //form
      setTitle("");
      setDescription("");
      setParticipants([]);
      setStartLocal("");
      setEndLocal("");
      alert("Event created successfully!");
    } catch (err) {
      console.error("Event creation error:", err);
      alert(err.message || "Error creating event");
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h3>Create Event</h3>

      <label>Title</label>
      <input
        type="text"
        placeholder="Enter event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Profiles</label>
      <MultiProfileSelect
        value={participants}
        onChange={(val) => {
          console.log("Profiles selected:", val);
          setParticipants(val);
        }}
      />

      <label>Timezone</label>
      <input
        type="text"
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

      <button type="submit" className="primary">
        + Create Event
      </button>
    </form>
  );
}
