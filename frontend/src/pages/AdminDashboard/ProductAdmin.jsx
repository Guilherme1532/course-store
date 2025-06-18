import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoData from "../../components/NoData";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import ConfirmBox from "../../components/ConfirmBox";
import AxiosToastError from "../../utils/AxiosToastError";
import EditProduct from "../../components/EditProduct";
import Pagination from "../../components/Pagination";
import DisplayTable from "../../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../../components/ViewImage";
import Loading from "../../components/Loading";

const ProductAdmin = () => {
  const [productsData, setProductsData] = useState([]);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [editProductData, setEditProductData] = useState("");
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState({
    _id: "",
  });
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [openConfirmBox, setOpenConfirmBox] = useState(false);

  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: deleteProduct,
      });
      const { data: deleteResponse } = response;
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        setOpenConfirmBoxDelete(false);
        setProductsData((prev) =>
          prev.filter((item) => item._id !== deleteProduct._id)
        );
        setPage(1);
      } else {
        toast.error(deleteResponse.message);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
      setOpenConfirmBox(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProducts,
        data: {
          page: page,
          limit: 10,
          search: search,
        },
      });
      const { data: productsResponse } = response;
      if (productsResponse.success) {
        setTotalPageCount(productsResponse.totalNoPage);
        setProductsData(productsResponse.data);
      } else {
        toast.error(productsResponse.message);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (page !== 1) {
      setPage((prev) => prev - 1);
    }
  };
  const handleOnChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true;

    const interval = setTimeout(() => {
      if (flag) {
        fetchProducts();
      }
      flag = !flag;
    }, 500);
    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  const columnHelper = createColumnHelper();
  const [imageUrl, setImageUrl] = useState(null);

  const columns = [
    columnHelper.accessor("name", {
      header: "Nome",
      cell: ({ row }) => {
        return (
          <Link
            to={`../../product/${row.original._id}`}
            className="text-center shadow-md rounded-lg font-semibold"
          >
            {row.original.name}
          </Link>
        );
      },
    }),
    columnHelper.accessor("price", {
      header: "Preço",
      cell: ({ row }) => {
        return (
          <p className="text-center shadow-md rounded-lg font-semibold">
            R$ {row.original.price.toFixed(2).replace(".", ",")}
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
              className=" cursor-pointer"
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
    columnHelper.accessor("subCategory", {
      header: "Subcategoria",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col md:flex-row gap-2">
            {row.original.subCategory.map((subCategory, index) => {
              return (
                <p key={index} className="text-left shadow-lg p-1 rounded-md">
                  {subCategory.name}
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
                setEditProductData(row.original);
                setOpenEditProduct(true);
              }}
              className="cursor-pointer bg-gray-800 text-green-600 px-2 py-1 rounded-md hover:bg-gray-600 hover:text-gray-950 font-semibold"
            >
              Editar
            </button>
            <button
              onClick={() => {
                setOpenConfirmBox(true);
                setDeleteProduct(row.original);
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
        <div className="flex gap-2 items-center ">
          <input
            type="text"
            placeholder="Pesquisar produto"
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={search}
            onChange={handleOnChange}
          />
        </div>
        <Link
          title="Adicionar um produto"
          to={"/dashboard/add-produtos"}
          className="text-sm font-semibold min-w-20 border border-green-600 hover:border-orange-400 bg-green-600 text-white px-3 py-1 rounded-full"
        >
          Adicionar um produto
        </Link>
      </div>
      {!productsData[0] && !loading && <NoData />}
      <div className="overflow-auto w-full max-w-[98vw]">
        <DisplayTable data={productsData} columns={columns} />
        {loading && <Loading />}
      </div>
      {totalPageCount > 1 && (
        <Pagination
          page={page}
          totalPageCount={totalPageCount}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      {openConfirmBoxDelete && (
        <ConfirmBox
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={() => handleDeleteProduct()}
        />
      )}

      {openEditProduct && (
        <EditProduct
          data={editProductData}
          close={() => setOpenEditProduct(false)}
          fetchData={fetchProducts}
        />
      )}
      {openConfirmBox && (
        <ConfirmBox
          cancel={() => setOpenConfirmBox(false)}
          confirm={() => handleDeleteProduct()}
        />
      )}
      {imageUrl && (
        <ViewImage
          url={imageUrl}
          close={() => {
            setImageUrl(null);
          }}
        />
      )}
    </section>
  );
};

export default ProductAdmin;
