import React from "react";
import finish from "../assets/images/finish.svg";
import sign from "../assets/images/sign.svg";
import upload from "../assets/images/upload.svg";

interface ProgressLineProps {
  arrStatus: string[];
}

const Progress = ({ arrStatus = [] }: ProgressLineProps) => {
  const progressData = [
    {
      img: upload,
      text: "上傳簽署檔案",
      upload_status: arrStatus[0],
    },
    {
      img: sign,
      text: "進行簽署",
      upload_status: arrStatus[1],
    },
    {
      img: finish,
      text: "簽署完成",
      upload_status: arrStatus[2],
    },
  ];

  return (
    <div className="progress">
      <ul className="progress__content">
        {progressData.map((item, i) => (
          <li
            key={i}
            className={`progress__content__item ${
              item.upload_status === "completed"
                ? "progress__content__item--completed"
                : item.upload_status === "doing"
                ? "progress__content__item--doing"
                : "progress__content__item--undone"
            }`}
          >
            <img src={item.img} alt="progress" />
            <div className="progress__content__item__text">{item.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Progress;
