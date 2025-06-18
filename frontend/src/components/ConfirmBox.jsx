import React from "react";

const ConfirmBox = ({ cancel, confirm }) => {
    
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#03020272] text-black">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-lg font-semibold mb-4">Tem certeza que quer deletar o item?</h2>
        <p className="mb-4">Está ação não pode ser desfeita.</p>
        <div className="flex justify-between space-x-4">
          <button
            onClick={cancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={confirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
