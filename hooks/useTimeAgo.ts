import { useEffect, useState } from "react";

export function useTimeAgo(date?: string) {
  const [timeAgoText, setTimeAgoText] = useState(() => formatTimeAgo(date));

  useEffect(() => {
    if (!date) return;

    const interval = setInterval(() => {
      setTimeAgoText(formatTimeAgo(date));
    }, 60000); // check every 1 min

    return () => clearInterval(interval);
  }, [date]);

  return timeAgoText;
}

// ✅ Improved formatter with pluralization
function formatTimeAgo(date?: string) {
  if (!date) return "No date";

  const inputDate = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  if (diff < 60) return "Just now";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(diff / 3600);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}
