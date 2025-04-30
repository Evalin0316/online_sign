import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Header from "../components/header";
import ProgressLine from "../components/progressLine";
import SaveConfirm from "../components/SaveConfirm";
// import bus from "../script/bus";
import { getFileDetail, getSingleFile } from "../actions/uploadFileActions";
import { AppContext } from '../provider';


const FileUpload = () => {
  const navigate = useNavigate();

  const [ filename, setFilename ] = useState("");
  // const [ isFileReview, setIsFileReview ] = useState(false);
  const [ arrStatus, setArrStatus ] = useState(["nowDo", "willDo", "willDo"]);
  const [ step, setStep ] = useState(1);
  const [ isFileExist, setIsFileExist ] = useState(false);
  const [ showConfirmModal, setShowConfirmModal ] = useState(false);
  const [ signFileName, setSignFileName ] = useState("");
  const fileElement = useRef<HTMLInputElement>(null);
  const { id: fileId } = useParams<{ id?: string }>();

  const appContext = useContext(AppContext) as {
    pageStatus: string;
    setPageStatus: (status: string) => void;
    setFileId: (id: string | null) => void;
    setFileInfo: (info: object) => void;
  };
  const { pageStatus, setPageStatus, setFileId, setFileInfo } = appContext;

  useEffect(() => {
    setPageStatus("fileUpload");
    setFileId(fileId || null);
  }, []);

  useEffect(() => {
    if (fileId) {
      getFileDetail(fileId)
        .then((res) => {
          if (res.data.status) {
            setFilename(res.data.data.fileName);
            setSignFileName(res.data.data.signTitle);

            if (res.data.data.fileName) {
              setStep(2);
              setIsFileExist(true);
              // setIsFileReview(false);
            }

            // get file information
            getSingleFile(res.data.data.fileLocation).then((fileRes) => {
              const usedFile = new File([fileRes.data], res.data.data.fileName, {
                type: "application/pdf",
              });
              setFileInfo(usedFile);
            });
          }
        })
        .catch((err) => {
          alert(err.message);
        })
        // .finally(() => {
        //   bus.emit("page-loading", false);
        // });
    }
  }, [ fileId ]);

  const uploadFile = (data: FileList | null | undefined) => {
    let fileData;
    if (data) {
      fileData = data[0];
      setFileInfo(fileData);
    } else if (fileElement.current?.files?.length) {
      fileData = fileElement.current.files[0];
    }

    if (fileData) {
      if (fileData.size >= 200 * 1024 * 1024) {
        alert("不可超過200mb");
        return;
      }

      setFilename(fileData.name);
      setSignFileName(fileData.name);

      setIsFileExist(true);
      setStep(2);
    } else {
      setStep(1);
      setIsFileExist(false);
    }
  };

  const nextStep = () => {
    if (isFileExist) {
      // setIsFileReview(true);
      setArrStatus(["alreadyDo", "nowDo", "willDo"]);
      navigate('/addSign');
      // setShowConfirmModal(true);
    } else {
      alert("請先上傳檔案");
    }
  };

  const prevPage = () => {
    setArrStatus(["nowDo", "willDo", "willDo"]);
    // setIsFileReview(false);
    setShowConfirmModal(false);
    if (fileElement.current) {
      fileElement.current.value = "";
    }
  };

  const saveDraft = () => {
    // Uncommented to fix the error
    // Replace with actual implementation if needed
    console.log("Draft saved");
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const dragleave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const ondragover = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const ondrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.files;
    if (data.length < 1) return;
    if (data[0].size >= 200 * 1024 * 1024) {
      alert("不可超過200mb");
      return;
    }
    uploadFile(data);
  };

  return (
    <div>
      <Header
        nextStep={nextStep}
        prevPage={prevPage}
        saveDraft={saveDraft}
        pageStatus={pageStatus}
        fileId={fileId}
      />
      <div className="container_sign">
        <div className="flex justify-center pt-10 pb-10">
          <ProgressLine arrStatus={["nowDo", "willDo", "willDo"]} />
        </div>
        <div className="flex justify-center">
          <div
            className="upload_content rounded-md flex items-center justify-center my-4 flex-col"
            onDrop={ondrop}
            onDragLeave={dragleave}
            onDragOver={ondragover}
          >
            <div className="border rounded-md border-dashed flex justify-center items-center flex-col upload_inner">
              <div className="break-all text-black">
                {isFileExist ? filename : ""}
              </div>
              {!isFileExist && (
                <label className="mb-2 upload mt-1">
                  <input
                    className="form-control hidden"
                    type="file"
                    ref={fileElement}
                    accept="application/pdf"
                    onChange={(e) => uploadFile(e.target.files || undefined)}
                  />
                </label>
              )}
              {isFileExist && (
                <label className="mb-2 reupload mt-1">
                  <input
                    className="form-control hidden"
                    type="file"
                    ref={fileElement}
                    accept="application/pdf"
                    onChange={(e) => uploadFile(e.target.files || undefined)}
                  />
                </label>
              )}
              {!isFileExist && (
                <div>
                  <div className="mb-2 font-bold text-black">
                    或直接拖放檔案進來
                  </div>
                  <div className="font-bold text-black">
                    檔案限制格式：pdf，大小200mb以下
                  </div>
                </div>
              )}
            </div>
            {step === 2 && isFileExist && (
              <div className="mt-8 upload_inner border rounded-md border-dashed flex justify-center items-center flex-col">
                <p className="text-left file_title text-black">文件命名</p>
                <input
                  type="text"
                  className="file_name bg-white file_name_input text-black"
                  value={signFileName}
                  onChange={(e) => setSignFileName(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        {/* <SaveConfirm
          showConfirmModal={showConfirmModal}
          hideConfirmModal={hideConfirmModal}
        /> */}
      </div>
    </div>
  );
};

export default FileUpload;

