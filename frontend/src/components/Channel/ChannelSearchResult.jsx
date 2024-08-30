import { ChannelList } from "./ChannelList";

/* eslint-disable react/prop-types */
export function ChannelSearchResult({ results }) {
  // console.log("results", results);
  let content;
  if (results.length === 0) {
    content = <p className="text-center text-sm">No Result Found</p>;
  }
  if (results.length > 0) {
    content = <ChannelList channels={results} />;
  }
  return (
    <>
      <div className="py-4">{content} </div>
    </>
  );
}
