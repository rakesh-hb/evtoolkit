import { supabase } from "../lib/supabase";

import { restoreChargingSessions } from "./chargingService";
import { restoreServiceRecords } from "./serviceHistoryService";
import { restoreTyres } from "./tyreService";
import { restoreDocuments } from "./documentVaultService";


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
      version: "3.0",
      backupDate: new Date().toISOString(),

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
  
    // Validate backup
    if (
      backup.app !== "EV Toolkit" ||
      !backup.createdAt
    ) {
      throw new Error("Invalid backup file.");
    }
  
    const confirmed = window.confirm(
      "This will DELETE all existing data and restore the selected backup.\n\nDo you want to continue?"
    );
  
    if (!confirmed) return;
  
    // Delete existing data
    const tables = [
      "charging_sessions",
      "service_history",
      "tyres",
      "document_vault",
    ];
  
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq("id", 0);
  
      if (error) throw error;
    }
  
    // Restore
    await restoreChargingSessions(backup.charging ?? []);
    await restoreServiceRecords(backup.service ?? []);
    await restoreTyres(backup.tyres ?? []);
    await restoreDocuments(backup.documents ?? []);
  
    alert("Backup restored successfully.\n\nPlease refresh the application");
  
    window.location.reload();
  }
