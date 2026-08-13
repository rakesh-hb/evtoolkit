import { supabase } from "../lib/supabase";

import { getChargingSessions } from "./chargingService";
import { getServiceRecords } from "./serviceHistoryService";
import { getTyres } from "./tyreService";
import { getDocuments } from "./documentVaultService";
import { getInsurance } from "./insuranceService";

/*
 * Create a SHA-256 hash for the exact backup JSON.
 *
 * The hash is used to bind the backup file to the
 * account that created it.
 */
async function createBackupHash(
  json: string
): Promise<string> {
  const encoder =
    new TextEncoder();

  const data =
    encoder.encode(json);

  const hashBuffer =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  const hashArray =
    Array.from(
      new Uint8Array(hashBuffer)
    );

  return hashArray
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
}


/*
 * ============================================================
 * CREATE BACKUP
 * ============================================================
 */

export async function createBackup() {
  try {
    /*
     * Make sure the user is authenticated.
     */

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error(
        "You must be signed in to create a backup."
      );
    }

    /*
     * Load all application data.
     */

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

    /*
     * Create the backup object.
     *
     * IMPORTANT:
     * We do NOT put user_id into the JSON.
     * Ownership is maintained separately by
     * the backup_registry table.
     */

    const backup = {
      app: "EV Toolkit",
      version: 1,
      createdAt:
        new Date().toISOString(),

      charging,
      service,
      tyres,
      documents,
      insurance,
    };

    /*
     * Create deterministic JSON.
     *
     * This exact string is what gets hashed.
     */

    const json =
      JSON.stringify(
        backup,
        null,
        2
      );

    /*
     * Calculate backup fingerprint.
     */

    const backupHash =
      await createBackupHash(
        json
      );

    /*
     * Register the backup against
     * the currently authenticated user.
     */

    const {
      error: registerError,
    } =
      await supabase.rpc(
        "register_backup",
        {
          p_backup_hash:
            backupHash,
        }
      );

    if (registerError) {
      console.error(
        "Backup registration error:",
        registerError
      );

      throw new Error(
        registerError.message ||
          "Unable to register backup."
      );
    }

    /*
     * Create downloadable file.
     */

    const blob =
      new Blob(
        [json],
        {
          type:
            "application/json",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    a.href = url;

    a.download =
      `EVToolkit_Backup_${today}.json`;

    document.body.appendChild(
      a
    );

    a.click();

    document.body.removeChild(
      a
    );

    URL.revokeObjectURL(
      url
    );

    alert(
      "Backup created successfully."
    );
  } catch (err: any) {
    console.error(
      "Backup creation error:",
      err
    );

    alert(
      err?.message ||
        "Failed to create backup."
    );
  }
}


/*
 * ============================================================
 * RESTORE BACKUP
 * ============================================================
 */

export async function restoreBackup(
  file: File
) {
  try {
    /*
     * Make sure the user is authenticated.
     */

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error(
        "You must be signed in to restore a backup."
      );
    }

    /*
     * Read the file.
     */

    const text =
      await file.text();

    let backup: any;

    try {
      backup =
        JSON.parse(text);
    } catch {
      throw new Error(
        "The selected file is not valid JSON."
      );
    }

    /*
     * Validate basic backup structure.
     */

    if (
      !backup ||
      typeof backup !==
        "object"
    ) {
      throw new Error(
        "Invalid backup file."
      );
    }

    if (
      backup.app !==
      "EV Toolkit"
    ) {
      throw new Error(
        "Invalid backup file. This file was not created by EV Toolkit."
      );
    }

    if (
      backup.version !== 1
    ) {
      throw new Error(
        "Unsupported backup version."
      );
    }

    /*
     * Re-create the exact JSON representation
     * used to generate the backup hash.
     *
     * This means any modification to the JSON
     * produces a different hash.
     */

    const normalizedBackup = {
      app:
        backup.app,

      version:
        backup.version,

      createdAt:
        backup.createdAt,

      charging:
        Array.isArray(
          backup.charging
        )
          ? backup.charging
          : [],

      service:
        Array.isArray(
          backup.service
        )
          ? backup.service
          : [],

      tyres:
        Array.isArray(
          backup.tyres
        )
          ? backup.tyres
          : [],

      documents:
        Array.isArray(
          backup.documents
        )
          ? backup.documents
          : [],

      insurance:
        Array.isArray(
          backup.insurance
        )
          ? backup.insurance
          : [],
    };

    const normalizedJson =
      JSON.stringify(
        normalizedBackup,
        null,
        2
      );

    /*
     * Calculate the hash of the selected file.
     */

    const backupHash =
      await createBackupHash(
        normalizedJson
      );

    /*
     * ==========================================================
     * VERIFY BACKUP OWNERSHIP
     * ==========================================================
     *
     * This happens BEFORE any restore operation.
     */

    const {
      data:
        isOwner,
      error:
        verifyError,
    } =
      await supabase.rpc(
        "verify_backup_owner",
        {
          p_backup_hash:
            backupHash,
        }
      );

    if (verifyError) {
      console.error(
        "Backup ownership verification error:",
        verifyError
      );

      throw new Error(
        verifyError.message ||
          "Unable to verify backup ownership."
      );
    }

    if (
      isOwner !== true
    ) {
      throw new Error(
        "This backup belongs to another EV Toolkit account and cannot be restored here."
      );
    }

    /*
     * ==========================================================
     * CONFIRM RESTORE
     * ==========================================================
     */

    const confirmed =
      window.confirm(
        "Restore this backup?\n\n" +
          "• Existing records will be kept.\n" +
          "• New records will be imported.\n" +
          "• Duplicate records will be skipped."
      );

    if (!confirmed) {
      return;
    }

    /*
     * ==========================================================
     * PREPARE BACKUP DATA
     * ==========================================================
     */

    const charging =
      normalizedBackup.charging;

    const service =
      normalizedBackup.service;

    const tyres =
      normalizedBackup.tyres;

    const documents =
      normalizedBackup.documents;

    const insurance =
      normalizedBackup.insurance;

    /*
     * Charging
     */

    const mappedCharging =
      charging;

    /*
     * Service History
     */

    const mappedService =
      service.map(
        (r: any) => ({
          vehicle:
            r.vehicle,

          service_date:
            r.service_date ??
            r.date,

          odometer:
            r.odometer,

          service_type:
            r.service_type ??
            r.serviceType,

          workshop:
            r.workshop ??
            r.serviceCenter,

          cost:
            r.cost ??
            r.amount,

          notes:
            r.notes ?? "",

          attachment:
            r.attachment ?? "",
        })
      );

    /*
     * Tyres
     */

    const mappedTyres =
      tyres.map(
        (r: any) => ({
          brand:
            r.brand,

          model:
            r.model,

          size:
            r.size,

          purchase_date:
            r.purchase_date ??
            r.purchaseDate,

          install_date:
            r.install_date ??
            r.installDate,

          odometer:
            r.odometer,

          cost:
            r.cost,

          dealer:
            r.dealer,

          warranty_months:
            r.warranty_months ??
            r.warrantyMonths,

          receipt:
            r.receipt ?? "",

          notes:
            r.notes ?? "",
        })
      );

    /*
     * Documents
     */

    const mappedDocuments =
      documents.map(
        (r: any) => ({
          title:
            r.title,

          category:
            r.category,

          vehicle:
            r.vehicle,

          document_date:
            r.document_date ??
            r.documentDate,

          file:
            r.file,

          notes:
            r.notes ?? "",
        })
      );

    /*
     * Insurance
     */

    const mappedInsurance =
      insurance.map(
        (p: any) => ({
          vehicle:
            p.vehicle,

          company:
            p.company,

          policy_number:
            p.policy_number,

          policy_type:
            p.policy_type,

          start_date:
            p.start_date,

          expiry_date:
            p.expiry_date,

          premium:
            p.premium,

          idv:
            p.idv,

          addons:
            p.addons,

          agent:
            p.agent,

          contact_number:
            p.contact_number,

          notes:
            p.notes ?? "",

          attachment:
            p.attachment ?? "",
        })
      );

    /*
     * ==========================================================
     * RESTORE INTO CURRENT USER ACCOUNT
     * ==========================================================
     *
     * restore_backup() uses auth.uid() internally.
     *
     * We do NOT pass user_id from the backup.
     */

    const {
      error:
        restoreError,
    } =
      await supabase.rpc(
        "restore_backup",
        {
          charging:
            mappedCharging,

          service:
            mappedService,

          tyres:
            mappedTyres,

          documents:
            mappedDocuments,

          insurance:
            mappedInsurance,
        }
      );

    if (restoreError) {
      console.error(
        "restore_backup RPC error:",
        restoreError
      );

      throw new Error(
        `Restore failed: ${
          restoreError.message ||
          "Supabase could not restore the backup."
        }`
      );
    }

    /*
     * Success
     */

    alert(
      "Backup restored successfully."
    );

    window.location.reload();
  } catch (err: any) {
    console.error(
      "Backup restore error:",
      err
    );

    throw err;
  }
}