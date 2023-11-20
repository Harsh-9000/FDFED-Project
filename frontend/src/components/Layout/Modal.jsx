import { AiOutlineClose } from "react-icons/ai";
import React from "react";

const Modal = ({ isOpen, onCloseBackdrop,onCloseButton, children, maxWidth }) => {
  return (
    <>
      {isOpen && (
        <>
          <div className="modal" onClick={onCloseBackdrop}></div>
          <div className="modal-content" style={{  maxWidth }}>
            <div className="close text-slate-700 ">
              <AiOutlineClose size="1rem" onClick={onCloseButton} />
            </div>
            {children}
          </div>
        </>
      )}
      <style jsx="true">{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }

        .modal-content {
          z-index: 150;
          width: 90%;
          border-radius: 8px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          background-color: white;
          position: fixed;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 50%;
        }

        .close {
          position: absolute;
          top: 8px;
          right: 8px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Modal;
