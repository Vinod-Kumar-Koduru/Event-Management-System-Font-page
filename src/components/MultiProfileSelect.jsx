import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProfile } from "../store/profilesSlice";

export default function MultiProfileSelect({ value = [], onChange }) {
  const dispatch = useDispatch();
  const profiles = useSelector((s) => s.profiles.items);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [newName, setNewName] = useState("");
  const [newTz, setNewTz] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );

  const filtered = profiles.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter((x) => x !== id));
    else onChange([...value, id]);
  };

  const add = async () => {
    if (!newName) return alert("Name required");
    const res = await dispatch(
      addProfile({ name: newName, timezone: newTz })
    ).unwrap();
    onChange([...value, res._id]);
    setNewName("");
    setOpen(false);
  };

  return (
    <div className="multi-select">
      <button className="selector" onClick={() => setOpen((s) => !s)}>
        {value.length === 0
          ? "Select profiles..."
          : `${value.length} profiles selected`}
      </button>

      {open && (
        <div className="panel">
          <input
            placeholder="Search profiles..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="list">
            {filtered.map((p) => (
              <label key={p._id} className="list-item">
                <input
                  type="checkbox"
                  checked={value.includes(p._id)}
                  onChange={() => toggle(p._id)}
                />
                {p.name}
              </label>
            ))}
          </div>
          <div className="add">
            <input
              placeholder="Add new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              placeholder="timezone"
              value={newTz}
              onChange={(e) => setNewTz(e.target.value)}
            />
            <button className="small" onClick={add}>
              + Add Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
