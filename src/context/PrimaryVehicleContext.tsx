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
        // Load the Primary Vehicle first. The vehicle is needed by
        // vehicle-dependent pages and must not wait for the optional
        // Dashboard alias request.
        const vehicle = await getPrimaryVehicle();

        setPrimaryVehicleState(vehicle);
        setLoading(false);

        // The Dashboard alias is independent of the Primary Vehicle
        // reference. Load it after the vehicle is available so pages
        // can start using the Primary Vehicle immediately.
        if (vehicle) {
          try {
            const alias = await getDashboardVehicleAlias();
            setDashboardAliasState(alias);
          } catch (error) {
            console.error(
              "Failed to load Dashboard Vehicle Alias:",
              error
            );
            setDashboardAliasState("");
          }
        } else {
          setDashboardAliasState("");
        }
      } catch (error) {
        console.error(
          "Failed to load Primary Vehicle:",
          error
        );

        setPrimaryVehicleState(null);
        setDashboardAliasState("");
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
