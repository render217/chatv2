import { createPortal } from "react-dom";
import useUIStore from "../../store/useUIStore";
export const Modal = ({ children }) => {
  const modalRoot = document.getElementById("modal-root");
  const closeModal = useUIStore((state) => state.closeModal);
  return createPortal(
    <>
      <div
        className="absolute inset-0 z-50 grid place-content-center bg-clrSmokyBlack/80"
        onClick={closeModal}>
        {children}
      </div>
    </>,
    modalRoot
  );
};
