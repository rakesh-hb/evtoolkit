import { getCurrentUserId } from "./authHelper";
import { supabase } from "../lib/supabase";

export interface ChargingSession {
  id: number;
  vehicle: string;
  charger: string;
  energy: number;
  cost: number;
  station: string;
  date: string;
  invoice: string;
}

export interface ChargingStation {
  id: number;
  name: string;
  category: string;
}

export async function getChargingSessions(): Promise<ChargingSession[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("charging_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    vehicle: row.vehicle,
    charger: row.charger,
    energy: Number(row.energy ?? 0),
    cost: Number(row.cost ?? 0),
    station: row.station ?? "",
    date: row.date,
    invoice: row.invoice ?? "",
  }));
}

export async function addChargingSession(
  session: Omit<ChargingSession, "id">
) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("charging_sessions")
    .insert({
      user_id: userId,
      vehicle: session.vehicle,
      charger: session.charger,
      energy: session.energy,
      cost: session.cost,
      station: session.station,
      date: session.date,
      invoice: session.invoice ?? "",
    });

  if (error) throw error;
}

export async function updateChargingSession(
  id: number,
  session: Omit<ChargingSession, "id">
) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("charging_sessions")
    .update({
      vehicle: session.vehicle,
      charger: session.charger,
      energy: session.energy,
      cost: session.cost,
      station: session.station,
      date: session.date,
      invoice: session.invoice ?? "",
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteChargingSession(id: number) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("charging_sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

/* =========================================================
   CUSTOM CHARGING STATIONS
   ========================================================= */

export async function getChargingStations(): Promise<ChargingStation[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("charging_stations")
    .select("id, name, category")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function addChargingStation(
  name: string,
  category: string = "Other"
) {
  const userId = await getCurrentUserId();

  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("Charging station name is required.");
  }

  const { data, error } = await supabase
    .from("charging_stations")
    .insert({
      user_id: userId,
      name: cleanName,
      category,
    })
    .select("id, name, category")
    .single();

  if (error) throw error;

  return data as ChargingStation;
}

export async function deleteChargingStation(id: number) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("charging_stations")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

/* =========================================================
   BACKUP / RESTORE
   ========================================================= */

export async function restoreChargingSessions(
  sessions: Omit<ChargingSession, "id">[]
) {
  if (sessions.length === 0) return;

  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("charging_sessions")
    .insert(
      sessions.map((session) => ({
        user_id: userId,
        vehicle: session.vehicle,
        charger: session.charger,
        energy: session.energy,
        cost: session.cost,
        station: session.station,
        date: session.date,
        invoice: session.invoice ?? "",
      }))
    );

  if (error) throw error;
}