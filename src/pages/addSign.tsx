import React, { useEffect, useRef, useState, useContext } from "react";
import { fabric } from "fabric";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

import AddTextModal from "../components/addTextModal";
import SelectSign from "../components/selectSign";
import Header from "../components/header";
import ProgressLine from "../components/progressLine";
// import AlertMessage from "../components/AlertMessage";
// import bus from "../script/bus";
import { uploadFile, uploadSignInfo, uploadFileInfo } from "../actions/uploadFileActions";
import { AppContext } from "../provider";

const AddSign = () => {
  const canvasRef = useRef<StaticCanvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [ showTextModal, setShowTextModal ] = useState(false);
  const [ showSignImagesList, setShowSignImagesList ] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [uploadStatus, setUploadStatus] = useState(false);
  const [fileName, setFileName] = useState("");
  const [signTitle, setSignTitle] = useState("");
  const [isFileChange, setIsFileChange] = useState(false);
  const [isFileNameChange, setIsFileNameChange] = useState(false);
  const navigate = useNavigate();
  let canvas: any = '';

  const appContext = useContext(AppContext) as {
    pageStatus: string;
    fileId: string | null;
    fileInfo: any;
    setPageStatus: (status: string) => void;
  };
  const { pageStatus, fileId, fileInfo, setPageStatus } = appContext;
  

  useEffect(() => {
    // 若已存在舊的 canvas 實例，釋放資源
    // if (canvasRef.current) {
    //   canvasRef.current.dispose();
    // }

    // const canvas = new StaticCanvas("canvas");
    // canvasRef.current = canvas;

    // const helloText = new FabricText("Hello world!", {
    //   top: 50,
    //   left: 50,
    //   fontSize: 24,
    // });
    // canvas.add(helloText);
    // canvas.centerObject(helloText);

    renderPDF(fileInfo);
    setPageStatus("addSign");

    // 清除時 dispose
    return () => {
      canvas.dispose();
    };
  }, []);

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

    const printPDF = async(pdfData, index) => {
      let data = '';
      // 將檔案處理成 base64
      pdfData = await readBlob(pdfData)
      // 將base64 中的前綴刪除，並進行解碼
      data = atob(pdfData.substring(Base64Prefix.length))
      // 利用解碼的檔案，載入PDF檔及第一頁
      const pdfDoc = await pdfjsLib.getDocument({ data }).promise
      const pdfPage = await pdfDoc.getPage(index ?? 1)
      // pageCount.value = pdfDoc.numPages
      const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio })

      // 設定尺寸及產生canvas
      // const viewport = pdfPage.getViewport({ scale: 1 })
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      // 設定PDF 所要顯示的寬高及渲染
      canvas.height = viewport.height
      canvas.width = viewport.width
      const renderContext: any = {
        canvasContext: context,
        viewport
      }
      const renderTask = pdfPage.render(renderContext)
      // 回傳做好的PAF canvas
      return renderTask.promise.then(() => canvas)
    }

    const pdfToImage = async(pdfData:any) => {
      // 設定 PDF 轉為圖片時的比例
      const scale = 1 / window.devicePixelRatio;
      return new fabric.Image(pdfData, {
        id: "renderPDF",
        scaleX: scale,
        scaleY: scale
      })
    }

    canvas = new fabric.Canvas('canvas')
    const Init = async (index: number) => {
      canvas.requestRenderAll();
      const pdfData = await printPDF(file, index);
      const pdfImage = await pdfToImage(pdfData);
      // 透過比例設定canvas 尺寸
      canvas.setWidth(pdfImage.width / window.devicePixelRatio)
      canvas.setHeight(pdfImage.height / window.devicePixelRatio)
      // canvas.setWidth(pdfImage.width)
      // canvas.setHeight(pdfImage.height)

      // 將 PDF 畫面設定為背景
      canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas))
    }

    Init(1);

    // /*------------加入簽名-------------*/
    // const sign = document.querySelector('.signBtn')
    // sign.addEventListener('click', () => {
    // bus.emit('addCanvas',canvas);
    // showSignModal.value = true;
    // })

    // /*------------加入日期-------------*/
    // const dateBtn = document.querySelector('.dateBtn')
    // let day = new Date();
    // const today = day.getFullYear() + '/' + (day.getMonth() +1) + '/' + day.getDate();

    // dateBtn.addEventListener('click', () => {
    //   var text = new fabric.Text(today, (image) => {
    //     image.top = 10
    //     image.left = 10
    //     image.scaleX = 0.5
    //     image.scaleY = 0.5
    //   })
    //   canvas.add(text)
    // })

    // /*------------開啟新增文字dialog-------------*/
    // const textBtn = document.querySelector('.textBtn')
    // textBtn.addEventListener('click', () => {
    //     showText.value = true;
    // })
  };

  // add sign from images inventory
  const addSignInventory = () => {
    console.log("addSignInventory")
    setShowSignImagesList(true);
  }

  // add time stamp
  const addTimeStamp = () => {
    console.log("addTimeStamp")
    const day = new Date();
    const today = day.getFullYear() + '/' + (day.getMonth() +1) + '/' + day.getDate();
    const text = new fabric.Text(today, {
      top: 10,
      left: 10,
      scaleX: 0.5,
      scaleY: 0.5
    });
    canvas.add(text);
  }

  return (
    <div>
      <Header
        pageStatus={pageStatus}
        fileId={fileId}
        addTimeStamp={addTimeStamp}
        addSignInventory={addSignInventory}
      />
      <div className="container_sign">
        <div className="flex justify-center pt-10 pb-10">
          <ProgressLine arrStatus={['alreadyDo','nowDo','willDo']} />
        </div>
        <div className="flex justify-center pt-10 pb-10">
          <div className="container_pdf h-screen relative overflow-x-hidden">
            <div className="styledCreate__WrapperRight-sc-1i4fuzv-10 cKAFxH">
              <div id="viewer" tabIndex={10} className="styled__Wrapper-sc-cpx59f-1 gKmbon overflow-x-hidden">
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
            {/* <AddTextModal showModal={showTextModal} onClose={() => setShowTextModal(false)} /> */}
            { showSignImagesList && (
              <SelectSign
                setShowSignImagesList={setShowSignImagesList}
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
