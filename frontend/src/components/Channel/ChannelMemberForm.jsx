/* eslint-disable react/prop-types */

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { requestHandler } from "../../util";
import { api } from "../../api";
import useUIStore from "../../store/useUIStore";
import useChannelStore from "../../store/useChannelStore";
import { useChat } from "../../context/ChatProvider";

export function ChannelMemberForm({ size, participants, setParticipants, editMode }) {
  const [loading, setLoading] = useState(false);
  const [showSearchList, setShowSearchList] = useState(true);
  const [allowAdd, setAllowAdd] = useState(false);
  const [avaliableUsers, setAvaliableUsers] = useState([]);

  const [searchName, setSearchName] = useState("");

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // const selectedChannel = useChannelStore((state) => state.selectedChannel);
  const { selectedChannel } = useChat();

  const handleSearchName = (e) => {
    setSearchName(e.target.value);
    if (e.target.value !== "") {
      const filteredUsers = avaliableUsers.filter((user) =>
        user.username.toLowerCase().includes(e.target.value)
      );
      const userList = filteredUsers.filter((user) => {
        if (selectedUsers.find((u) => u._id === user._id)) {
          return false;
        } else {
          return true;
        }
      });
      setSearchedUsers(userList);
    } else {
      const filteredUsers = avaliableUsers.filter((user) => {
        if (selectedUsers.find((u) => u._id === user._id)) {
          return false;
        } else {
          return true;
        }
      });
      setSearchedUsers(filteredUsers);
    }
  };

  const handleSelectUser = (user) => {
    setSearchedUsers((prev) => prev.filter((u) => u._id !== user._id));

    const updatedSelectedUsers = [...selectedUsers, user];
    setSelectedUsers(updatedSelectedUsers);
    synchornizeSelectedUser(updatedSelectedUsers);
  };

  const handleRemoveUser = (user) => {
    const updatedSelectedUsers = selectedUsers.filter((u) => u._id !== user._id);
    setSelectedUsers(updatedSelectedUsers);
    synchornizeSelectedUser(updatedSelectedUsers);
    setSearchedUsers((prev) => [user, ...prev]);
  };

  const synchornizeSelectedUser = (users) => {
    let selectedUsersId = users.map((user) => user._id);
    setParticipants(selectedUsersId);
  };

  const getAvaliableUsers = async () => {
    setLoading(true);
    requestHandler({
      api: async () => api.getAvalialbeUsers(),
      setLoading,
      onSuccess: (payload) => {
        // console.log("avaliable users", payload);
        setAvaliableUsers(payload.users);
        setSearchedUsers(payload.users);
      },
      onError: (err) => {
        // console.log(err);
      },
    });
  };

  const getAvaliableUsersNotInChannel = async () => {
    setLoading(true);
    requestHandler({
      api: async () => api.getAvalialbeUsers(),
      setLoading,
      onSuccess: (payload) => {
        // console.log("avaliable users", payload);
        const notInChannelUsersList = payload?.users?.filter((user) => {
          if (selectedChannel.participants.find((u) => u._id === user._id)) {
            return false;
          } else {
            return true;
          }
        });
        setAvaliableUsers(notInChannelUsersList);
        setSearchedUsers(notInChannelUsersList);
      },
      onError: (err) => {
        // console.log(err);
      },
    });
  };

  useEffect(() => {
    if (!editMode) {
      getAvaliableUsers();
    } else {
      getAvaliableUsersNotInChannel();
    }
  }, [editMode]);

  return (
    <>
      <div className="mb-2 flex items-center gap-10 py-1">
        <p className=" text-xs text-clrGunsmoke ">Channel Member</p>
      </div>

      <div className="w-full rounded-lg bg-clrShipGrey px-4 py-2 text-sm  outline-none">
        <div className="mb-4">
          <input
            type="text"
            value={searchName}
            onChange={handleSearchName}
            placeholder="Search username"
            className="w-full rounded-md border-0 bg-clrBalticSea px-2 py-2 text-clrGunsmoke outline-none"
          />
        </div>
        {showSearchList && (
          <div className="custom-common-scroll h-[100px] overflow-y-scroll px-2">
            {avaliableUsers.length > 0 &&
              searchedUsers.map((user) => (
                <div
                  onClick={() => handleSelectUser(user)}
                  className="my-1 cursor-pointer  rounded-md border border-clrBalticSea px-2 py-2 text-clrPearlBush hover:bg-clrBalticSea"
                  key={user._id}>
                  {user.username}
                </div>
              ))}
            {searchedUsers.length === 0 && (
              <p className=" px-3 py-1 text-center text-xs text-white"> No Username found.</p>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-5 px-2 py-4">
        {selectedUsers.length > 0 &&
          selectedUsers.map((user) => (
            <div key={user._id} className="relative">
              <p className="rounded-2xl bg-clrBalticSea px-3 py-1 text-xs text-white ">
                {user.username}
              </p>
              <span
                onClick={() => handleRemoveUser(user)}
                className="absolute -right-2 -top-2 m-0 grid h-4 w-4 cursor-pointer place-content-center rounded-full bg-clrGunsmoke p-0 text-xs font-bold ">
                x
              </span>
            </div>
          ))}
      </div>
    </>
  );
}
