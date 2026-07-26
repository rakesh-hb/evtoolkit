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

export async function getChargingSessions() {
  const { data, error } = await supabase
    .from("charging_sessions")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []) as ChargingSession[];
}

export async function addChargingSession(
  session: Omit<ChargingSession, "id">
) {
  const { error } = await supabase
    .from("charging_sessions")
    .insert([session]);

  if (error) throw error;
}

export async function updateChargingSession(
  id: number,
  session: Omit<ChargingSession, "id">
) {
  const { error } = await supabase
    .from("charging_sessions")
    .update(session)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteChargingSession(id: number) {
  const { error } = await supabase
    .from("charging_sessions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function restoreChargingSessions(
    sessions: Omit<ChargingSession, "id">[]
  ) {
    if (sessions.length === 0) return;
  
    const { error } = await supabase
      .from("charging_sessions")
      .insert(sessions);
  
    if (error) throw error;
  }
  