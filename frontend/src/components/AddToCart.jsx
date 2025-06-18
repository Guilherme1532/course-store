import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToCartAsync } from "../store/cartSlice";
import { FaCartPlus } from "react-icons/fa6";

const AddToCart = ({ product }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleAddUnity = () => {
    if(user._id){
      dispatch(addToCartAsync({ product, userId: user._id }));
    } else {
      dispatch(addToCart(product));
    }
  };


  return (
    <button onClick={handleAddUnity} className="flex items-center cursor-pointer justify-center p-3 gap-2 rounded bg-orange-600 text-white">
      <FaCartPlus />
      Adicionar ao carrinho
    </button>
  );
};

export default AddToCart;
