import { useSelector } from "react-redux";
import IsAdmin from "../utils/IsAdmin";
import Loading from "../components/Loading";

const AdminPermission = ({ children }) => {
    const user = useSelector((state) => state.user);
    
    return(
        <>
        { IsAdmin(user.role) ? children : <Loading /> }
        </>
    )
}

export default AdminPermission;