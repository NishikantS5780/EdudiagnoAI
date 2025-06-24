import { FC, useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { toast } from "sonner";

interface RequireCompanyAuthProps {
  children: React.ReactNode;
}

const RequireCompanyAuth: FC<RequireCompanyAuthProps> = ({ children }) => {
  const location = useLocation();
  const appContext = useContext(AppContext);
  if (!appContext) {
    return toast.error("Something went wrong");
  }

  useEffect(() => {
    if (!appContext.company) {
      appContext.companyVerifyLogin?.().catch((_) => {
        return <Navigate to="/login" state={{ from: location }} replace />;
      });
    }
  }, []);

  return <>{appContext && appContext.company && children}</>;
};

export default RequireCompanyAuth;
