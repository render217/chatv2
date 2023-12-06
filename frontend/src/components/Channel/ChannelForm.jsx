/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

export function ChannelForm({ type, data, setData }) {
  return (
    <>
      <div className="w-full">
        <h3 className="mb-4 text-lg uppercase text-clrPorcelain">{type} Channel</h3>
        <p className="mb-2    text-xs text-clrGunsmoke ">Channel Name</p>
        <input
          className="mb-1 w-full rounded-lg bg-clrShipGrey  px-4 py-2  text-sm text-clrPearlBush"
          name="name"
          type="text"
          autoComplete="off"
          value={data?.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="Channel name"
        />
        <p className=" mb-2 inline-block w-full  text-xs text-clrGunsmoke ">Channel Desciprtion</p>
        <textarea
          className="mb-1 w-full resize-none rounded-lg bg-clrShipGrey px-4 py-2 text-sm text-clrPearlBush"
          name="description"
          id=""
          cols="30"
          rows="3"
          value={data?.description}
          autoComplete="off"
          onChange={(e) => setData({ ...data, description: e.target.value })}
          placeholder="Channel Description"></textarea>
      </div>
    </>
  );
}

{
  /* <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            type="reset"
            className="text mt-2 w-20 rounded-lg bg-clrBalticSea px-4 py-1 text-sm text-clrPorcelain">
            cancel
          </button>
          <button
            disabled={submitting}
            className={twMerge(
              `${submitting ? "bg-clrBalticSea" : "bg-clrClearBlue"}`,
              "text mt-2 w-20 rounded-lg  px-4 py-1 text-sm text-clrPorcelain"
            )}>
            {submitting ? "saving..." : "save"}
          </button>
        </div> */
}
