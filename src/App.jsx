import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileSelectorTop from "./components/ProfileSelectorTop";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import { fetchProfiles } from "./store/profilesSlice";
import { fetchEventsForProfile } from "./store/eventsSlice";

export default function App() {
  const dispatch = useDispatch();
  const profiles = useSelector((s) => s.profiles.items);
  const [currentProfileId, setCurrentProfileId] = useState(null);

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  useEffect(() => {
    // initial select: first profile
    if (profiles && profiles.length && !currentProfileId) {
      setCurrentProfileId(profiles[0]._id);
    }
  }, [profiles]);

  useEffect(() => {
    if (currentProfileId) dispatch(fetchEventsForProfile(currentProfileId));
  }, [currentProfileId, dispatch]);

  const currentProfile =
    profiles.find((p) => p._id === currentProfileId) || null;

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Event Management</h1>
          <p className="subtitle">
            Create and manage events across multiple timezones
          </p>
        </div>
        <ProfileSelectorTop
          value={currentProfileId}
          onChange={setCurrentProfileId}
        />
      </header>

      <main className="grid">
        <section className="card">
          <EventForm currentProfile={currentProfile} />
        </section>

        <section className="card">
          <EventList currentProfile={currentProfile} />
        </section>
      </main>
    </div>
  );
}
