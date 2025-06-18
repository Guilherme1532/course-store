import storelogo from "../assets/storelogo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import { useState, useRef, useEffect } from "react";

const Header = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/verification-otp" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/verify-email";
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isMenu, setIsMenu] = useState(false);

  const handleCloseUserMenu = () => {
    setIsMenu(false);
  };
  const menuRef = useRef(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    if (!isMenu) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenu]);

  const cart = useSelector((state) => state?.cart);
  const token = localStorage.getItem("accessToken");

  const redirectToLoginPage = () => {
    navigate("/login");
  };
  return (
    <header
      className={`w-full sticky top-0 z-40 flex justify-center
      ${
        !isMenu
          ? "bg-gradient-to-b from-gray-900 to-transparent"
          : "bg-gray-800"
      }
     `}
    >
      <div className="h-24 max-w-[1024px] w-full flex flex-col gap-1 px-1 md:px-0">
        {!isAuthPage ? (
          <div className="flex items-center justify-between">
            <Link to={"/"} className="flex justify-center items-center h-24">
              <img
                width={130}
                height={60}
                src={storelogo}
                alt="Logo"
                className="w-34 h-24 object-cover hidden lg:block"
              />
              <img
                src={storelogo}
                width={130}
                height={60}
                alt="Logo"
                className="w-34 h-24 object-cover lg:hidden "
              />
            </Link>
            {isMobile[0] ? null : (
              <div className="hidden lg:block">
                <Search />
              </div>
            )}

            <div className="flex items-center gap-3">
              {!isMenu ? (
                <button
                  onClick={() => setIsMenu(!isMenu)}
                  className="cursor-pointer text-orange-600 lg:hidden hover:scale-10 transition duration-300 ease-in-out"
                >
                  <FaRegUserCircle size={25} />
                </button>
              ) : null}

              {/* Botão de Login/Minha Conta (desktop) */}
              {!token ? (
                <button
                  onClick={redirectToLoginPage}
                  className="hidden lg:flex cursor-pointer text-orange-600 items-center gap-10"
                >
                  Entrar
                </button>
              ) : (
                <div>
                  {isMenu ? null : (
                    <button
                      onClick={() => setIsMenu(!isMenu)}
                      className="cursor-pointer hidden lg:block text-orange-600 items-center"
                    >
                      Minha conta
                    </button>
                  )}
                </div>
              )}

              {/* Botão do Carrinho (mantido o mesmo) */}
              <Link to={"/cart"} className="relative">
                <button className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 px-2 py-2 rounded-lg text-white hover:scale-105 transition duration-300 ease-in-out">
                  <div>
                    <FaCartShopping size={25} />
                  </div>
                  <div className="hidden sm:block font-semibold text-sm">
                    Meu Carrinho
                  </div>
                </button>
                {cart.items.length > 0 && (
                  <span
                    className="text-white absolute -top-2 -right-0 w-5 h-5 text-xs bg-red-500 flex justify-center items-center rounded-full transition-opacity duration-200"
                    style={{ minWidth: "1.25rem", minHeight: "1.25rem" }}
                  >
                    {cart.items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <Link to={"/"} className="h-20 flex justify-center items-center">
              <img
                src={storelogo}
                width={180}
                height={60}
                alt="Logo"
                className="hidden lg:block "
              />
              <img
                src={storelogo}
                width={130}
                height={60}
                alt="Logo"
                className="lg:hidden"
              />
            </Link>
          </div>
        )}
      </div>
      {isMenu && (
        <div
          ref={menuRef}
          className={
            "animate-fade-down animate-duration-300 fixed w-full flex justify-center bg-gray-800 rounded-b-lg max-h-screen overflow-y-auto"
          }
          style={{ top: "6rem", maxHeight: "calc(100vh - 6rem)" }}
        >
          <div className="w-full max-w-[1024px] px-4 py-2">
            <UserMenu close={handleCloseUserMenu} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
