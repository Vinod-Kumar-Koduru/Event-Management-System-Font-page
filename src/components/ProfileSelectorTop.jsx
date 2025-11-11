import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles, addProfile } from "../store/profilesSlice";

export default function ProfileSelectorTop({ value, onChange }) {
  const dispatch = useDispatch();
  const profiles = useSelector((s) => s.profiles.items);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [newName, setNewName] = useState("");
  const [newTz, setNewTz] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const filtered = profiles.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  const add = async () => {
    if (!newName) return alert("Name required");
    try {
      await dispatch(addProfile({ name: newName, timezone: newTz })).unwrap();
      setNewName("");
      setOpen(false);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="profile-top">
      <div className="profile-dropdown">
        <button className="btn" onClick={() => setOpen((s) => !s)}>
          {profiles.find((p) => p._id === value)?.name ||
            "Select current profile..."}
        </button>
        {open && (
          <div className="dropdown">
            <input
              placeholder="Search current profile..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <ul className="dropdown-list">
              {filtered.map((p) => (
                <li
                  key={p._id}
                  onClick={() => {
                    onChange(p._id);
                    setOpen(false);
                  }}
                >
                  {p.name}
                </li>
              ))}
            </ul>

            <div className="add-row">
              <input
                placeholder="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                placeholder="timezone"
                value={newTz}
                onChange={(e) => setNewTz(e.target.value)}
              />
              <button className="small" onClick={add}>
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
