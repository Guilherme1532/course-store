import React, { useEffect } from "react";
import toast from "react-hot-toast";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  useEffect(() => {
    if (!code) {
      toast.error("Código de verificação não encontrado.");
      navigate("/login");
    }
    const verifyEmail = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.verify_email,
          data: { code },
        });
        if (response.data.error) {
          toast.error(response.data.message);
        }
        if (response.data.success) {
          toast.success(response.data.message);
          navigate("/");
        }
      } catch (error) {
        AxiosToastError(error);
      }
    };
    verifyEmail();
  });

  return (
    <section className="w-full container mx-auto px-2 flex justify-center items-center">
      <div className="bg-gray-700 my-4 w-full max-w-lg mx-auto rounded p-7 flex justify-center items-center">
        <p className="font-semibold text-lg text-white">Verificando seu e-mail... </p>
      </div>
    </section>
  );
};

export default VerifyEmail;
