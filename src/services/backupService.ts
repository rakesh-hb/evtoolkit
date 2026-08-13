import { supabase } from "../lib/supabase";

import { getChargingSessions } from "./chargingService";
import { getServiceRecords } from "./serviceHistoryService";
import { getTyres } from "./tyreService";
import { getDocuments } from "./documentVaultService";
import { getInsurance } from "./insuranceService";

export async function createBackup() {
  try {
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

    const backup = {
      app: "EV Toolkit",
      version: 1,
      createdAt: new Date().toISOString(),

      charging,
      service,
      tyres,
      documents,
      insurance,
    };

    const json = JSON.stringify(
      backup,
      null,
      2
    );

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    const today = new Date()
      .toISOString()
      .split("T")[0];

    a.href = url;

    a.download =
      `EVToolkit_Backup_${today}.json`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

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

export async function restoreBackup(
  file: File
) {
  try {
    // ============================================================
    // Read backup file
    // ============================================================

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

    // ============================================================
    // Validate backup
    // ============================================================

    if (
      !backup ||
      typeof backup !== "object"
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

    // ============================================================
    // Validate backup sections
    // ============================================================

    const charging =
      Array.isArray(
        backup.charging
      )
        ? backup.charging
        : [];

    const service =
      Array.isArray(
        backup.service
      )
        ? backup.service
        : [];

    const tyres =
      Array.isArray(
        backup.tyres
      )
        ? backup.tyres
        : [];

    const documents =
      Array.isArray(
        backup.documents
      )
        ? backup.documents
        : [];

    const insurance =
      Array.isArray(
        backup.insurance
      )
        ? backup.insurance
        : [];

    // ============================================================
    // Confirm restore
    // ============================================================

    const confirmed =
      window.confirm(
        "Merge this backup with your existing data?\n\n" +
          "• Existing records will be kept.\n" +
          "• New records will be imported.\n" +
          "• Duplicate records will be skipped."
      );

    if (!confirmed) {
      return;
    }

    // ============================================================
    // Charging
    // ============================================================

    const mappedCharging =
      charging.map(
        (r: any) => ({
          vehicle:
            r.vehicle,

          charger:
            r.charger,

          station:
            r.station,

          energy:
            r.energy,

          cost:
            r.cost,

          date:
            r.date,

          invoice:
            r.invoice ?? "",
        })
      );

    // ============================================================
    // Service History
    // ============================================================

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

    // ============================================================
    // Tyres
    // ============================================================

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

    // ============================================================
    // Documents
    // ============================================================

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

    // ============================================================
    // Insurance
    // ============================================================

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

    // ============================================================
    // Restore through Supabase
    // ============================================================

    const {
      data,
      error,
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

    // ============================================================
    // Handle Supabase error
    // ============================================================

    if (error) {
      console.error(
        "restore_backup RPC error:",
        error
      );

      throw new Error(
        `Restore failed: ${
          error.message ||
          "Supabase could not restore the backup."
        }`
      );
    }

    // ============================================================
    // Validate RPC response
    // ============================================================

    if (
      !data ||
      typeof data !== "object"
    ) {
      throw new Error(
        "Restore completed but the server returned an invalid restore summary."
      );
    }

    // ============================================================
    // Extract statistics
    // ============================================================

    const result = data as {
      charging?: {
        total?: number;
        inserted?: number;
        skipped?: number;
      };

      service?: {
        total?: number;
        inserted?: number;
        skipped?: number;
      };

      tyres?: {
        total?: number;
        inserted?: number;
        skipped?: number;
      };

      documents?: {
        total?: number;
        inserted?: number;
        skipped?: number;
      };

      insurance?: {
        total?: number;
        inserted?: number;
        skipped?: number;
      };

      summary?: {
        total?: number;
        inserted?: number;
        skipped?: number;
      };
    };

    const chargingInserted =
      result.charging?.inserted ?? 0;

    const chargingSkipped =
      result.charging?.skipped ?? 0;

    const serviceInserted =
      result.service?.inserted ?? 0;

    const serviceSkipped =
      result.service?.skipped ?? 0;

    const tyresInserted =
      result.tyres?.inserted ?? 0;

    const tyresSkipped =
      result.tyres?.skipped ?? 0;

    const documentsInserted =
      result.documents?.inserted ?? 0;

    const documentsSkipped =
      result.documents?.skipped ?? 0;

    const insuranceInserted =
      result.insurance?.inserted ?? 0;

    const insuranceSkipped =
      result.insurance?.skipped ?? 0;

    const totalInserted =
      result.summary?.inserted ??
      chargingInserted +
        serviceInserted +
        tyresInserted +
        documentsInserted +
        insuranceInserted;

    const totalSkipped =
      result.summary?.skipped ??
      chargingSkipped +
        serviceSkipped +
        tyresSkipped +
        documentsSkipped +
        insuranceSkipped;

    // ============================================================
    // Build restore summary
    // ============================================================

    const summary =
      [
        "Backup restore completed.",
        "",
        `Charging: ${chargingInserted} imported, ${chargingSkipped} skipped`,
        `Service: ${serviceInserted} imported, ${serviceSkipped} skipped`,
        `Tyres: ${tyresInserted} imported, ${tyresSkipped} skipped`,
        `Documents: ${documentsInserted} imported, ${documentsSkipped} skipped`,
        `Insurance: ${insuranceInserted} imported, ${insuranceSkipped} skipped`,
        "",
        `Total imported: ${totalInserted}`,
        `Total skipped: ${totalSkipped}`,
      ].join("\n");

    alert(summary);

    window.location.reload();
  } catch (err: any) {
    console.error(
      "Backup restore error:",
      err
    );

    throw err;
  }
}