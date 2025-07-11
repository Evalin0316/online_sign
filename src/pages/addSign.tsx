import React, { useEffect, useRef, useState, useContext } from "react";
import { fabric } from "fabric";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

import AddTextModal from "../components/addSignModal/addTextModal";
import SelectSign from "../components/addSignModal/selectSign";
import Header from "../components/header";
import ProgressLine from "../components/progressLine";
import SaveConfirm from "../components/saveConfirmModal";
// import AlertMessage from "../components/AlertMessage";
// import bus from "../script/bus";
import { uploadFile, uploadSignInfo, uploadFileInfo } from "../actions/uploadFileActions";
import { AppContext } from "../provider";

const AddSign = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [ showTextModal, setShowTextModal ] = useState(false);
  const [ showSignImagesList, setShowSignImagesList ] = useState(false);
  const [ showSaveConfirm, setShowSaveConfirm ] = useState(false);
  const [ isSaveFile, setIsSaveFile ] =  useState(false);
  let canvas = useRef<fabric.Canvas | null>(null);

  const navigate = useNavigate();
  const appContext = useContext(AppContext) as {
    pageStatus: string;
    fileId: string | null;
    fileInfo: any;
    setFileId: (id: string | null) => void;
    setPageStatus: (status: string) => void;
  };
  const { pageStatus, fileId, fileInfo, setPageStatus } = appContext;
  
  const renderPDF = (file: File) => {
    const Base64Prefix = 'data:application/pdf;base64,'
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.mjs';

    const readBlob = (blob: Blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result))
        reader.addEventListener('error', reject)
        reader.readAsDataURL(blob)
      })
    }

    const printPDF = async(pdfData: any, index: number) => {
      let data = '';
      // Convert the file to base64
      pdfData = await readBlob(pdfData)
      // Remove the prefix from the base64 string and decode it
      data = atob(pdfData.substring(Base64Prefix.length))
      // Using the decoded file, load the PDF file and the first page
      const pdfDoc = await pdfjsLib.getDocument({ data }).promise
      const pdfPage = await pdfDoc.getPage(index ?? 1)
      const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio })

      // Set dimensions and generate canvas
      // const viewport = pdfPage.getViewport({ scale: 1 })
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      // Set the width and height for displaying the PDF and render it
      canvas.height = viewport.height
      canvas.width = viewport.width
      const renderContext: any = {
        canvasContext: context,
        viewport
      }
      const renderTask = pdfPage.render(renderContext)
      // Return the rendered PDF canvas
      return renderTask.promise.then(() => canvas)
    }

    const pdfToImage = async(pdfData:any) => {
      // Set the scale for converting PDF to image
      const scale = 1 / window.devicePixelRatio;
      return new fabric.Image(pdfData, {
        id: "renderPDF",
        scaleX: scale,
        scaleY: scale
      })
    }

    canvas.current = new fabric.Canvas('canvas');
    const renderInitialPage = async (pageIndex: number) => {
      canvas.current?.requestRenderAll();
      const pdfData = await printPDF(file, pageIndex);
      const pdfImage = await pdfToImage(pdfData);
      // Set canvas dimensions using scale
      canvas.current?.setWidth((pdfImage.width ?? 0) / window.devicePixelRatio);
      canvas.current?.setHeight((pdfImage.height ?? 0) / window.devicePixelRatio);

      // Set the PDF view as the background
      canvas.current?.setBackgroundImage(pdfImage, canvas.current.renderAll.bind(canvas.current));
    };
      
    renderInitialPage(1);
  };

  // add time stamp
  const addTimeStamp = () => {
    const day = new Date();
    const today = day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate();
    const text = new fabric.Text(today, {
      top: 10,
      left: 10,
      scaleX: 0.5,
      scaleY: 0.5
    });
    canvas.current.add(text);
  };

  // add sign from images inventory
  const showSignInventory = () => {
    setShowSignImagesList(true);
  };

  const addSignFromInventory = (url: string) => {
    fabric.Image.fromURL(url, (image) => {
      image.top = 100;
      image.left = 100;
      image.scaleX = 0.5;
      image.scaleY = 0.5;
      canvas.current.add(image);
    });
  }

  // add text use input filed
  const showAddText = () => {
    setShowTextModal(true);
  }

  const addTextFromInput = (text: string) => {
    const wording = new fabric.Text(text, {
      top: 100,
      left: 100,
      scaleX: 0.5,
      scaleY: 0.5
    });
    canvas.current.add(wording);
  }

  const showConfirmModal = () => {
    setShowSaveConfirm(true);
  }

  useEffect(() => {
    if (isSaveFile) {
      const pdf = new jsPDF();
      const image = canvas.current?.toDataURL("image/png")

      const width = pdf.internal.pageSize.width;
      const height = pdf.internal.pageSize.height
      if (image) {
        pdf.addImage(image, "png", 0, 0, width, height)
      }
      
      const blobPDF = new Blob([pdf.output('blob')],{type: 'application/pdf'})
      const fromData = new FormData();

      fromData.append('file', blobPDF, fileInfo.name);
      fromData.append('fileName', fileInfo.name);
  
      // NOTE: Upload the file using uploadFile and save its metadata using uploadSignInfo
      uploadFile(fromData)
        .then((res)=> {
          if (res.data.status) {
            let fileId = res.data.data.id;
            let signInfo = {
              title: fileInfo.name,
              isSigned: true
            }
            // upload sign info
            uploadSignInfo(fileId, signInfo)
            .then((res) => {
              if (res.data.status) {
                navigate('/');
              }
            })
            .catch((err) => {
              alert(err);
            })
          }
        })
        .catch((error) => {
          alert(error);
        })
    }
  }, [ isSaveFile ])

  useEffect(() => {
    renderPDF(fileInfo);
    setPageStatus("addSign");

    return () => {
      if (canvas.current) {
        canvas.current.dispose();
      }
    };
  }, []);

  return (
    <div>
      <Header
        pageStatus={pageStatus}
        fileId={fileId}
        addTimeStamp={addTimeStamp}
        addSignInventory={showSignInventory}
        addText={showAddText}
        nextStep={showConfirmModal}
      />
      <div className="container_sign">
        <div className="flex justify-center pt-10 pb-10">
          <ProgressLine arrStatus={['completed','doing','undone']} />
        </div>
        <div className="flex justify-center pt-10 pb-10">
          <div className="container_pdf h-screen relative overflow-x-hidden">
            <div className="container_viewer">
              <div id="viewer" tabIndex={10} className="container_viewer_inner overflow-x-hidden">
                <div className="react-pdf__Document">
                  <div id="pageContainer1" className="styled__WrapperPage-sc-cpx59f-2 cFGXRm page">
                    <div className="react-pdf__Page" data-page-number="1" style={{ position: "relative" }}>
                      <canvas id="canvas" className="react-pdf__Page__canvas block select-none"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <input type="file" className="form-control hidden pdf_upload" ref={fileInputRef} />
            {showTextModal && (
              <AddTextModal
                setShowTextModal={setShowTextModal}
                addTextFromInput={addTextFromInput}
              />
            )}
            {showSignImagesList && (
              <SelectSign
                setShowSignImagesList={setShowSignImagesList}
                addSignFromInventory={addSignFromInventory}
              />
            )}
            {showSaveConfirm && (
              <SaveConfirm 
                setShowSaveConfirm={setShowSaveConfirm}
                setIsSaveFile={setIsSaveFile}
              />
            )}
            {/* <AlertMessage showAlert={showAlert} textContent={alertText} uploadStatus={uploadStatus} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSign;
