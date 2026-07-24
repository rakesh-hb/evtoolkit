import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
  
  export interface User {
    name: string;
    email: string;
    role: string;
  }
  
  interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
  }
  
  const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
  );
  
  export function AuthProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const saved = localStorage.getItem("evtoolkit-user");
  
      if (saved) {
        setUser(JSON.parse(saved));
      }
    }, []);
  
    const login = (
      email: string,
      password: string
    ) => {
      // Demo credentials
      if (
        email === "demo@evtoolkit.com" &&
        password === "demo123"
      ) {
        const loggedInUser: User = {
          name: "Demo User",
          email,
          role: "EV Owner",
        };
  
        localStorage.setItem(
          "evtoolkit-user",
          JSON.stringify(loggedInUser)
        );
  
        setUser(loggedInUser);
  
        return true;
      }
  
      return false;
    };
  
    const logout = () => {
      localStorage.removeItem("evtoolkit-user");
      setUser(null);
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          login,
          logout,
          isAuthenticated: !!user,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    return useContext(AuthContext);
  }