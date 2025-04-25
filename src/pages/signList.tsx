import React, { useEffect, useState } from 'react';
import { loadFileList, deleteFile } from '../actions/signListActions';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/pagination';

import clearButton from '../assets/images/icon_Close_n.png';
import iconDownload from '../assets/images/icon_download_n.svg';
import iconDelete from '../assets/images/icon_delete_n.svg';
import iconMoreOptions from '../assets/images/icon_more_n.svg';
import iconSearch from '../assets/images/icon_search_n.png';
import iconUpload from '../assets/images/to_upload.svg';

interface FileItem {
  _id: string;
  fileName: string;
  isSigned: boolean;
  signTitle: string;
  size: number;
  fileLocation: string;
  // Add other properties as needed
}


const SignList = () => {
  const navigate = useNavigate();
  const [ keyword, setKeyword ] = useState('');
  const [ fileList, setFileList ] = useState<FileItem[]>([]);
  const [ filterList, setFilterList ] = useState<FileItem[]>([]);
  const [ filterType, setFilterType ] = useState<string[]>([]);
  const [ totalFiles, setTotalFiles ] = useState(1);
  const [ selected, setSelected ] = useState(-1);
  const [ page, setPage ] = useState(1);

  const searchClear = () => setKeyword('');
  
  const deleteFileHandler = (id: string, filename: string) => {
    deleteFile(id, filename).then((res: {data : any}) => {
      if (res.data.status) {
       setFileList(fileList.filter((item: { _id: string }) => item._id !== id));
       setPage(1);
      }
    });
  };

  useEffect(() => {
    loadFileList((page -1) * 10, 10).then((res: { data: any, size: number }) => {
      setFileList(res.data);
      setTotalFiles(res.size);
    });
  }, [ page ]);

  useEffect(() => {
    const checkLength = filterType.length === 1

    if (checkLength && filterType.includes('undone')) {
      setFilterList(fileList.filter((item: { isSigned: boolean }) => !item.isSigned));
    } else if (checkLength && filterType.includes('done')) {
      setFilterList(fileList.filter((item: { isSigned: boolean }) => item.isSigned));
    } else {
      setFilterList(fileList);
    }
  }, [ filterType, fileList ]);

  useEffect(() => {
    const filteredList = fileList.filter((item: { signTitle: string }) => 
      item.signTitle.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilterList(filteredList);
  }, [ keyword, fileList ]);

  return (
  <>
    <div className="container_outer">
    {/* <Header /> */}
      <div className="container_home p-3">
        <div className="flex justify-between search_line items-center">
          {/* search input */}
          <div className="search_file flex flex-row items-center">
            <div className="flex items-center">
              <div className="search_input m-4 relative w-full">
                <input
                  type="text" 
                  className="bg-white m-3 rounded-lg block w-full
                  text-sm text-gray-900 border border-gray-300 h-12 pl-3
                  focus:ring-blue-500 focus:border-blue-500 dark:bg-white 
                  dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 z-[50]" 
                  placeholder="Search here..." 
                  value={keyword || ''}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <div className="absolute right-3.5 bottom-3.5 cursor-pointer  mb-2 mr-3" onClick={searchClear}>
                  <img className="mr-4" src={clearButton} alt="Clear" />
                </div>
                <div className="absolute right-3.5 bottom-3.5 cursor-pointer mb-2 border-l-4">
                  <img src={iconSearch} />
                </div>
              </div>
            </div>
            <div className="search_type bg-white flex w-9/12 ml-4 rounded-lg text-[#BE8E55] h-12  max-[768px]:hidden">
              <label className="m-3 flex justify-center items-center">
                <input className="selector" type="checkbox" onChange={(e) => {
                  if (e.target.checked) setFilterType((pre)=> [...pre, 'undone']);
                  else setFilterType([]);
                }} />未完成
              </label>
              <label className="m-3 flex justify-center items-center">
                <input className="selector" type="checkbox" value='complete' onChange={(e) => {
                  if (e.target.checked) setFilterType((pre)=> [...pre, 'done']);
                  else setFilterType([]);
                }} />已完成
              </label>
              <label className="m-3">共{fileList?.length}筆</label>
            </div>
          </div>
          {/* upload_file */}
          <div className="upload_file z-0">
          <img
            className="upload_img" 
            src={iconUpload} 
            onClick={() => navigate('/upload')}
            alt="Upload" 
          />
          </div>
        </div>
        {/* file_list */}
        <ul className="flex fileEnvelop_outer">
        {
          filterList.map((item, index) => (
            <li 
              key={index} 
              className={`m-2 flex justify-center relative cursor-pointer ${item.isSigned ? 'fileEnvelop_isSigned' : 'fileEnvelop'}`}
            >
            <div className="fileEnvelop_option absolute right-0 bottom-0 z-[55] h-12"
              onClick={(e) => {
                e.stopPropagation();
                return setSelected(selected === index ? -1 : index)
              }}
            >
              <img src={iconMoreOptions} alt="More options" />
            </div>
            <div className="absolute top-10 z-[50] text-[10px] w-32 flex justify-center pr-5 flex-wrap">{item.signTitle}</div>
            {selected === index && (
              <div className="absolute bottom-0 left-2 bg-white w-3/5 rounded">
                <ul>
                  <li className="text-[#BE8E55] flex cursor-pointer hover:bg-[#EFE3D4] p-1">
                    <a className="flex" target="_blank" href={item.fileLocation}>
                      <img className="mx-2" src={iconDownload} alt="Download" />
                      <span className="hover:text-[#BE8E55]">下載檔案</span>
                    </a>
                  </li>
                  <li className="text-[#BE8E55] flex cursor-pointer hover:bg-[#EFE3D4] p-1" onClick={() => deleteFileHandler(item._id, item.fileName)}>
                    <img className="mx-2" src={iconDelete} alt="Delete" />
                    <span className="hover:text-[#BE8E55]">取消簽署</span>
                  </li>
                </ul>
              </div>
            )}
            </li>
          ))
        }
        </ul>
        {/* pagination */}
        <div className="flex justify-center item-center">
          <Pagination
            fileListLength={totalFiles} 
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  </>
  )
};

export default SignList;
