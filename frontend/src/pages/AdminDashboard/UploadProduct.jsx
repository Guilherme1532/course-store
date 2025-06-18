import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import uploadImage from "../../utils/uploadImage";
import { FaCloudUploadAlt } from "react-icons/fa";
import ViewImage from "../../components/ViewImage";
import AddFieldComponent from "../../components/AddFieldComponent";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageUrl, setViewImageUrl] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.subcategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: imageResponse } = response;

    setData((prev) => {
      return {
        ...prev,
        image: [...prev.image, imageResponse.data.url],
      };
    });
    setImageLoading(false);
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleAddField = async () => {
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.uploadProduct,
        data: data,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success("Produto cadastrado com sucesso!");
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="">
      <div className="p-2 shadow-md flex items-center justify-center">
        <h2>Adicionar Produto</h2>
      </div>
      <div className="grid p-3">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1">
            <label htmlFor="name" className="font-medium">
              Nome do produto
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Digite o nome do produto"
              value={data.name}
              onChange={handleOnChange}
              required
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="description" className="font-medium">
              Descrição do produto
            </label>
            <textarea
              id="description"
              type="text"
              placeholder="Digite a descrição do produto"
              name="description"
              value={data.description}
              onChange={handleOnChange}
              required
              multiple
              rows={3}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <p className="font-medium">Imagem</p>
            <div>
              <label
                htmlFor="productImage"
                className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer"
              >
                <div className="text-center flex justify-center items-center flex-col">
                  {imageLoading ? (
                    <div>Carregando...</div>
                  ) : (
                    <>
                      <FaCloudUploadAlt className="text-3xl text-gray-500" />
                      <p>Carregar imagem</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="productImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </label>
              <div className="flex flex-wrap gap-4">
                {data.image.map((image, index) => {
                  return (
                    <div
                      key={image + index}
                      className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group"
                    >
                      <img
                        src={image}
                        alt={image}
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={() => setViewImageUrl(image)}
                      />
                      <div
                        onClick={() => handleDeleteImage(index)}
                        className="text-center absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex justify-center items-center cursor-pointer group-hover:block hidden"
                      >
                        X
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label>Categorias</label>
            <div className="text-black">
              <select
                className="bg-blue-50 border w-full p-2 rounded"
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find((el) => el._id === value);
                  // Só adiciona se ainda não existir
                  setData((prev) => {
                    const alreadyExists = prev.category.some(
                      (cat) => cat._id === category._id
                    );
                    if (alreadyExists) return prev;
                    return {
                      ...prev,
                      category: [...prev.category, category],
                    };
                  });
                  setSelectCategory("");
                }}
              >
                <option value={""}>Selecione uma categoria</option>
                {allCategory.map((c) => (
                  <option key={c?._id} value={c?._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-3">
                {data.category.map((category, index) => {
                  return (
                    <div
                      key={category._id + index}
                      className="bg-blue-50 border rounded gap-1 p-2 flex justify-between items-center"
                    >
                      <p>{category.name}</p>
                      <div
                        onClick={() => handleRemoveCategory(index)}
                        className="w-5 h-5 bg-red-500 rounded-lg flex justify-center items-center cursor-pointer"
                      >
                        X
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label>Subcategorias</label>
            <div className="text-black">
              <select
                className="bg-blue-50 border w-full p-2 rounded"
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const subCategory = allSubCategory.find(
                    (el) => el._id === value
                  );
                  setData((prev) => {
                    const alreadyExists = prev.subCategory.some(
                      (sub) => sub._id === subCategory._id
                    );
                    if (alreadyExists) return prev;
                    return {
                      ...prev,
                      subCategory: [...prev.subCategory, subCategory],
                    };
                  });
                  setSelectSubCategory("");
                }}
              >
                <option value={""}>Selecione uma subcategoria</option>
                {allSubCategory.map((c) => (
                  <option key={c?._id} value={c?._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-3">
                {data.subCategory.map((subcategory, index) => {
                  return (
                    <div
                      key={subcategory._id + index}
                      className="bg-blue-50 border rounded gap-1 p-2 flex justify-between items-center"
                    >
                      <p>{subcategory.name}</p>
                      <div
                        onClick={() => handleRemoveSubCategory(index)}
                        className="w-5 h-5 bg-red-500 rounded-lg flex justify-center items-center cursor-pointer"
                      >
                        X
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit" className="font-medium">
              Unidade
            </label>
            <input
              id="unit"
              type="text"
              placeholder="Digite a quantidade"
              name="unit"
              value={data.unit}
              onChange={handleOnChange}
              required
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit" className="font-medium">
              Estoque
            </label>
            <input
              id="stock"
              type="number"
              placeholder="Digite o estoque"
              name="stock"
              value={data.stock}
              onChange={handleOnChange}
              required
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit" className="font-medium">
              Preço
            </label>
            <input
              id="price"
              type="number"
              placeholder="Digite o valor da unidade"
              name="price"
              value={data.price}
              onChange={handleOnChange}
              required
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit" className="font-medium">
              Desconto
            </label>
            <input
              id="discount"
              type="number"
              placeholder="Digite o valor de desconto"
              name="discount"
              value={data.discount}
              onChange={handleOnChange}
              required
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          {Object?.keys(data.more_details).map((key) => {
            return (
              <div className="grid gap-1">
                <label htmlFor={key} className="font-medium">
                  {key}
                </label>
                <input
                  id={key}
                  type="text"
                  value={data?.more_details[key]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setData((prev) => {
                      return {
                        ...prev,
                        more_details: { ...prev.more_details, [key]: value },
                      };
                    });
                  }}
                  required
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
            );
          })}
          <div
            onClick={() => setOpenAddField(true)}
            className="hover:bg-primary-200 bg-white text-black py-1 px-3 w-32 text-center font-semibold border border-primary-200 rounded-md cursor-pointer"
          >
            Adicionar mais detalhes
          </div>
          <button className="flex-1 bg-gray-950 text-orange-600 hover:bg-gray-700 font-medium py-1 rounded">
            Cadastrar
          </button>
        </form>
      </div>

      {viewImageUrl && (
        <ViewImage url={viewImageUrl} close={() => setViewImageUrl("")} />
      )}

      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;
