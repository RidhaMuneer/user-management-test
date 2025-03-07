"use client"

import { PopupProps } from "@/types/pop-up.types";

const Popup: React.FC<PopupProps> = ({ children, isOpen }) => {
  if (isOpen) {
    return (
      <div className="popup-overlay">
        <div className="popup-content">{children}</div>
      </div>
    )
  } else {
    return null
  }
}

export default Popup

