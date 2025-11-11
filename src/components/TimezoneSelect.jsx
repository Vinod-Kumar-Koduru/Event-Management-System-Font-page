import React from "react";
import { getTimezones } from "../utils/time";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(tz);

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

export default function TimezoneSelect({
  value,
  onChange,
  id,
  commonOnly = false,
}) {
  const zones = getTimezones();

  const common = [
    "UTC",
    "Asia/Kolkata",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];

  const list = commonOnly ? common : zones;

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      aria-label="Timezone"
    >
      {list.map((z) => (
        <option key={z} value={z}>
          {`${formatOffset(z)} ${z}`}
        </option>
      ))}
    </select>
  );
}
