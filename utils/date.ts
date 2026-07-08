export const formatUkDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const timeStr = date.toLocaleTimeString("uk-UA", timeOptions);

    if (isToday) {
      return `Сьогодні о ${timeStr}`;
    }
    if (isYesterday) {
      return `Вчора о ${timeStr}`;
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("uk-UA", options);
  } catch {
    return dateString;
  }
};
