import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@chakra-ui/react"


export function PrivateRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <Spinner />
    } else if (!loading && user === null){
        return <Navigate to="/login" replace={true} />;
    } 
    
    return <Outlet />
}