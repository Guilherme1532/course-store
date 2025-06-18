import { Link, useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useEffect, useState } from "react";
import Search from "../components/Search";
import Loading from "../components/Loading";

const ProductListPage = () => {
  const { categoryId, categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.getProductsByCategory,
          params: {
            categoryId: categoryId,
          },
        });
        const { data: productsResponse } = response;
        if (productsResponse.success) {
          setProducts(productsResponse.data);
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  // Agrupa produtos por subcategoria
  const productsBySubcategory = products.reduce((acc, product) => {
    // Suporta múltiplas subcategorias por produto, se necessário
    const subcategories = Array.isArray(product.subCategory)
      ? product.subCategory
      : [product.subCategory];

    subcategories.forEach((sub) => {
      if (!sub) return;
      const subId = typeof sub === "object" ? sub._id : sub;
      const subName = typeof sub === "object" ? sub.name : "Sem nome";
      if (!acc[subId]) {
        acc[subId] = { name: subName, products: [] };
      }
      acc[subId].products.push(product);
    });
    return acc;
  }, {});

  return (
    <div className="w-full">
      <section className="flex flex-col gap-2 max-w-[1024px] mx-auto p-1 lg:p-0">
        <div className="block lg:hidden mb-4">
          <Search />
        </div>
        <h1 className="text-2xl font-bold mb-4">Categoria: {categoryName}</h1>
        {loading && <Loading />}
        {!loading && Object.keys(productsBySubcategory).length === 0 && (
          <p>Nenhum produto encontrado.</p>
        )}
        {Object.entries(productsBySubcategory).map(
          ([subId, { name, products }]) => (
            <div key={subId} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-400 mb-2">
                {name}
              </h2>
              <div className="flex flex-col gap-5 w-full">
                {products.map((product) => (
                  <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    className="border p-4 gap-2 rounded flex w-full mb-2 bg-gray-700 text-white"
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="min-w-32 min-h-24 bg-white flex justify-center items-center">
                        <img
                          width={100}
                          src={product.image}
                          alt={product.name}
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
              </div>
            </div>
          )
        )}
      </section>
    </div>
  );
};

export default ProductListPage;
