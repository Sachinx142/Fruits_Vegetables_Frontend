const months = [
  "Jan", "Feb", "March", "April", "May", "June",
  "July", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DateFormatter = (date) => {
  if (!date || typeof date !== "string") return "";

  const parts = date.split("-"); // ["2025", "07", "22"]
  if (parts.length !== 3) return date;

  const year = parts[0];//Year -> 2025
  const monthIndex = parseInt(parts[1], 10) - 1; // Month -> 07
  const day = parseInt(parts[2], 10); // remove leading zeron and The Day -> 22

  return `${day} ${months[monthIndex]} ${year}`;
};

export default DateFormatter;
