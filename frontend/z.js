import moment from "moment";

const formatDate = (dateString) => {
  const formattedDate = moment(dateString);

  // Format relative time
  if (formattedDate.isSameOrAfter(moment().subtract(1, "minutes"))) {
    return "Just now";
  } else if (formattedDate.isSameOrAfter(moment().subtract(1, "hours"))) {
    const minutes = Math.floor(moment().diff(formattedDate, "minutes"));
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (formattedDate.isSameOrAfter(moment().startOf("day"))) {
    return formattedDate.format("h:mm A");
  } else if (formattedDate.isSameOrAfter(moment().subtract(1, "days").startOf("day"))) {
    return `Yesterday at ${formattedDate.format("h:mm A")}`;
  } else if (formattedDate.isSameOrAfter(moment().startOf("week"))) {
    return formattedDate.format("dddd [at] h:mm A");
  } else {
    return formattedDate.format("dddd HH:mm");
  }
};

const date = "2023-11-08T11:16:43.337+00:00";
const formattedDate = formatDate(date);
console.log(formattedDate);
