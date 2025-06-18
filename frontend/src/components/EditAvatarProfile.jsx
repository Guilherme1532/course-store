import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { updatedAvatar } from "../store/userSlice";

const EditAvatarProfile = ({ close }) => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => {
    if (close) {
      close();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData,
      });

      const { data: responseData } = response;
      dispatch(updatedAvatar(responseData.data.avatar));
      setLoading(false);
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-[#0000004c] bg-opacity-60 p-4 flex items-center justify-center">
      <div className="bg-white w-52 p-10 rounded-lg shadow-lg flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 bg-gray-800 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full" />
          ) : (
            <FaRegUserCircle />
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <label htmlFor="uploadProfile">
            <div className="cursor-pointer bg-gray-800 text-sm font-semibold text-orange-600 rounded-md w-24 h-12 text-center hover:text-orange-400 flex items-center justify-center hover:scale-105 transition duration-300 ease-in-out">
              {loading ? "carregando..." : "Carregar Imagem"}
            </div>
          </label>
          <input
            onChange={handleUploadAvatarImage}
            type="file"
            id="uploadProfile"
            className="hidden"
          />
        </form>
        <button
          onClick={handleClose}
          className=" bg-gray-800 text-sm font-semibold text-orange-600 rounded-md w-20 h-8 text-center hover:text-orange-400 flex items-center justify-center hover:scale-105 transition duration-300 ease-in-out"
        >
          Fechar
        </button>
      </div>
    </section>
  );
};

export default EditAvatarProfile;
