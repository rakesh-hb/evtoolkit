import { supabase } from "../lib/supabase";

export type PrimaryVehicleType = "built_in" | "custom";

export interface PrimaryVehicleReference {
  type: PrimaryVehicleType;
  id: number;
}

interface PrimaryVehiclePreferenceRow {
  user_id: string;
  primary_vehicle_type: PrimaryVehicleType | null;
  primary_vehicle_id: number | null;
  dashboard_alias: string | null;
  created_at: string;
  updated_at: string;
}

function toReference(
  row: PrimaryVehiclePreferenceRow | null
): PrimaryVehicleReference | null {
  if (
    !row?.primary_vehicle_type ||
    row.primary_vehicle_id === null
  ) {
    return null;
  }

  return {
    type: row.primary_vehicle_type,
    id: Number(row.primary_vehicle_id),
  };
}

async function getAuthenticatedUserId(): Promise<string> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Authentication required.");
  }

  return user.id;
}

export async function getPrimaryVehicle(): Promise<
  PrimaryVehicleReference | null
> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_vehicle_preferences")
    .select(
      "user_id, primary_vehicle_type, primary_vehicle_id, dashboard_alias, created_at, updated_at"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return toReference(
    data as PrimaryVehiclePreferenceRow | null
  );
}

export async function getDashboardVehicleAlias(): Promise<string> {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("user_vehicle_preferences")
    .select("dashboard_alias")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return String(data?.dashboard_alias ?? "").trim();
}

export async function setDashboardVehicleAlias(
  alias: string
): Promise<string> {
  const userId = await getAuthenticatedUserId();
  const normalizedAlias = alias.trim();

  if (normalizedAlias.length > 100) {
    throw new Error(
      "Dashboard vehicle alias must be 100 characters or fewer."
    );
  }

  const { data: existingPreference, error: existingError } =
    await supabase
      .from("user_vehicle_preferences")
      .select("primary_vehicle_type, primary_vehicle_id")
      .eq("user_id", userId)
      .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (
    !existingPreference?.primary_vehicle_type ||
    existingPreference.primary_vehicle_id === null
  ) {
    throw new Error(
      "Select a primary vehicle before setting a Dashboard alias."
    );
  }

  const { error } = await supabase
    .from("user_vehicle_preferences")
    .update({
      dashboard_alias: normalizedAlias || null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "This Dashboard alias is already in use. Please choose another name."
      );
    }

    throw error;
  }

  return normalizedAlias;
}

export async function clearDashboardVehicleAlias(): Promise<void> {
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("user_vehicle_preferences")
    .update({
      dashboard_alias: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function setPrimaryVehicle(
  vehicle: PrimaryVehicleReference
): Promise<PrimaryVehicleReference> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Authentication required.");
  }

  if (
    !Number.isInteger(vehicle.id) ||
    vehicle.id <= 0
  ) {
    throw new Error("Invalid vehicle selected.");
  }

  if (vehicle.type === "custom") {
    const { data, error } = await supabase
      .from("custom_vehicles")
      .select("id")
      .eq("id", vehicle.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(
        "The selected custom vehicle does not belong to this account."
      );
    }
  }

  const { error } = await supabase
    .from("user_vehicle_preferences")
    .upsert(
      {
        user_id: user.id,
        primary_vehicle_type: vehicle.type,
        primary_vehicle_id: vehicle.id,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  if (error) {
    throw error;
  }

  return vehicle;
}

export async function clearPrimaryVehicle(): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Authentication required.");
  }

  const { error } = await supabase
    .from("user_vehicle_preferences")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }
}
