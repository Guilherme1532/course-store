import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import AddToCart from "../components/AddToCart";
import Loading from "../components/Loading";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.getProductById,
          params: { productId },
        });
        const { data: productResponse } = response;
        if (productResponse.success) {
          setProduct(productResponse.data);
        } else {
          console.error(productResponse.message);
        }
      } catch (error) {
        AxiosToastError(error);
      }finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Loading />
      </div>
    );
  }
  return (
    <div>
      {product ? (
        <div className="container mx-auto max-w-[1024px] min-h-[50vh] py-4 px-2 flex justify-center">
          <section className=" mb-4 flex flex-col items-center text-white gap-5">
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="flex items-center justify-center min-w-72 min-h-72 bg-white rounded-sm">
                <img
                  width={200}
                  height={180}
                  src={product.image}
                  alt={product.name}
                  className="rounded-lg"
                />
              </div>

              <div className="flex flex-col justify-between md:items-start">
                <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                <p className="mb-4">{product.description}</p>

                <div className="w-full flex flex-col gap-2">
                  <span className="text-xl mb-2">R$ {product.price}</span>
                  <AddToCart product={product} />
                </div>
              </div>
            </div>
            {Array.isArray(product.category) && product.category.length > 0 && (
              <div className="mb-2 text-white font-bold">
                <span className="">Categorias: </span>
                {product.category.map((cat, idx) => (
                  <span key={cat._id || idx} className="mr-2 font-semibold">
                    {cat.name}
                    {idx < product.category.length - 1 && ","}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <p>Carregando detalhes do produto...</p>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
