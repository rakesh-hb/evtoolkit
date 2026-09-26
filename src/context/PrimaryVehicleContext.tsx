import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import { useAuth } from "./AuthContext";
  import {
    clearDashboardVehicleAlias,
    clearPrimaryVehicle,
    getDashboardVehicleAlias,
    getPrimaryVehicle,
    setDashboardVehicleAlias,
    setPrimaryVehicle,
    type PrimaryVehicleReference,
  } from "../services/primaryVehicleService";
  
  interface PrimaryVehicleContextValue {
    primaryVehicle: PrimaryVehicleReference | null;
    dashboardAlias: string;
    loading: boolean;
    setPrimaryVehicle: (
      vehicle: PrimaryVehicleReference
    ) => Promise<void>;
    clearPrimaryVehicle: () => Promise<void>;
    setDashboardAlias: (alias: string) => Promise<void>;
    clearDashboardAlias: () => Promise<void>;
    refreshPrimaryVehicle: () => Promise<void>;
  }
  
  const PrimaryVehicleContext =
    createContext<PrimaryVehicleContextValue | undefined>(
      undefined
    );
  
  export function PrimaryVehicleProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const { session, loading: authLoading } = useAuth();
  
    const [primaryVehicle, setPrimaryVehicleState] =
      useState<PrimaryVehicleReference | null>(null);
  
    const [dashboardAlias, setDashboardAliasState] =
      useState("");
  
    const [loading, setLoading] = useState(true);
  
    const refreshPrimaryVehicle = useCallback(
      async () => {
        if (!session?.user?.id) {
          setPrimaryVehicleState(null);
          setDashboardAliasState("");
          setLoading(false);
          return;
        }
  
        setLoading(true);
  
        try {
          const vehicle = await getPrimaryVehicle();
          setPrimaryVehicleState(vehicle);
  
          if (vehicle) {
            const alias = await getDashboardVehicleAlias();
            setDashboardAliasState(alias);
          } else {
            setDashboardAliasState("");
          }
        } finally {
          setLoading(false);
        }
      },
      [session?.user?.id]
    );
  
    useEffect(() => {
      if (authLoading) {
        return;
      }
  
      void refreshPrimaryVehicle();
    }, [authLoading, refreshPrimaryVehicle]);
  
    const selectPrimaryVehicle = useCallback(
      async (vehicle: PrimaryVehicleReference) => {
        const saved = await setPrimaryVehicle(vehicle);
        setPrimaryVehicleState(saved);
      },
      []
    );
  
    const removePrimaryVehicle = useCallback(async () => {
      await clearPrimaryVehicle();
      setPrimaryVehicleState(null);
      setDashboardAliasState("");
    }, []);
  
    const saveDashboardAlias = useCallback(
      async (alias: string) => {
        const saved = await setDashboardVehicleAlias(alias);
        setDashboardAliasState(saved);
      },
      []
    );
  
    const removeDashboardAlias = useCallback(async () => {
      await clearDashboardVehicleAlias();
      setDashboardAliasState("");
    }, []);
  
    return (
      <PrimaryVehicleContext.Provider
        value={{
          primaryVehicle,
          dashboardAlias,
          loading: authLoading || loading,
          setPrimaryVehicle: selectPrimaryVehicle,
          clearPrimaryVehicle: removePrimaryVehicle,
          setDashboardAlias: saveDashboardAlias,
          clearDashboardAlias: removeDashboardAlias,
          refreshPrimaryVehicle,
        }}
      >
        {children}
      </PrimaryVehicleContext.Provider>
    );
  }
  
  export function usePrimaryVehicle() {
    const context = useContext(
      PrimaryVehicleContext
    );
  
    if (!context) {
      throw new Error(
        "usePrimaryVehicle must be used within a PrimaryVehicleProvider."
      );
    }
  
    return context;
  }
  