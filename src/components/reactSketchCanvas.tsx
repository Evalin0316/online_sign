import React, { ChangeEvent, useRef, useState } from "react";
import { uploadImage } from "../actions/signImageAction";

import {
  ReactSketchCanvas as SketchCanvas,
  ReactSketchCanvasRef,
} from "react-sketch-canvas";

import iconClose from "../assets/images/icon_Close_Square_n.png";

interface ReactSketchCanvasProps {
  setShowAddSignModal: (show: boolean) => void;
}

const ReactSketchCanvas = (props: ReactSketchCanvasProps) => {
  const { setShowAddSignModal } = props;
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [strokeColor, setStrokeColor] = useState("#000000");
  // const [canvasColor, setCanvasColor] = useState("#ffffff");

  const handleStrokeColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(event.target.value);
  };

  // const handleCanvasColorChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setCanvasColor(event.target.value);
  // };

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
    .then((res)=>{
      if (res.data.status == true) {
        alert(res.data.data)
      }
    })
    .catch((err)=>{
      alert(err.message);
    })
  }

  const dataURItoBlob = (dataURI: string) =>  {
    console.log(dataURI);
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
       <div className="relative mt-3"
          onClick={() => setShowAddSignModal(false)}
        >
         <img
          className="absolute right-0 top-0 mr-4"
          src={iconClose}
          alt="close"
         />
       </div>
       <div className="index_Sign flex flex-col items-center w-full py-4 px-2 mt-4">
        <SketchCanvas
          width="100%"
          height="150px"
          ref={canvasRef}
          strokeColor={strokeColor}
          // canvasColor={canvasColor}
        />
       </div>
       <div className="flex justify-around">
        <button
          type="button"
          onClick={handleClearClick}
          className="py-3 px-3 w-[80px] rounded-lg border-2 bg-white">
            Clear
        </button>
        <div className="flex justify-center">
          <input
            type="color"
            value={strokeColor}
            onChange={handleStrokeColorChange}
          />
        </div>
        <button
          type="button"
          onClick={saveSign}
          className="py-3 px-3 w-[80px] rounded-lg border-2 bg-white">
            Save
        </button>
       </div>
     </div>
   </div>
  );
}

export default ReactSketchCanvas;