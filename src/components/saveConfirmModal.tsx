import React from "react";

interface SaveConfirmProps {
  setShowSaveConfirm: (show: boolean) => void
}

const SaveConfirm = ({ setShowSaveConfirm }: SaveConfirmProps) => {
  return (
    <div className="w-full left-0 top-0 fixed h-screen" style={{ 'background':'rgba(140, 93, 25, 0.3)' }}>
      <div className="confirm__container">
            <div className="confirm__container__title font-extrabold">確定要送出嗎?</div>
            <div className="flex flex-col confirm__container__group">
                <div className="confirm__container__group__button font-bold">確定</div>
                <div className="confirm__container__group__button font-bold" onClick={() => setShowSaveConfirm(false)}>再檢查一下~</div>
            </div>
      </div>
    </div>
  )
}


export default SaveConfirm;