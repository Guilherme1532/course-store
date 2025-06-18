import React, { useEffect, useState } from "react";
import AddCategoryModel from "../../components/AddCategoryModel";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError";
import ConfirmBox from "../../components/ConfirmBox";
import NoData from "../../components/NoData";
import EditCategory from "../../components/EditCategory";
import { useDispatch, useSelector } from "react-redux";
import { setAllCategory } from "../../store/productSlice";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });
  const allCategory = useSelector((state) => state.product.allCategory);

  useEffect(() => {
    setCategoryData(allCategory);
  }, [allCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCategories,
      });
      const { data: categoriesResponse } = response;
      if (categoriesResponse.success) {
        setCategoryData(categoriesResponse.data);
        dispatch(setAllCategory(categoriesResponse.data));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory,
      });
      const { data: deleteResponse } = response;
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        fetchCategories();
        setOpenConfirmBoxDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setOpenConfirmBoxDelete(false);
    }
  };

  return (
    <div className="">
      <div className="p-2 shadow-md flex items-center justify-between">
        <h2>Categorias</h2>
        <button
          onClick={() => setOpenAddCategory(true)}
          className="cursor-pointer text-sm font-semibold text-green-600 min-w-20 border  hover:border-gray-600 hover:bg-orange-600 px-3 py-1 rounded-full"
        >
          Adicionar Categorias
        </button>
      </div>
      {loading && <Loading />}
      {!categoryData[0] && !loading && <NoData />}
      <div className="w-full p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {categoryData.map((category) => {
          return (
            <div
              className="rounded-md shadow-md p-2 bg-gray-900 flex flex-col justify-between items-center gap-3"
              key={category._id}
            >
              <div className="min-h-10 flex items-center">
                <h3 className="text-xs font-semibold text-center">
                  {category.name}
                </h3>
              </div>
              <div className="w-full flex items-center justify-center">
                <img
                  width={100}
                  height={100}
                  alt={category.name}
                  src={category.image}
                  className="rounded-md w-32 h-16"
                />
              </div>
              <div className="items-center flex  gap-2 min-h-10">
                <button
                  onClick={() => {
                    setOpenEditCategory(true);
                    setEditData(category);
                  }}
                  className="cursor-pointer bg-gray-800 text-green-600 px-1 py-1 rounded-md hover:bg-gray-600 hover:text-gray-950 font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setOpenConfirmBoxDelete(true);
                    setDeleteCategory({ _id: category._id });
                  }}
                  className="cursor-pointer text-orange-600 px-2 py-1 rounded-md hover:bg-black hover:text-red-600 font-semibold"
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {openAddCategory && (
        <AddCategoryModel
          fetchData={fetchCategories}
          close={() => setOpenAddCategory(false)}
        />
      )}
      {openEditCategory && (
        <EditCategory
          data={editData}
          close={() => setOpenEditCategory(false)}
          fetchData={fetchCategories}
        />
      )}
      {openConfirmBoxDelete && (
        <ConfirmBox
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={() => handleDeleteCategory()}
        />
      )}
    </div>
  );
};

export default CategoryPage;
