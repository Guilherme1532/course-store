import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Search from "../components/Search";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ViewProductButton from "../components/ViewProductButton";
import AddToCart from "../components/AddToCart";
import Pagination from "../components/Pagination";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get("query") || "";

  const [productsData, setProductsData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(searchTerm);
    setPage(1); // Opcional: volta para a primeira página ao pesquisar
  }, [searchTerm]);

  useEffect(() => {
    if (search !== "") {
      const timeout = setTimeout(() => {
        fetchProducts();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [search, page]);

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

  return (
    <div className="container mx-auto p-4">
      <div className="lg:hidden">
        <Search />
      </div>
      <section className="flex flex-col justify-center items-center mb-4 gap-4 py-4">
        <div className="flex flex-col w-full">
          {productsData.length === 0 && !loading && (
            <p>Nenhum produto encontrado.</p>
          )}
          {productsData.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="border p-4 gap-2 rounded flex w-full mb-2 bg-gray-700 text-white"
            >
              <div className="flex flex-row gap-6 items-center">
                <div className="min-w-32 min-h-24 bg-white flex justify-center items-center">
                  <img
                    width={100}
                    src={product.image}
                    alt={product.name}
                    className=""
                  />
                </div>
                <div className="w-full">
                  <h2 className="font-bold">{product.name}</h2>
                  <p>{product.description}</p>
                  <h2 className="mt-2">R$ {product.price}</h2>
                </div>
              </div>
            </Link>
          ))}
          {loading && <p>Carregando...</p>}
        </div>
        {totalPageCount > 1 && (
          <Pagination
            page={page}
            totalPageCount={totalPageCount}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </section>
    </div>
  );
};

export default SearchPage;
