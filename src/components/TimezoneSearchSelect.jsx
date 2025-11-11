import React, { useEffect, useMemo, useRef, useState } from "react";
import { getTimezones } from "../utils/time";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(tz);

const COMMON_ZONES = [
  "UTC",
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function formatOffset(zone) {
  try {
    const minutes = dayjs.tz(zone).utcOffset();
    const sign = minutes >= 0 ? "+" : "-";
    const abs = Math.abs(minutes);
    const hh = String(Math.floor(abs / 60)).padStart(2, "0");
    const mm = String(abs % 60).padStart(2, "0");
    return `(GMT${sign}${hh}:${mm})`;
  } catch (e) {
    return "(GMT)";
  }
}

export default function TimezoneSearchSelect({
  value,
  onChange,
  id,
  commonOnly = false,
  placeholder = "Select timezone...",
}) {
  const allZones = useMemo(() => getTimezones(), []);
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const baseList = useMemo(() => {
    const list = commonOnly ? COMMON_ZONES : allZones;
    // Put user timezone first if present
    const dedup = Array.from(new Set(list));
    if (dedup.includes(userTz)) {
      return [userTz, ...dedup.filter((z) => z !== userTz)];
    }
    return dedup;
  }, [allZones, commonOnly, userTz]);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return baseList;
    return baseList.filter((z) => {
      const label = `${formatOffset(z)} ${z}`.toLowerCase();
      return z.toLowerCase().includes(q) || label.includes(q);
    });
  }, [baseList, query]);

  useEffect(() => {
    setHighlight(0);
  }, [query, open]);

  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector('[data-index="0"]');
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [open]);

  const select = (zone) => {
    onChange && onChange(zone);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowDown") {
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlight((h) => Math.max(h - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (open && filtered[highlight]) {
        select(filtered[highlight]);
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
    }
  };

  return (
    <div className="tz-search-select" style={{ position: "relative" }}>
      <input
        id={id}
        ref={inputRef}
        value={open ? query : value || ""}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id || "tz"}-listbox`}
        style={{ width: "100%" }}
      />

      {open && (
        <ul
          id={`${id || "tz"}-listbox`}
          role="listbox"
          ref={listRef}
          style={{
            position: "absolute",
            zIndex: 9999,
            left: 0,
            right: 0,
            maxHeight: 240,
            overflow: "auto",
            background: "white",
            border: "1px solid #ddd",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {filtered.length === 0 && <li style={{ padding: 8 }}>No results</li>}
          {filtered.map((z, i) => (
            <li
              key={z}
              data-index={i}
              role="option"
              aria-selected={i === highlight}
              onMouseDown={(ev) => ev.preventDefault()}
              onClick={() => select(z)}
              onMouseEnter={() => setHighlight(i)}
              style={{
                padding: "6px 8px",
                background: i === highlight ? "#eef" : "white",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: 12, color: "#444" }}>
                {`${formatOffset(z)} ${z}`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
