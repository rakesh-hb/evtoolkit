import { supabase } from "../lib/supabase";

import { getChargingSessions } from "./chargingService";
import { getServiceRecords } from "./serviceHistoryService";
import { getTyres } from "./tyreService";
import { getDocuments } from "./documentVaultService";
import { getInsurance } from "./insuranceService";

/**
 * Creates the same backup payload used by the existing manual backup flow.
 */
async function buildBackup() {
  const [
    charging,
    service,
    tyres,
    documents,
    insurance,
  ] = await Promise.all([
    getChargingSessions(),
    getServiceRecords(),
    getTyres(),
    getDocuments(),
    getInsurance(),
  ]);

  return {
    app: "EV Toolkit",
    version: 1,
    createdAt: new Date().toISOString(),
    charging,
    service,
    tyres,
    documents,
    insurance,
  };
}

function createBackupHash(json: string) {
  return crypto.subtle
    .digest(
      "SHA-256",
      new TextEncoder().encode(json)
    )
    .then((hashBuffer) =>
      Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
    );
}

/**
 * Stores a manually-created backup in Supabase for Premium Plus users.
 * The backup is stored as JSON in backup_registry and is not downloaded
 * to the local device.
 */
export async function createCloudBackup() {
  try {
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

    const backup = await buildBackup();
    const json = JSON.stringify(backup, null, 2);
    const backupHash = await createBackupHash(json);

    const { error: registryError } = await supabase
      .from("backup_registry")
      .insert({
        user_id: user.id,
        backup_hash: backupHash,
        backup_data: backup,
        backup_type: "manual",
      });

    if (registryError) {
      throw registryError;
    }

    alert("Backup created successfully and saved securely in the cloud.");
  } catch (error) {
    console.error("Cloud backup creation error:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to create cloud backup."
    );
  }
}
