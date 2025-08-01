import React, { useState, useEffect } from "react";
import Button from "./button";
import TooltipLink from "./tooltip";
import { useParams, useNavigate } from "react-router-dom";

import logo from "../assets/images/sign_logo.svg";
import tabSign from "../assets/images/Tab_sign.png";
import tabDate from "../assets/images/Tab_date.png";
import tabText from "../assets/images/Tab_text.png";

interface Props {
  pageStatus: string,
  nextStep: () => void,
  fileId: string | null,
  addSignInventory: () => void,
  addTimeStamp: () => void,
  addText: () => void,
  saveDraft: () => void
}

const Header = (props: Props) => {
  const navigate = useNavigate();
  const { pageStatus, nextStep, fileId, addSignInventory, addTimeStamp, addText, saveDraft } = props;
  const [tooltipText] = useState<string>(
    '<ol class="text-left"><li>1.檔案儲存草稿後可再更換檔案及檔名</li><li>2.需更換檔案才可以更改「簽名擋」</li></ol>'
  );

  const previousPath = () => {
    if (pageStatus === "fileUpload") {
      return '/';
    } else if (pageStatus !== "fileUpload" && fileId) {
      return `/upload/${fileId}`;
    } else if (pageStatus !== "fileUpload") {
      return '/upload';
    }
    return '/';
  }

  return (
    <div className="bg-white text-black">
      {/* signList */}
      {pageStatus === "signList" && (
        <div className="flex items-center justify-center relative h-[66px]">
          <div className="absolute left-0 ml-5 py-3">
            <img src={logo} alt="Logo" />
          </div>
        </div>
      )}

      {/* fileUpload */}
      {pageStatus !== "signList" && (
        <div className="container_tab flex justify-between items-center p-2.5">
          <Button
            buttonText={pageStatus === 'fileUpload' ? 'Cancel' : 'Previous'}
            textPosition="ml-5"
            otherClass=""
            applyFn={() => navigate(previousPath())}
          >
            <img
              className="left-2 top-1 absolute"
              src="../../src/assets/images/icon_arrows_left_n.svg"
              alt="Cancel"
            />
          </Button>
          <div
            className={`flex justify-between ${
              pageStatus === 'addSign' ? "" : "hidden"
            }`}
          >
            <a className="signBtn flex flex-col items-center w-20 cursor-pointer" onClick={addSignInventory}>
              <img src={tabSign} alt="Sign" />
            </a>
            <a className="dateBtn flex flex-col items-center w-20 cursor-pointer" onClick={addTimeStamp}>
              <img src={tabDate} alt="Date" />
            </a>
            <a className="textBtn flex flex-col items-center w-20 cursor-pointer" onClick={addText}>
              <img src={tabText} alt="Text" />
            </a>
          </div>
          <div className="flex flex-wrap">
            <div className="flex max-[594px]:mb-3">
              {/* <TooltipLink tipText={tooltipText}>
                <Button
                  buttonText="Draft"
                  textPosition="mr-6"
                  className={`max-[560px]:m-0 mr-3 ${
                    fileReview ? "" : "hidden"
                  }`}
                  onClick={saveDraft}
                >
                  <img
                    className="right-4 top-2 absolute"
                    src="../../src/assets/images/icon_arrows_right_n.svg"
                    alt="Draft"
                  />
                </Button>
              </TooltipLink> */}
              <Button
                buttonText="Draft"
                textPosition="mr-6"
                otherClass={`max-[560px]:m-0 mr-3 ${
                  pageStatus !== 'fileUpload' ? "" : "hidden"
                }`}
                applyFn={saveDraft}
              >
                <img
                  className='right-4 top-2 absolute'
                  src="../../src/assets/images/icon_arrows_right_n.svg"
                  alt="Draft"
                />
              </Button>
            </div>
            <Button
              buttonText={pageStatus !== 'fileUpload' ? "Save" : "Next"}
              textPosition="mr-6"
              applyFn={nextStep}
              otherClass=""
            >
              <img
                className="right-4 top-2 absolute"
                src="../../src/assets/images/icon_arrows_right_n.svg"
                alt="Next"
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
