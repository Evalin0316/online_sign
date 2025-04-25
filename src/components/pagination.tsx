import React, { useState, useMemo } from 'react';

interface PaginationProps {
  fileListLength: number;
  page: number;
  setPage: (page: number) => void;
}

const Pagination = ({ fileListLength, page, setPage }: PaginationProps) => {
  const options = useMemo(() => {
    const totalPage = Math.ceil(fileListLength / 10);
    return Array.from({ length: totalPage }, (_, index) => index + 1);
  }, [ fileListLength ]);

  const handleChangePage = (status: 'pre' | 'next') => {
    if (status === 'pre' && page > 1) {
      setPage(page - 1);
    } else if (status === 'next' && page < options.length) {
      setPage(page + 1);
    }
  };

  return (
    <>
      <div className="flex justify-center item-center">
        <div className="mr-2 text-[#be8e55] cursor-pointer" 
          onClick={() => handleChangePage('pre')}>
          前一頁
        </div>
        <p className="text-[#be8e55] mr-1">目前頁次第</p>
        <select 
          className="rounded bg-white text-black" 
          onChange={(e) => setPage(Number(e.target.value))} 
          value={page}
        >
          {
            options.map((value) => (
              <option key={value}>{value}</option>
            ))
          }
        </select>
        <div
          className="ml-2 text-[#be8e55] cursor-pointer" 
          onClick={() => handleChangePage('next')}>
            下一頁
        </div>
      </div>
    </>
  )
};

export default Pagination;