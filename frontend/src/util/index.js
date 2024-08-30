import moment from "moment";

/**
 *
 * @param {async ()=>{}} api
 * @param {()=>{}} setLoading
 * @param {()=>{}} onSuccess
 * @param {()=>{}} onError
 */
export const requestHandler = async ({ api, setLoading, onSuccess, onError }) => {
  try {
    setLoading && setLoading(true);
    const { data } = await api();
    if (data?.success) {
      onSuccess(data.payload, data?.message);
    }
  } catch (error) {
    // console.log("ERROR (req.): ", error);
    onError(error?.response?.data?.message);
  } finally {
    setLoading && setLoading(false);
  }
};

export const formatDate = (dateString) => {
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
  } else if (formattedDate.isSameOrAfter(moment().startOf("month"))) {
    return formattedDate.format("MMMM D [at] h:mm A");
  } else {
    return formattedDate.format("MMMM D, YYYY [at] h:mm A");
  }
};
