/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { requestHandler } from "../../util";
import { api } from "../../api";

export default function UserChatForm({ selectedUser, setSelectedUser }) {
  const [loading, setLoading] = useState(false);

  const [avaliableUsers, setAvaliableUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchName, setSearchName] = useState("");

  const [showSearchList, setShowSearchList] = useState(true);

  const getAvaliableUsers = async () => {
    requestHandler({
      api: async () => api.getAvalialbeUsers(),
      setLoading,
      onSuccess: (payload) => {
        setAvaliableUsers(payload.users);
        setSearchedUsers(payload.users);
      },
      onError: (err) => {},
    });
  };

  useEffect(() => {
    getAvaliableUsers();
  }, []);

  const handleSearchName = (e) => {
    setSearchName(e.target.value);

    const filteredUsers = avaliableUsers.filter((user) =>
      user.username.toLowerCase().includes(e.target.value)
    );
    setSearchedUsers(filteredUsers);
  };
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchName(user?.username);
  };
  const handleRemoveUser = () => {
    setSelectedUser(null);
    setSearchName("");
  };
  return (
    <div>
      <h3 className="mb-4 text-lg uppercase text-clrPorcelain">Start Chat With</h3>
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
          <div className="custom-common-scroll h-[230px] overflow-y-scroll px-2">
            {avaliableUsers.length > 0 &&
              searchedUsers.map((user) => (
                <div
                  onClick={() => handleSelectUser(user)}
                  className={`my-1 cursor-pointer  rounded-md border border-clrBalticSea px-2 py-2 text-clrPearlBush hover:bg-clrBalticSea`}
                  key={user._id}>
                  {user.username}
                </div>
              ))}
            {searchedUsers.length === 0 && (
              <p className=" px-3 py-1 text-center text-xs text-white"> No Username found.</p>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-5 px-2 py-4">
          {selectedUser && (
            <div key={selectedUser?._id} className="relative">
              <p className="rounded-2xl bg-clrBalticSea px-3 py-1 text-xs text-white ">
                {selectedUser?.username}
              </p>
              <span
                onClick={handleRemoveUser}
                className="absolute -right-2 -top-2 m-0 grid h-4 w-4 cursor-pointer place-content-center rounded-full bg-clrGunsmoke p-0 text-xs font-bold ">
                x
              </span>
            </div>
          )}
          <p className="invisible  rounded-2xl px-3 py-1 text-xs text-white">....</p>
        </div>
      </div>
    </div>
  );
}
