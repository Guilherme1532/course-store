import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AddSubcategoryModel from "../../components/AddSubcategoryModel";
import AxiosToastError from "../../utils/AxiosToastError";
import DisplayTable from "../../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../../components/ViewImage";
import EditSubcategory from "../../components/EditSubcategory";
import ConfirmBox from "../../components/ConfirmBox";
import { useDispatch, useSelector } from "react-redux";
import { setSubcategory } from "../../store/productSlice";

const SubcategoryPage = () => {
  const dispatch = useDispatch();
  const subcategory = useSelector((state) => state.product.subcategory);

  const [openAddSubcategory, setOpenAddSubcategory] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(loading);
  const [subcategoryData, setSubcategoryData] = useState([]);
  const columnHelper = createColumnHelper();
  const [imageUrl, setImageUrl] = useState(null);
  const [editData, setEditData] = useState({
    _id: "",
  });
  const [openEditSubcategory, setOpenEditSubcategory] = useState(false);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [deleteSubcategory, setDeleteSubcategory] = useState(null);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubcategories,
      });
      const { data: subcategoriesResponse } = response;
      if (subcategoriesResponse.success) {
        setSubcategoryData(subcategoriesResponse.data);
        dispatch(setSubcategory(subcategoriesResponse.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSubcategoryData(subcategory);
  }, [subcategory]);

  const handleDeleteSubcategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubcategory,
        data: { _id: deleteSubcategory },
      });
      const { data: deleteResponse } = response;
      if (deleteResponse.success) {
        setOpenConfirmBox(false);
        fetchSubcategories();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  const columns = [
    columnHelper.accessor("name", {
      header: "Nome",
      cell: ({ row }) => {
        return (
          <p className="text-center shadow-md rounded-lg font-semibold">
            {row.original.name}
          </p>
        );
      },
    }),

    columnHelper.accessor("image", {
      header: "Imagem",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              width={50}
              height={50}
              className="w-36 cursor-pointer"
              onClick={() => {
                setImageUrl(row.original.image);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Categoria",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col md:flex-row gap-2">
            {row.original.category.map((category, index) => {
              return (
                <p key={index} className="text-left shadow-lg p-1 rounded-md">
                  {category.name}
                </p>
              );
            })}
          </div>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Ações",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-2 justify-center">
            <button
              onClick={() => {
                setEditData(row.original);
                setOpenEditSubcategory(true);
              }}
              className="cursor-pointer bg-gray-800 text-green-600 px-2 py-1 rounded-md hover:bg-gray-600 hover:text-gray-950 font-semibold"
            >
              Editar
            </button>
            <button
              onClick={() => {
                setOpenConfirmBox(true);
                setDeleteSubcategory(row.original);
              }}
              className="cursor-pointer text-orange-600 px-2 py-1 rounded-md hover:bg-black hover:text-red-600 font-semibold"
            >
              Excluir
            </button>
          </div>
        );
      },
    }),
  ];

  return (
    <section>
      <div className="p-2 shadow-md flex items-center justify-between">
        <h2>Subcategorias</h2>
        <button
          onClick={() => setOpenAddSubcategory(true)}
          className="text-sm font-semibold text-green-600 min-w-20 border  hover:border-gray-600 hover:bg-orange-600 px-3 py-1 rounded-full"
        >
          Adicionar Subcategorias
        </button>
      </div>

      <div className="overflow-auto w-full max-w-[98vw]">
        <DisplayTable data={subcategoryData} columns={columns} />
      </div>
      {openAddSubcategory && (
        <AddSubcategoryModel
          close={() => setOpenAddSubcategory(false)}
          fetchData={fetchSubcategories}
        />
      )}
      {openEditSubcategory && (
        <EditSubcategory
          data={editData}
          close={() => setOpenEditSubcategory(false)}
          fetchData={fetchSubcategories}
        />
      )}
      {openConfirmBox && (
        <ConfirmBox
          cancel={() => setOpenConfirmBox(false)}
          confirm={() => handleDeleteSubcategory()}
        />
      )}
      {imageUrl && <ViewImage url={imageUrl} close={() => setImageUrl(null)} />}
    </section>
  );
};

export default SubcategoryPage;
