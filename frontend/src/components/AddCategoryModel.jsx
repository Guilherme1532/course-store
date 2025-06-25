import React from "react";
import { useState } from "react";
import uploadImage from "../utils/uploadImage";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";

const AddCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({
    name: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addCategory,
        data: data,
      });
      
      const { data: categoryResponse } = response;
      if (categoryResponse.success) {
        toast.success(categoryResponse.message);
        close();
        fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    
    const response = await uploadImage(file);
    const { data: imageResponse } = response;

    setData((prev) => {
      return {
        ...prev,
        image: imageResponse.data.url,
      };
    });
  };

  return (
    <section className="fixed z-40 top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-60 p-4 flex flex-col items-center justify-center text-black">
      <div className="bg-white max-w-4x1 w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Adicionar Categoria</h1>
          <button
            className="flex justify-center w-20 bg-gray-800 text-orange-600 hover:bg-green-700 font-medium py-1 rounded"
            onClick={close}
          >
            Fechar
          </button>
        </div>
        <form onSubmit={handleSubmit} className="my-3 grid gap-2">
          <div className="grid gap-1">
            <label id="categoryName">Nome</label>
            <input
              type="text"
              id="categoryName"
              placeholder="Digite um nome para a categoria"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-950"
            />
          </div>
          <div className="grid gap-1">
            <p>Foto</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                {data.image ? (
                  <img
                    alt="categoria"
                    src={data.image}
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">Sem foto</p>
                )}
              </div>
              <label htmlFor="uploadCategoryImage">
                <div
                  disabled={!data.name}
                  className={`
                    ${
                      !data.name
                        ? "text-sm font-bold text-white min-w-20 border bg-gray-400  flex items-center justify-cente"
                        : "text-sm font-bold text-orange-600 min-w-20 border border-green-600 bg-gray-800 hover:bg-green-700 flex items-center justify-center cursor-pointer"
                    }
                    px-3 py-1 rounded-full
                  `}
                >
                  Carregar Foto
                </div>
                <input
                  onChange={handleUploadCategoryImage}
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <button className="flex justify-center">
            {loading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              "Criar Categoria"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCategoryModel;
