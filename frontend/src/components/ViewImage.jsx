import React from "react";

const ViewImage = ({ url, close }) => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-full bg-[#0000004c] flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow-lg relative">
          <img src={url} alt="View" className="w-52" />
          <div className="flex justify-center m-3">
            <button
              onClick={close}
              className="flex justify-center w-20 bg-gray-800 text-orange-600 hover:bg-gray-700 font-medium py-1 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewImage;
