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
}

export async function getChargingSessions(): Promise<ChargingSession[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("charging_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []) as ChargingSession[];
}

export async function addChargingSession(
  session: Omit<ChargingSession, "id">
) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("charging_sessions")
    .insert([
      {
        ...session,
        user_id: userId,
      },
    ]);

  if (error) throw error;
}

export async function updateChargingSession(
  id: number,
  session: Omit<ChargingSession, "id">
) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("charging_sessions")
    .update(session)
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

export async function restoreChargingSessions(
  sessions: Omit<ChargingSession, "id">[]
) {
  if (sessions.length === 0) return;

  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("charging_sessions")
    .insert(
      sessions.map((session) => ({
        ...session,
        user_id: userId,
      }))
    );

  if (error) throw error;
}