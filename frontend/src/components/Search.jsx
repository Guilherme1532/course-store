import { useEffect, useState } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };
  const handleOnChange = (e) => {
    const searchValue = e.target.value;
    if (searchValue.trim() === "") {
      navigate("/search");
    } else {
      navigate(`/search?query=${searchValue}`);
    }
  };
  return (
    <div className="w-full  lg:min-w-[420px] h-11 lg:h-12 rounded-lg border-b border-orange-600 overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200 ">
      <div>
        {isMobile && isSearchPage ? (
          <Link
            to={"/"}
            className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md"
          >
            <FaArrowLeft size={20} className="text-orange-600" />
          </Link>
        ) : (
          <button className="cursor-pointer text-orange-600 flex justify-center items-center h-full p-3 group-focus-within:text-primary-200">
            <FaSearch size={22} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center"
          >
            <Link>
              <TypeAnimation
                sequence={[
                  "Pesquise por cursos e mais.",
                  1000,
                  "O que quer aprender?",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </Link>
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Pesquisar por cursos e mais."
              autoFocus
              //defaultValue={searchText}
              className="bg-transparent w-full h-full outline-none"
              onChange={handleOnChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
