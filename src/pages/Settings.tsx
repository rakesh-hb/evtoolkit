import { createBackup, restoreBackup } from "../services/backupService";
import { useRef, useState } from "react";

function Settings() {
  const [currency, setCurrency] =
    useState("INR (₹)");

  const [tariff, setTariff] =
    useState(7);

  const [distanceUnit, setDistanceUnit] =
    useState("km");

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="welcome">
        <h2>⚙️ Settings</h2>

        <p>
          Customize your EV Toolkit
          preferences.
        </p>
      </div>

      <div className="card">
        <label>Currency</label>

        <select
          value={currency}
          onChange={(e) =>
            setCurrency(e.target.value)
          }
        >
          <option>
            INR (₹)
          </option>
        </select>

        <label>
          Default Electricity Tariff
          (₹/kWh)
        </label>

        <input
          type="number"
          value={tariff}
          min={0}
          step={0.1}
          onChange={(e) =>
            setTariff(
              Number(e.target.value)
            )
          }
        />

        <label>
          Distance Unit
        </label>

        <select
          value={distanceUnit}
          onChange={(e) =>
            setDistanceUnit(
              e.target.value
            )
          }
        >
          <option value="km">
            km
          </option>

          <option value="mi">
            mi
          </option>
        </select>
      </div>

      <div className="card">
        <h3>
          💾 Backup & Restore
        </h3>

        <p>
          Export all your EV Toolkit
          data into a single backup
          file or restore it later on
          any device.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="primaryButton"
            onClick={() =>
              void createBackup()
            }
          >
            📥 Create Backup
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{
              display: "none",
            }}
            onChange={async (e) => {
              const file =
                e.target.files?.[0];

              if (!file) {
                return;
              }

              try {
                await restoreBackup(
                  file
                );
              } catch (err: any) {
                console.error(
                  "Backup restore error:",
                  err
                );

                alert(
                  err?.message ||
                    "Unable to restore backup. Please check the browser console for details."
                );
              } finally {
                /*
                 * Clear the input so the
                 * same backup file can be
                 * selected again.
                 */
                e.target.value = "";
              }
            }}
          />

          <button
            className="restoreButton"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            📤 Restore Backup
          </button>
        </div>

        <p
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "12px",
          }}
        >
          Backup includes Charging
          History, Service History,
          Tyre History, Document Vault,
          Insurance and future supported
          modules.
        </p>
      </div>

      <div className="card">
        <h3>
          GST Information
        </h3>

        <p
          style={{
            marginTop: 12,
          }}
        >
          • Home AC Charging : No GST
        </p>

        <p
          style={{
            marginTop: 8,
          }}
        >
          • Public AC Charging : As per
          operator pricing
        </p>

        <p
          style={{
            marginTop: 8,
          }}
        >
          • DC Fast Charging : 18% GST
          applied
        </p>
      </div>
    </>
  );
}

export default Settings;