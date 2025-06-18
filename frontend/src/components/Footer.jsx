import React from "react";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full flex justify-center">
      <footer className="max-w-[1000px] text-orange-600">
        <div className=" py-4 text-center gap-4 flex flex-col">
          <div className="flex items-center gap-4 justify-center text-2x1">
            <a href="" className="hover:text-primary-100">
              <FaFacebook />
            </a>
            <a href="" className="hover:text-primary-100">
              <FaLinkedin />
            </a>
            <a href="" className="hover:text-primary-100">
              <FaInstagram />
            </a>
          </div>
          <p>© Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
