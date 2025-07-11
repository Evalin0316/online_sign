import React, { ChangeEvent, useRef, useState } from "react";
import { uploadImage } from "../../actions/signImageAction";
import {
  ReactSketchCanvas as SketchCanvas,
  ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { ToastContainer, toast } from 'react-toastify';

import iconClose from "../../assets/images/icon_Close_Square_n.png";

interface ReactSketchCanvasProps {
  setShowAddSignModal: (show: boolean) => void;
  loadImageList: () => void;
}

const ReactSketchCanvas = (props: ReactSketchCanvasProps) => {
  const { setShowAddSignModal, loadImageList } = props;
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [strokeColor, setStrokeColor] = useState("#000000");

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  const saveSign = async() => {
    const canvasData = await canvasRef.current?.exportImage("png");
    
    if (!canvasData) {
      alert("Failed to export image");
      return;
    }

    const imageUriTransform = dataURItoBlob(canvasData);
    const fromData = new FormData();
    fromData.append('image', imageUriTransform ,'image'+ Math.round(Math.random()*1000));

    uploadImage(fromData)
    .then((res)=> {
      if (res.data.status == true) {
        toast.success(res.data.data, {
          position: 'top-center',
          autoClose: 2000
        });
        setShowAddSignModal(false);
        loadImageList();
      }
    })
    .catch((err)=> {
      alert(err.message);
    })
  }

  const dataURItoBlob = (dataURI: string) =>  {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:'image/png'});
  }

  return (
    <div className="card-inner absolute text-xl w-[500px] z-50 pop-container max-[768px]:w-[343px]">
     <div className="bg rounded-3xl overflow-hidden shadow-lg w-full">
        <div
          className="relative mt-3"
          onClick={() => setShowAddSignModal(false)}
        >
         <img
          className="absolute right-0 top-0 mr-4"
          src={iconClose}
          alt="close"
         />
        </div>
       <div className="index_Sign flex flex-col items-center w-full py-4 px-8 mt-8">
        <SketchCanvas
          width="100%"
          height="150px"
          ref={canvasRef}
          strokeColor={strokeColor}
          canvasColor={'transparent'}
        />
        </div>
       <div className="flex justify-around items-center my-3">
        <button
          type="button"
          onClick={handleClearClick}
          className="py-3 px-3 w-[80px] rounded-lg border-2 bg-white">
            清除
        </button>
        <div className="flex justify-center">
          <div className="rounded-[50%] bg-[#D2464F] w-8 h-8 cursor-pointer mx-2" onClick={() => setStrokeColor('#D2464F') }></div>
          <div className="rounded-[50%] bg-[#4665D2] w-8 h-8 cursor-pointer mx-2" onClick={() => setStrokeColor('#4665D2') }></div>
          <div className="rounded-[50%] bg-[#585C68] w-8 h-8 cursor-pointer mx-2" onClick={() => setStrokeColor('#585C68') }></div>
        </div>
        <button
          type="button"
          onClick={saveSign}
          className="py-3 px-3 w-[80px] rounded-lg border-2 bg-white">
            儲存
        </button>
       </div>
     </div>
   </div>
  );
}

export default ReactSketchCanvas;