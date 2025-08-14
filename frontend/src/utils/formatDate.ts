import { Timestamp } from "firebase/firestore";
import {
  format,
  subDays,
  isBefore,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";

export const formatDate = (
  timestamp: Timestamp | { _seconds: number; _nanoseconds: number }
) => {
  let date: Date;

  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else {
    date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1_000_000
    );
  }

  const now = new Date();
  const fiveDaysAgo = subDays(now, 5);

  if (isBefore(date, fiveDaysAgo)) {
    return format(date, "dd/MM/yyyy");
  }

  const mins = differenceInMinutes(now, date);
  if (mins < 60) return `${mins}m`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours}h`;

  const days = differenceInDays(now, date);
  return `${days}d`;
};
