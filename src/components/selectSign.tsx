import React, { useState, useEffect, useRef } from 'react';
// import CanvasDraw from './CanvasDraw';
// import bus from '../srcipt/bus';
import { loadImages, deleteImage, uploadImage } from '../actions/signImageAction';

interface SelectSignProps {
  setShowSignModal: (show: boolean) => void;
}

const SelectSign = ({ setShowSignModal }: SelectSignProps) => {
  const [signArr, setSignArr] = useState([]);
  const [isSignSelf, setIsSignSelf] = useState(true);
  const [getUrl, setGetUrl] = useState('');
  const [getSignData, setGetSignData] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(true);
  const [getCanvas, setGetCanvas] = useState(null);
  const [getStroke, setGetStroke] = useState('');
  const fileElement = useRef(null);

  useEffect(() => {
    init();
    // const handleAddCanvas = (v) => setGetCanvas(v);
    // bus.on('addCanvas', handleAddCanvas);

    // return () => {
    //   bus.off('addCanvas', handleAddCanvas);
    // };
  }, []);

  const init = () => {
    loadImages()
      .then((res: any) => {
        if (res.data.status) {
          const allData = res.data.data;
          if (allData.length > 0) {
            const newSignArr: any[] = [];
            allData.forEach((e) => {
              getBase64FromUrl(e.imageUrl, e._id, e.imageDeleteHash, newSignArr);
            });
          } else {
            setSignArr([]);
          }
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const deleteImageBtn = (id, hash, url) => {
    const getUrl = url.split('/');
    const imageName = getUrl[3];
    deleteImage(id, hash, imageName)
      .then((res) => {
        if (res.data.status) {
          alert(res.data.data);
          init();
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // const selectedSign = (url) => {
  //   setGetStroke(url);
  //   fabric.Image.fromURL(url, (image) => {
  //     image.top = 100;
  //     image.left = 100;
  //     image.scaleX = 0.5;
  //     image.scaleY = 0.5;
  //     getCanvas.add(image);
  //   });
  //   closeWarning();
  // };

  const getSign = () => {
    setIsSelectMode(true);
    init();
  };

  const getBase64FromUrl = (imgUrl, id, hash, newSignArr) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL();
      setGetUrl(dataUrl);
      newSignArr.push({ id, url: dataUrl, hash: String(hash), imageUrl: String(imgUrl) });
      setSignArr([...newSignArr]);
      setGetSignData([...newSignArr]);
    };
    image.src = imgUrl;
  };

  const uploadImageBtn = () => {
    const formData = new FormData();
    formData.append('image', fileElement.current.files[0]);
    if (fileElement.current.files[0].size > 0) {
      uploadImage(formData)
        .then((res) => {
          if (res.data.status) {
            alert(res.data.data);
            init();
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
      {signArr.length > 0 && isSelectMode && (
        <div className="card-inner absolute text-xl pop-container-choose w-full z-50">
          <div className="relative mt-3" onClick={() => setShowSignModal(false)}>
            <img
              className="absolute right-0 top-0 mr-4 mt-3 close_square"
              src="../assets/images/icon_Close_Square_n.png"
              alt="close"
            />
          </div>
          <div className="bg rounded-3xl overflow-hidden shadow-lg w-full"></div>
            <div className="px-4 py-6 flex flex-col justify-center w-full">
              <div className="font-bold text-lg mb-8 whitespace-nowrap text-center proj-text-primary">
                選擇簽名
              </div>
              <div className="selected-modal overflow-auto flex items-center justify-center flex-wrap">
                {signArr.map((item, idx) => (
                  <div key={idx} className="mb-2 flex justify-center">
                    <div
                      className="h-auto bg-white w-4/5 rounded-3xl py-2"
                      onClick={() => selectedSign(item.url)}
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
                        src="../assets/images/icon_Close_Square_n.png"
                        alt="delete"
                      />
                    </span>
                  </div>
                ))}
              </div>
              <label
                className="flex justify-center proj-text-primary block mt-4 font-bold text-lg whitespace-nowrap"
                onClick={() => setIsSelectMode(false)}
              >
                <img src="../assets/images/icon_add_new_sign_n.svg" alt="add" />
                <span className="text-[#8C5D19] font-[700] text-[14px] ml-1">建立簽名</span>
              </label>
              <label className="flex justify-center mt-4"></label>
                <img src="../assets/images/icon_add_new_img_n.svg" alt="upload" />
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
      )}
      {signArr.length === 0 && isSelectMode && (
        <div className="card-inner absolute text-xl pop-container-choose w-full z-50">
          <div className="relative mt-3" onClick={() => setShowSignModal(false)}>
            <img
              className="absolute right-0 top-0 mr-4 mt-3 close_square"
              src="../assets/images/icon_Close_Square_n.png"
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
                className="flex justify-center proj-text-primary block mt-4 whitespace-nowrap bg-white rounded"
                onClick={() => setIsSelectMode(false)}
              >
                <img src="../assets/images/icon_add_new_sign_n.svg" alt="add" />
                <span className="text-[#8C5D19] font-[700] text-[14px] ml-1">建立簽名</span>
              </label>
              <label className="flex justify-center mt-4 bg-white rounded">
                <img src="../assets/images/icon_add_new_img_n.svg" alt="upload" />
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
