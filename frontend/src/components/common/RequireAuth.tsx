import { FC, useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { toast } from "sonner";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();
  const appContext = useContext(AppContext);
  if (!appContext) {
    return toast.error("Something went wrong");
  }

  useEffect(() => {
    if (!appContext.recruiter) {
      appContext.verifyLogin().catch((_) => {
        return <Navigate to="/login" state={{ from: location }} replace />;
      });
    }
  }, []);

  return <>{appContext && appContext.recruiter && children}</>;
};

export default RequireAuth;
