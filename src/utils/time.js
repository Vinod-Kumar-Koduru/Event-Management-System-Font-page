import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(tz);

export const formatForUser = (
  utcDate,
  userTz,
  fmt = "MMM DD, YYYY hh:mm A"
) => {
  if (!utcDate) return "";
  return dayjs.utc(utcDate).tz(userTz).format(fmt);
};

export const localToUTC = (localStr, eventTimezone) => {
  if (!localStr) return null;
  return dayjs.tz(localStr, eventTimezone).utc().toISOString();
};


export const isValidTimezone = (tzName) => {
  try {
    return dayjs.tz.names().includes(tzName);
  } catch {
    return false;
  }
};
