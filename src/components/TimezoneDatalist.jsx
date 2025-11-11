import React from "react";
import { getTimezones } from "../utils/time";

export default function TimezoneDatalist({ id = "tz-list" }) {
  const zones = getTimezones();
  return (
    <datalist id={id}>
      {zones.slice(0, 200).map((z) => (
        <option key={z} value={z} />
      ))}
    </datalist>
  );
}
