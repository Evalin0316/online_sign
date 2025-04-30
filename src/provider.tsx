import React, { useState, createContext, ReactNode } from "react";

export const AppContext = React.createContext({
  pageStatus: "homePage",
  fileId: null,
  fileInfo: {},
  setPageStatus: (status: string) => {},
  setFileId: (id: any) => {},
  setFileInfo: (info: object) => {}
});

export const Provider = ({ children }: { children: ReactNode }) => {
  const [ pageStatus, setPageStatus ] = useState("homePage");
  const [ fileId, setFileId ] = useState(null);
  const [ fileInfo, setFileInfo ] = useState({});

  return (
    <AppContext.Provider
      value={{ 
        pageStatus,
        fileId,
        fileInfo,
        setPageStatus,
        setFileId,
        setFileInfo
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default Provider;