import { supabase } from "../lib/supabase";

import { getChargingSessions } from "./chargingService";
import { getServiceRecords } from "./serviceHistoryService";
import { getTyres } from "./tyreService";
import { getDocuments } from "./documentVaultService";

export async function createBackup() {
  try {
    const [
      charging,
      service,
      tyres,
      documents,
    ] = await Promise.all([
      getChargingSessions(),
      getServiceRecords(),
      getTyres(),
      getDocuments(),
    ]);

    const backup = {
      app: "EV Toolkit",
      version: 1,
      createdAt: new Date().toISOString(),

      charging,
      service,
      tyres,
      documents,
    };

    const json = JSON.stringify(backup, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    const today = new Date().toISOString().split("T")[0];

    a.href = url;
    a.download = `EVToolkit_Backup_${today}.json`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    alert("Backup created successfully.");
  } catch (err) {
    console.error(err);
    alert("Failed to create backup.");
  }
}

export async function restoreBackup(file: File) {
  const text = await file.text();
  const backup = JSON.parse(text);

  if (backup.app !== "EV Toolkit") {
    throw new Error("Invalid backup file.");
  }

  if (backup.version !== 1) {
    throw new Error("Unsupported backup version.");
  }

  const confirmed = window.confirm(
    "Merge this backup with your existing data?\n\n" +
      "• Existing records will be kept.\n" +
      "• New records will be imported.\n" +
      "• Duplicate records will be skipped."
  );

  if (!confirmed) return;

  const mappedCharging = backup.charging ?? [];

  const mappedService = (backup.service ?? []).map((r: any) => ({
    vehicle: r.vehicle,
    service_date: r.date,
    odometer: r.odometer,
    service_type: r.serviceType,
    workshop: r.serviceCenter,
    cost: r.amount,
    notes: r.notes ?? "",
    attachment: r.attachment ?? "",
  }));

  const mappedTyres = (backup.tyres ?? []).map((r: any) => ({
    brand: r.brand,
    model: r.model,
    size: r.size,
    purchase_date: r.purchaseDate,
    install_date: r.installDate,
    odometer: r.odometer,
    cost: r.cost,
    dealer: r.dealer,
    warranty_months: r.warrantyMonths,
    receipt: r.receipt ?? "",
    notes: r.notes ?? "",
  }));

  const mappedDocuments = (backup.documents ?? []).map((r: any) => ({
    title: r.title,
    category: r.category,
    vehicle: r.vehicle,
    document_date: r.documentDate,
    file: r.file,
    notes: r.notes ?? "",
  }));

  const { error } = await supabase.rpc("restore_backup", {
    charging: mappedCharging,
    service: mappedService,
    tyres: mappedTyres,
    documents: mappedDocuments,
  });

  if (error) {
    throw error;
  }

  alert("Backup restored successfully.");

  window.location.reload();
}