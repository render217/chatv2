import { Navigate, Outlet } from "react-router-dom";
import { Loading, Sidebar } from "../components";
import useUIStore from "../store/useUIStore";

import { twMerge } from "tailwind-merge";
import { useAuth } from "../context/AuthProvider";

export default function AppLayout() {
  const showSideBar = useUIStore((state) => state.showSideBar);
  const closeSideBar = useUIStore((state) => state.closeSideBar);
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <Loading />;
  }
  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }
  return (
    <>
      <div className="min-h-screen bg-clrBalticSea font-NotoSans">
        <div className="relative flex h-screen text-white">
          {/*------- SIDEBAR------ */}
          <div
            className={twMerge(
              ` fixed z-50  h-screen  max-xs:w-full md:block`,
              ` w-[18rem] bg-clrSmokyBlack   `,
              `${showSideBar ? "block" : "hidden"}`
            )}>
            <Sidebar />
          </div>
          {/*------- SIDEBAR------ */}

          {/*------- OVERLAY------ */}
          <div
            onClick={closeSideBar}
            className={twMerge(
              "absolute inset-0 z-10 bg-clrBalticSea/90 md:hidden",
              `${showSideBar ? "" : "hidden"}`
            )}></div>
          {/*------- OVERLAY------ */}

          {/*------- MAIN------ */}
          <div
            className={twMerge(
              `flex-1 md:ml-[18rem]`,
              `${showSideBar ? "" : ""} `
            )}>
            <Outlet />
          </div>

          {/*------- MAIN------ */}
        </div>
      </div>
    </>
  );
}

{
  /* <div
            onClick={closeCart}
            className={twMerge(
              "fixed  h-screen w-full bg-black/50 lg:hidden",
              `${isCartOpen ? "" : "hidden"}`
            )}></div>
          
          <div
            className={twMerge(
              "max-lg:bg-clrRosyFinch max-xs:w-full absolute right-0 h-screen w-[350px] max-lg:w-[350px]  lg:block",
              `${isCartOpen ? "" : "hidden"}`
            )}>
            <Cart />
          </div>
             */
}

//  <div className="min-h-screen bg-clrBalticSea font-NotoSans">
//    <div className="relative flex h-screen text-white">
//      {isMobileScreen ? (
//        showSideBar ? (
//          <div className="fixed bottom-0 top-0  z-30 min-w-[18rem]  max-w-[18rem] bg-clrSmokyBlack">
//            <Sidebar />
//          </div>
//        ) : null
//      ) : (
//        <div className=" w-[18rem] bg-clrSmokyBlack">
//          <Sidebar />
//        </div>
//      )}
//      {showSideBar && isMobileScreen && (
//        <div
//          onClick={closeSideBar}
//          className="absolute inset-0 z-10 bg-clrBalticSea/90"></div>
//      )}
//      <div className="flex-1">
//        <Outlet />
//      </div>
//    </div>
//  </div>;
