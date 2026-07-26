import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import type { Session } from "@supabase/supabase-js";
  import { supabase } from "../lib/supabase";
  
  type AuthContextType = {
    session: Session | null;
    loading: boolean;
  };
  
  const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true,
  });
  
  export function AuthProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [session, setSession] =
      useState<Session | null>(null);
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      supabase.auth
        .getSession()
        .then(({ data }) => {
          setSession(data.session);
          setLoading(false);
        });
  
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );
  
      return () => subscription.unsubscribe();
    }, []);
  
    return (
      <AuthContext.Provider
        value={{
          session,
          loading,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    return useContext(AuthContext);
  }