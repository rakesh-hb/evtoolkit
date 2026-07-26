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