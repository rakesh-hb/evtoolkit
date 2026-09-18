import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "./authHelper";

export interface ServiceTypeRecord {
  id: number;
  name: string;
  created_at: string;
}

export async function getServiceTypes(): Promise<ServiceTypeRecord[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("service_types")
    .select("id, name, created_at")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function addServiceType(
  name: string
): Promise<ServiceTypeRecord> {
  const userId = await getCurrentUserId();

  const serviceTypeName = name.trim();

  if (!serviceTypeName) {
    throw new Error(
      "Please enter a service type name."
    );
  }

  const { data, error } = await supabase
    .from("service_types")
    .insert({
      user_id: userId,
      name: serviceTypeName,
    })
    .select("id, name, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "This service type already exists."
      );
    }

    throw error;
  }

  if (!data) {
    throw new Error(
      "Service type was not returned after saving."
    );
  }

  return data;
}

export async function updateServiceType(
  id: number,
  name: string
): Promise<void> {
  const userId = await getCurrentUserId();

  const serviceTypeName = name.trim();

  if (!serviceTypeName) {
    throw new Error(
      "Please enter a service type name."
    );
  }

  const { error } = await supabase
    .from("service_types")
    .update({
      name: serviceTypeName,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "This service type already exists."
      );
    }

    throw error;
  }
}

export async function deleteServiceType(
  id: number
): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("service_types")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}