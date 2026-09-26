import { supabase } from "../lib/supabase";

export type UserVehicleType = "built_in" | "custom";

export interface UserVehicleReference {
  type: UserVehicleType;
  id: number;
}

export interface UserVehicleRecord {
  id: number;
  user_id: string;
  vehicle_type: UserVehicleType;
  vehicle_id: number;
  created_at: string;
  updated_at: string;
}

interface UserVehicleRow {
  id: number;
  user_id: string;
  vehicle_type: UserVehicleType;
  vehicle_id: number;
  created_at: string;
  updated_at: string;
}

function toUserVehicleRecord(
  row: UserVehicleRow
): UserVehicleRecord {
  return {
    id: Number(row.id),
    user_id: row.user_id,
    vehicle_type: row.vehicle_type,
    vehicle_id: Number(row.vehicle_id),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("Authentication required.");
  }

  return user.id;
}

function validateVehicleReference(
  vehicle: UserVehicleReference
): void {
  if (
    vehicle.type !== "built_in" &&
    vehicle.type !== "custom"
  ) {
    throw new Error("Invalid vehicle type.");
  }

  if (
    !Number.isInteger(vehicle.id) ||
    vehicle.id <= 0
  ) {
    throw new Error("Invalid vehicle selected.");
  }
}

export async function getUserVehicles(): Promise<
  UserVehicleRecord[]
> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("user_vehicles")
    .select(
      "id, user_id, vehicle_type, vehicle_id, created_at, updated_at"
    )
    .eq("user_id", userId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return ((data ?? []) as UserVehicleRow[]).map(
    toUserVehicleRecord
  );
}

export async function addUserVehicle(
  vehicle: UserVehicleReference
): Promise<UserVehicleRecord> {
  const userId = await getCurrentUserId();

  validateVehicleReference(vehicle);

  if (vehicle.type === "custom") {
    const { data, error } = await supabase
      .from("custom_vehicles")
      .select("id")
      .eq("id", vehicle.id)
      .eq("user_id", userId)
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

  const { data: existing, error: existingError } =
    await supabase
      .from("user_vehicles")
      .select(
        "id, user_id, vehicle_type, vehicle_id, created_at, updated_at"
      )
      .eq("user_id", userId)
      .eq("vehicle_type", vehicle.type)
      .eq("vehicle_id", vehicle.id)
      .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    throw new Error(
      "This vehicle is already in your vehicle list."
    );
  }

  const { data, error } = await supabase
    .from("user_vehicles")
    .insert({
      user_id: userId,
      vehicle_type: vehicle.type,
      vehicle_id: vehicle.id,
    })
    .select(
      "id, user_id, vehicle_type, vehicle_id, created_at, updated_at"
    )
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "This vehicle is already in your vehicle list."
      );
    }

    throw error;
  }

  return toUserVehicleRecord(
    data as UserVehicleRow
  );
}
