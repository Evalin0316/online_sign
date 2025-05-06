import React, { useState, useEffect, useRef } from 'react';
import { fabric } from "fabric";
// import CanvasDraw from './CanvasDraw';
// import bus from '../srcipt/bus';
import { loadImages, deleteImage, uploadImage } from '../actions/signImageAction';

import iconSquare from '../assets/images/icon_Close_Square_n.png';
import iconAddNewSign from '../assets/images/icon_add_new_sign_n.svg';
import iconAddNewSignHover from '../assets/images/icon_add_new_img_n.svg';

interface SelectSignProps {
  setShowSignImagesList: (show: boolean) => void;
  addSignFromInventory: (url: string) => void;
}
interface SignList {
  id: string;
  url: string;
  hash: string;
  imageUrl: string;
}

const SelectSign = ({ setShowSignImagesList, addSignFromInventory }: SelectSignProps) => {
  const [ signList, setSignList ] = useState<SignList[]>([]);
  const [isSignSelf, setIsSignSelf] = useState(true);
  const [getUrl, setGetUrl] = useState('');
  const [isSelectMode, setIsSelectMode] = useState(true);
  const [getStroke, setGetStroke] = useState('');
  const fileElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImageList();
  }, []);

  const loadImageList = () => {
    loadImages()
      .then((res: any) => {
        if (res.data.status) {
          const allData = res.data.data;
          if (allData.length > 0) {
            const newSignList: any[] = [];
            allData.forEach((image: { imageUrl: string, _id: string, imageDeleteHash: string}) => {
              getBase64FromUrl(image.imageUrl, image._id, image.imageDeleteHash, newSignList);
            });
          } else {
            setSignList([]);
          }
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const deleteImageBtn = (id: string, hash: string, url: string) => {
    const getUrl = url.split('/');
    const imageName = getUrl[3];
    deleteImage(id, hash, imageName)
      .then((res) => {
        if (res.data.status) {
          alert(res.data.data);
          loadImageList();
        }
      })
      .catch((err) => {
        alert(err.message);
    });
  };

  const getSign = () => {
    setIsSelectMode(true);
    init();
  };

  const getBase64FromUrl = (imgUrl: string, id: string, hash: string, newSignList: SignList[]) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx?.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL();
      setGetUrl(dataUrl);
      newSignList.push({ id, url: dataUrl, hash: String(hash), imageUrl: String(imgUrl) });
      setSignList([...newSignList]);
    };
    image.src = imgUrl;
  };

  const uploadImageBtn = () => {
    const formData = new FormData() ?? '';
    const fileInput = fileElement.current?.files?.[0];
    formData.append('image', fileInput ?? '');
    if (fileInput?.size) {
      uploadImage(formData).then(
        (res) => {
          if (res.data.status) {
          alert(res.data.data);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
    }
  };

  // if (!showSignModal) return null;

  return (
    <div className="draw_modal w-full left-0 top-0 fixed">
      {signList.length > 0 && isSelectMode && (
        <div className="card-inner absolute text-xl pop-container-choose w-full z-50">
          <div className="relative mt-3" onClick={() => setShowSignImagesList(false)}>
            <img
              className="absolute right-0 top-0 mr-4 mt-3 close_square"
              src={iconSquare}
              alt="close"
            />
          </div>
          <div className="bg rounded-3xl overflow-hidden shadow-lg w-full">
            <div className="px-4 py-6 flex flex-col justify-center w-full">
              <div className="font-bold text-lg mb-8 whitespace-nowrap text-center proj-text-primary">
                選擇簽名
              </div>
              <div className="selected-modal overflow-auto flex items-center justify-center flex-wrap">
                {signList.map((item, idx) => (
                  <div key={idx} className="mb-2 flex justify-center">
                    <div
                      className="h-auto bg-white w-4/5 rounded-3xl py-2"
                      onClick={() => addSignFromInventory(item.url)}
                    >
                      <img
                        src={item.url}
                        className="sign mx-auto object-contain w-36 h-20"
                        alt=""
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span onClick={() => deleteImageBtn(item.id, item.hash, item.imageUrl)}>
                      <img
                        className="mr-4 mt-2"
                        src={iconSquare}
                        alt="delete"
                      />
                    </span>
                  </div>
                ))}
              </div>
              <label
                className="flex justify-center proj-text-primary mt-4 font-bold text-lg whitespace-nowrap"
                onClick={() => setIsSelectMode(false)}
              >
                <img src={iconAddNewSign} alt="add" />
                <span className="text-[#8C5D19] font-[700] text-[14px] ml-1">建立簽名</span>
              </label>
              <label className="flex justify-center proj-text-primary mt-4 font-bold text-lg whitespace-nowrap">
                <img src={iconAddNewSignHover} alt="upload" />
                <span className="text-[#8C5D19] font-[700] text-[14px] ml-1">上傳簽名圖檔</span>
                <input
                  className="form-control hidden"
                  ref={fileElement}
                  type="file"
                  accept="image/*"
                  onChange={uploadImageBtn}
                />
              </label>
            </div>
          </div>
        </div>
      )}
      {signList.length === 0 && isSelectMode && (
        <div className="card-inner absolute text-xl pop-container-choose w-full z-50">
        <div className="relative mt-3" onClick={() => setShowSignImagesList(false)}>
          <img
            className="absolute right-0 top-0 mr-4 mt-3 close_square"
            src={iconSquare}
            alt="close"
          />
        </div>
        <div className="bg rounded-3xl overflow-hidden shadow-lg w-full">
          <div className="px-4 py-6 flex flex-col justify-center w-full"></div>
            <div className="font-bold text-lg mb-8 whitespace-nowrap text-center">
              目前還沒有簽名喔~
            </div>
            <div className="text-sm">請創建新的簽名檔，可上傳圖片或線上簽名</div>
            <label
              className="flex justify-center proj-text-primary mt-4 whitespace-nowrap bg-white rounded"
              onClick={() => setIsSelectMode(false)}
            >
              <img src={iconAddNewSign} alt="add" />
              <span className="text-[#8C5D19] font-[700] text-[14px] ml-1">建立簽名</span>
            </label>
            <label className="flex justify-center mt-4 bg-white rounded">
              <img src={iconAddNewSignHover} alt="upload" />
              <span className="text-[#8C5D19] font-[700] text-[14px] ml-1">上傳簽名圖檔</span>
              <input
                className="form-control hidden"
                ref={fileElement}
                type="file"
                accept="image/*"
                onChange={uploadImageBtn}
              />
            </label>
          </div>
        </div>
      )}
      {/* {!isSelectMode && (
        <div className="card-inner absolute text-xl w-[500px] z-50 pop-container max-[768px]:w-[343px]">
          <div className="bg rounded-3xl overflow-hidden shadow-lg w-full">
            <div className="relative mt-3" onClick={() => setIsSelectMode(true)}>
              <img
                className="absolute right-0 top-0 mr-4"
                src="../assets/images/icon_Close_Square_n.png"
                alt="close"
              />
            </div>
            <div className="index_Sign flex flex-col items-center w-full py-4 px-2">
              <CanvasDraw
                isSignSelf={isSignSelf}
                closeWarning={closeWarning}
                getStroke={setGetStroke}
                sign={getSign}
              />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default SelectSign;
