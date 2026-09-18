import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "./authHelper";

export interface CustomVehicleRecord {
  id: number;
  brand: string;
  model: string;
  battery: number;
  range_km: number;
  efficiency: number;
  ac_power: number;
  dc_power: number;
  fast_charge_10_to_80: number;
  created_at: string;
}

export interface AddCustomVehicleInput {
  brand: string;
  model: string;
  battery?: number;
  range_km?: number;
  efficiency?: number;
  ac_power?: number;
  dc_power?: number;
  fast_charge_10_to_80?: number;
}

export async function getCustomVehicles(): Promise<
  CustomVehicleRecord[]
> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("custom_vehicles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as CustomVehicleRecord[];
}

export async function addCustomVehicle(
  vehicle: AddCustomVehicleInput
): Promise<CustomVehicleRecord> {
  const userId = await getCurrentUserId();

  const brand = vehicle.brand.trim();
  const model = vehicle.model.trim();

  if (!brand || !model) {
    throw new Error(
      "Please enter the vehicle brand and model."
    );
  }

  const { data: existing, error: existingError } =
    await supabase
      .from("custom_vehicles")
      .select("id, brand, model")
      .eq("user_id", userId);

  if (existingError) {
    throw existingError;
  }

  const duplicate = (existing ?? []).some(
    (item) =>
      item.brand.trim().toLowerCase() ===
        brand.toLowerCase() &&
      item.model.trim().toLowerCase() ===
        model.toLowerCase()
  );

  if (duplicate) {
    throw new Error(
      "This custom vehicle already exists."
    );
  }

  const { data, error } = await supabase
    .from("custom_vehicles")
    .insert({
      user_id: userId,
      brand,
      model,
      battery: Number(vehicle.battery ?? 0),
      range_km: Number(vehicle.range_km ?? 0),
      efficiency: Number(
        vehicle.efficiency ?? 0
      ),
      ac_power: Number(
        vehicle.ac_power ?? 0
      ),
      dc_power: Number(
        vehicle.dc_power ?? 0
      ),
      fast_charge_10_to_80: Number(
        vehicle.fast_charge_10_to_80 ?? 0
      ),
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "Vehicle was not returned after saving."
    );
  }

  return data as CustomVehicleRecord;
}