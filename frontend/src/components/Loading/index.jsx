import { RotatingLines } from "react-loader-spinner";
export function Loading() {
  return (
    <div className="fixed grid h-screen w-screen place-content-center bg-clrBalticSea">
      <RotatingLines
        strokeColor="white"
        strokeWidth="5"
        animationDuration="0.75"
        width="70"
        visible={true}
      />
    </div>
  );
}
