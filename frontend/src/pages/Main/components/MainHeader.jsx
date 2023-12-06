/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import useUIStore from "../../../store/useUIStore";
import { twMerge } from "tailwind-merge";

export const MainHeader = ({ title }) => {
  const toggleSideBar = useUIStore((state) => state.toggleSideBar);
  const channelTitle = title?.toUpperCase() || "";
  return (
    <div>
      <div className="flex items-center gap-5">
        <div className={twMerge(`hidden max-md:block`)}>
          <p className="cursor-pointer text-xl" onClick={toggleSideBar}>
            <FontAwesomeIcon icon={faList} />
          </p>
        </div>

        <h3 className=" overflow-ellipsis text-lg font-semibold text-clrPearlBush">
          {channelTitle ? channelTitle : <p className="invisible">_</p>}
        </h3>
      </div>
    </div>
  );
};
