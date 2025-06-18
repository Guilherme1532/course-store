import React from "react";

const AddFieldComponent = ({ close, value, onChange, submit }) => {
  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-[#000000cc] z-50 flex justify-center items-center p-2 text-black">
      <div className="bg-white rounded p-4 w-full max-w-md flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-semibold">Adicionar Campo</h1>
          <button
            onClick={close}
            className="text-sm rounded p-1 font-bold text-orange-600 min-w-20 border border-gray-600 bg-gray-800 hover:bg-gray-700 flex items-center justify-center cursor-pointer"
          >
            Fechar
          </button>
        </div>
        <input
          className="border w-full border-gray-300 rounded-md p-2"
          placeholder="Digite um nome para o campo"
          value={value}
          onChange={onChange}
        />
        <button
          onClick={submit}
          className="text-sm rounded p-1 font-bold text-orange-600 min-w-20 border border-gray-600 bg-gray-800 hover:bg-gray-700 flex items-center justify-center cursor-pointer"
        >
          Adicionar Campo
        </button>
      </div>
    </section>
  );
};

export default AddFieldComponent;
