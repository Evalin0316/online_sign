import React, { useState, useEffect, useRef } from 'react';
import { fabric } from "fabric";
// import CanvasDraw from './CanvasDraw';
// import bus from '../srcipt/bus';
import { loadImages, deleteImage, uploadImage } from '../../actions/signImageAction';
import ReactSketchCanvas from './reactSketchCanvas'

import iconSquare from '../../assets/images/icon_Close_Square_n.png';
import iconAddNewSign from '../../assets/images/icon_add_new_sign_n.svg';
import iconAddNewSignHover from '../../assets/images/icon_add_new_img_n.svg';

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
  const [ showAddSignModal, setShowAddSignModal ] = useState(false);
  const [isSignSelf, setIsSignSelf] = useState(true);
  const [getUrl, setGetUrl] = useState('');
  const [getStroke, setGetStroke] = useState('');
  const fileElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImageList();
  }, []);

  // load image list
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

  // delete image 
  const deleteImageBtn = (id: string, url: string) => {
    const getUrl = url.split('/');
    const imageName = getUrl[3];
    deleteImage(id, imageName)
      .then((res) => {
        if (res.data.status) {
          alert(res.data.data);
          setSignList(pre => pre.filter((image) => image.id !== id));
        }
      })
      .catch((err) => {
        alert(err.message);
    });
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

  // upload image
  const uploadImageBtn = () => {
    const fileInput = fileElement.current?.files?.[0];
  
    if (!fileInput) {
      alert('請選擇一張圖片');
      return;
    }
  
    if (fileInput.size <= 0) {
      alert('檔案大小為 0，請重新選擇圖片');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', fileInput);
  
    uploadImage(formData)
      .then((res) => {
        if (res.data.status) {
          alert(res.data.data);
          loadImageList();
        } else {
          alert('圖片上傳失敗');
        }
      })
      .catch((err) => {
        alert(`圖片上傳錯誤：${err.response?.data?.message || err.message}`);
      });
  };

  // add manual sign
  const addNewSign = () => {
    setShowAddSignModal(true);
  };

  return (
    <div className="draw_modal w-full left-0 top-0 fixed">
      {signList.length > 0 && (
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
                  <div key={idx} className="mb-2 relative">
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
                    <div 
                      className="absolute top-0 right-5" 
                      onClick={() => deleteImageBtn(item.id, item.imageUrl)}
                    >
                      <img
                        className="mr-4 mt-2"
                        src={iconSquare}
                        alt="delete"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <label
                className="flex justify-center proj-text-primary mt-4 font-bold text-lg whitespace-nowrap"
              >
                <img src={iconAddNewSign} alt="add" />
                <span className="text-[#8C5D19] font-[700] text-[14px] ml-1"  onClick={() => addNewSign()}>建立簽名</span>
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
      {/* sign list empty */}
      {signList.length === 0 && (
        <div className="card-inner absolute text-xl pop-container-choose w-full z-50">
          <div className="relative mt-3" onClick={() => setShowSignImagesList(false)}>
            <img
              className="absolute right-0 top-0 mr-4 mt-3 close_square"
              src={iconSquare}
              alt="close"
            />
          </div>
          <div className="bg rounded-3xl overflow-hidden shadow-lg w-full p-4">
            <div className="font-bold text-lg mb-8 whitespace-nowrap text-center">
              目前還沒有簽名喔~
            </div>
            <div className="text-sm text-center">請創建新的簽名檔，可上傳圖片或線上簽名</div>
            <div className='flex justify-center'>
              <div
                className="flex justify-center proj-text-primary mt-4 whitespace-nowrap bg-white rounded w-6/12"
                onClick={() => addNewSign()}
              >
                <img src={iconAddNewSign} alt="add" />
                <span
                  className="text-[#8C5D19] font-[700] text-[14px] ml-1"
                >
                  建立簽名
                </span>
              </div>
            </div>
            <div className='flex justify-center mb-4'>
              <div className="flex justify-center mt-4 bg-white rounded w-6/12">
                <img src={iconAddNewSignHover} alt="upload" />
                <span className="text-[#8C5D19] font-[700] text-[14px] ml-1">上傳簽名圖檔</span>
                <input
                  className="form-control hidden"
                  ref={fileElement}
                  type="file"
                  accept="image/*"
                  onChange={uploadImageBtn}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* add sign modal */}
      {showAddSignModal && (
        <ReactSketchCanvas
          setShowAddSignModal={setShowAddSignModal}
          loadImageList={loadImageList}
        />
      )}
    </div>
  );
};

export default SelectSign;
