import React, { useState } from "react";
import { redirectDocument } from "react-router-dom";
export default function NewProject() {
  const [modal, setModal] = useState(false);

  return (
    <div
      className="border border-neutral-800 flex justify-center items-center h-[310px]"
      onClick={()=>{}}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg "
        height={100}
        width={100}
        fill="#262626"
        viewBox="0 0 448 512"
      >
        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
      </svg>
      <dialog id="my_modal_1" className="modal visible" onClick={() => {}}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
