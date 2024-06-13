import { useEffect, useRef } from "react";

export default function useClickOutside(callbackHandler) {
  const ref = useRef();
  useEffect(() => {
    let mouseDownFunc = (event) => {
      if (!ref.current?.contains(event.target)) {
        callbackHandler();
      }
    };
    document.addEventListener("mousedown", mouseDownFunc);
    return () => {
      document.removeEventListener("mousedown", mouseDownFunc);
    };
  }, [callbackHandler, ref]);
  return ref;
}
