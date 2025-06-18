import { companyApi } from "@/services/companyApi";
import { RecruiterData, RecruiterLoginData } from "@/types/recruiter";
import { createContext, FC, ReactNode, useEffect, useState } from "react";

interface AppContextType {
  login: (data: RecruiterLoginData) => Promise<void>;
  logout: () => Promise<void>;
  verifyLogin: () => Promise<void>;
  recruiter?: RecruiterData | null;
}

export const AuthContext = createContext<AppContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [recruiter, setRecruiter] = useState<RecruiterData | null>();

  const login = async (data: RecruiterLoginData) => {
    const res = await companyApi.login(data);
    localStorage.setItem(
      "token",
      res.headers.authorization.split("Bearer ")[1]
    );
    setRecruiter(res.data);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setRecruiter(null);
  };

  const verifyLogin = async () => {
    const res = await companyApi.verifyLogin();
    setRecruiter(res.data);
  };

  return (
    <AuthContext.Provider value={{ login, logout, recruiter, verifyLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
