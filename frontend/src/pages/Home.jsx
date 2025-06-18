import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Banner1 from "../assets/banner1.png";
import Banner3 from "../assets/banner2.png";
import Banner2 from "../assets/banner3.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import AxiosToastError from "../utils/AxiosToastError";

const banners = [Banner1, Banner2, Banner3];

const Home = () => {
  const allCategory = useSelector((state) => state.product.allCategory);
  const [mostViewedProducts, setMostViewedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMostViewedProducts = async () => {
    try {
      setLoading(true); 
      const response = await Axios({
        ...SummaryApi.getMostViewedProducts,
        params: {
          limit: 10,
        },
      });

      if (response.data.success) {
        setMostViewedProducts(response.data.data); // Armazena os produtos no estado
      } else {
        console.error(
          "Erro ao buscar produtos mais acessados:",
          response.data.message
        );
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMostViewedProducts();
  }, []);

  return (
    <div className="container flex flex-col gap-5 mx-auto max-w-[1024px]">
      <div className="lg:hidden mx-2 md:mx-0">
        <Search />
      </div>
      <section className="w-full px-0">
        <div className="animate-fade animate-duration-3000 w-full flex justify-center items-center overflow-hidden">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            className="w-full lg:rounded-lg"
          >
            {banners.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  width={1024}
                  height={300}
                  src={img}
                  alt={`Banner ${idx + 1}`}
                  className="w-full md:h-[400px] object-contain bg-[#F36812]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section className="flex mx-2 md:mx-0 flex-row gap-1 overflow-x-auto shadow-sm rounded-lg bg-gray-600">
        {allCategory.map((category) => (
          <Link
            to={`/category/${category._id}/${category.name}`}
            key={category._id}
          >
            <div
              key={category._id}
              className="relative p-4 text-center h-full flex flex-col items-center justify-center gap-1"
            >
              <div className="absolute w-full h-full bg black"></div>
              <img
                width={260}
                height={72}
                className="max-h-26 min-w-52 w-full object-cover rounded-md"
                src={category.image}
                alt={category.name}
              />
              <h2 className="absolute w-52 rounded-md bottom-4 bg-gradient-to-t from-[#000000cf] to-transparent text-[#ffffffe4] font-bold overflow-hidden leading-tight overflow-ellipsis">
                <span>{category.name}</span>
              </h2>
            </div>
          </Link>
        ))}
      </section>
      <section className="mt-6 mx-2 md:mx-0 p-3 bg-gray-600 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Mais procurados</h2>
        {loading && <Loading />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mostViewedProducts.map((product) => (
            <div
              key={product._id}
              className="flex p-4 rounded-lg shadow-md bg-gray-500"
            >
              <Link
                to={`/product/${product._id}`}
                className="flex flex-col justify-between h-full gap-3"
              >
                <div>
                  <div className="w-full h-44 bg-white flex items-center justify-center rounded-md">
                    <img
                      width={160}
                      height={60}
                      src={product.image}
                      alt={product.name}
                      className="max-w-32"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mt-2">
                    {product.name}
                  </h3>
                </div>
                <div className="mt-2 max-h-20 overflow-hidden text-ellipsis">
                  <p className="text-white text-lg line-clamp-3">{product.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
