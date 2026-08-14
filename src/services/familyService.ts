import { supabase } from "../lib/supabase";

export async function acceptFamilyInvitation(
  invitationId: string
) {
  const {
    data,
    error,
  } = await supabase.rpc(
    "accept_family_invitation",
    {
      p_invitation_id:
        invitationId,
    }
  );

  if (error) {
    console.error(
      "Accept family invitation error:",
      error
    );

    throw error;
  }

  return data;
}