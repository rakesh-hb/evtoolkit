import { useEffect, useMemo, useRef, useState } from "react";

import {
  getChargingSessions,
  addChargingSession,
  updateChargingSession,
  deleteChargingSession,
  getChargingStations,
  addChargingStation,
  type ChargingSession,
  type ChargingStation,
} from "../services/chargingService";

import { getCurrentUserId } from "../services/authHelper";
import {
  getFormDraft,
  saveFormDraft,
  deleteFormDraft,
} from "../services/formDraftService";

import { vehicles } from "../data/vehicles";
import {
  getCustomVehicles,
  addCustomVehicle,
  type CustomVehicleRecord,
} from "../services/customVehicleService";
import ReceiptUploader from "../components/ReceiptUploader";
import UserDetails from "../components/UserDetails";
import {
  getCurrentPlan,
  canAddChargingSession,
  canUseFileUploads,
  FREE_LIMITS,
  type SubscriptionPlan,
} from "../services/subscriptionService";


export interface ChargingStationOption {
  name: string;
  category:
    | "Home"
    | "Public"
    | "Office"
    | "Fleet"
    | "Highway"
    | "Commercial"
    | "OEM"
    | "Utility"
    | "Fuel Station"
    | "Other";
}


export const chargingStations: ChargingStationOption[] = [
  { name: "Home Charging", category: "Home" },
  { name: "Home 3.3kw", category: "Home" },
  { name: "Home 7.2kw", category: "Home" },
  { name: "Home 7.4kw", category: "Home" },
  { name: "Home 11kw", category: "Home" },
  { name: "Home 22kw", category: "Home" },

  {
    name: "Apartment/Residential/Society Charger",
    category: "Home",
  },

  { name: "Tata Power EZ Charge", category: "Public" },
  { name: "Statiq", category: "Public" },
  { name: "ChargeZone", category: "Public" },
  { name: "Jio-bp Pulse", category: "Public" },
  { name: "Bolt.Earth", category: "Public" },
  { name: "Kazam", category: "Public" },
  { name: "ThunderPlus", category: "Public" },
  { name: "ElectreeFi", category: "Public" },
  { name: "EV Dock", category: "Public" },
  { name: "ChargeMOD", category: "Public" },
  { name: "Glida", category: "Public" },
  { name: "Fortum Charge & Drive", category: "Public" },
  { name: "Relux Electric", category: "Public" },
  { name: "ElectricPe", category: "Public" },
  { name: "EVRE", category: "Public" },
  { name: "EV91", category: "Public" },
  { name: "PlugNGo", category: "Public" },
  { name: "GO EC", category: "Public" },

  { name: "Indian Oil", category: "Fuel Station" },
  { name: "BPCL", category: "Fuel Station" },
  { name: "HPCL", category: "Fuel Station" },
  { name: "Shell Recharge", category: "Fuel Station" },

  { name: "BESCOM EV Mithra", category: "Utility" },

  { name: "Ather Grid", category: "OEM" },
  { name: "Hyundai EV Charging", category: "OEM" },
  { name: "MG ChargeHub", category: "OEM" },
  { name: "Mahindra Charging", category: "OEM" },
  { name: "BYD Charging", category: "OEM" },
  { name: "BMW Charging", category: "OEM" },
  { name: "Mercedes-Benz Charging", category: "OEM" },
  { name: "Audi Charging", category: "OEM" },
  { name: "Kia EV Charging", category: "OEM" },
  { name: "Volvo Charging", category: "OEM" },

  { name: "Office Charger", category: "Office" },

  { name: "Mall Charging", category: "Commercial" },
  { name: "Hotel/Restaurant Charging", category: "Commercial" },
  { name: "Airport Charging", category: "Commercial" },
  { name: "Metro Station Charging", category: "Commercial" },
  { name: "Hospital Charging", category: "Commercial" },

  { name: "Other", category: "Other" },
];


interface ChargingDraft {
  vehicle: string;
  charger: string;
  energy: string;
  cost: string;
  station: string;
  date: string;
}


interface TrackerProps {
  onNavigate?: (page: string) => void;
}

function Tracker({ onNavigate }: TrackerProps) {
  const defaultVehicle =
    vehicles.find(
      (v) => v.model === "Curvv EV 55"
    ) ?? vehicles[0];


  const [vehicle, setVehicle] = useState(
    `${defaultVehicle.brand} ${defaultVehicle.model}`
  );

  const [sessions, setSessions] =
    useState<ChargingSession[]>([]);


  /*
   * Current authenticated user.
   *
   * This is used only by the UI to determine
   * whether Edit/Delete should be displayed.
   *
   * RLS remains responsible for actually
   * enforcing ownership at database level.
   */
  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);


  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>("free");


  const [charger, setCharger] =
    useState("DC Fast");

  const [energy, setEnergy] =
    useState("");

  const [cost, setCost] =
    useState("");

  const [station, setStation] =
    useState("");

  const [date, setDate] =
    useState("");

  const [invoice, setInvoice] =
    useState("");


  const [invoiceResetKey, setInvoiceResetKey] =
    useState(0);


  const [editingId, setEditingId] =
    useState<number | null>(null);


  const [customStations, setCustomStations] =
    useState<ChargingStation[]>([]);


  const [showAddStation, setShowAddStation] =
    useState(false);


  const [newStationName, setNewStationName] =
    useState("");


  const [newStationCategory, setNewStationCategory] =
    useState("Other");


  const [savingStation, setSavingStation] =
    useState(false);

  /* =========================================================
   * SEARCHABLE VEHICLE / STATION DROPDOWNS
   * ========================================================= */
  const [customVehicles, setCustomVehicles] =
    useState<CustomVehicleRecord[]>([]);

  const [vehicleSearch, setVehicleSearch] =
    useState("");
  const [showVehicleSuggestions, setShowVehicleSuggestions] =
    useState(false);
  const vehicleDropdownRef =
    useRef<HTMLDivElement | null>(null);

  const [showVehicleForm, setShowVehicleForm] =
    useState(false);
  const [vehicleBrand, setVehicleBrand] =
    useState("");
  const [vehicleModel, setVehicleModel] =
    useState("");
  const [savingVehicle, setSavingVehicle] =
    useState(false);

  const [stationSearch, setStationSearch] =
    useState("");
  const [showStationSuggestions, setShowStationSuggestions] =
    useState(false);
  const stationDropdownRef =
    useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        vehicleDropdownRef.current &&
        !vehicleDropdownRef.current.contains(target)
      ) {
        setShowVehicleSuggestions(false);
        setVehicleSearch("");
      }

      if (
        stationDropdownRef.current &&
        !stationDropdownRef.current.contains(target)
      ) {
        setShowStationSuggestions(false);
        setStationSearch("");
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowVehicleSuggestions(false);
        setShowStationSuggestions(false);
        setVehicleSearch("");
        setStationSearch("");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);


  /*
   * =========================================================
   * FORM AUTOSAVE
   * =========================================================
   *
   * Drafts are stored in Supabase through formDraftService.
   *
   * The invoice/file content is intentionally NOT stored in
   * the draft because it can be large. The final charging
   * session still stores the invoice normally.
   */
  const [draftStatus, setDraftStatus] =
    useState<"idle" | "saving" | "saved" | "error">("idle");

  const autosaveTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const skipAutosaveRef =
    useRef(false);

  const draftLoadedRef =
    useRef(false);


  function getDraftKey() {
    return editingId !== null
      ? `charging-session:${editingId}`
      : "charging-session:new";
  }


  function getDraftData(): ChargingDraft {
    return {
      vehicle,
      charger,
      energy,
      cost,
      station,
      date,
    };
  }


  async function restoreDraft(
    draftKey: string
  ) {
    try {
      const draft =
        await getFormDraft<ChargingDraft>(
          draftKey
        );

      if (!draft?.draft_data) {
        return false;
      }

      const data =
        draft.draft_data;

      skipAutosaveRef.current = true;

      setVehicle(
        data.vehicle ??
          `${defaultVehicle.brand} ${defaultVehicle.model}`
      );

      setCharger(
        data.charger ?? "DC Fast"
      );

      setEnergy(
        data.energy ?? ""
      );

      setCost(
        data.cost ?? ""
      );

      setStation(
        data.station ?? ""
      );

      setDate(
        data.date ?? ""
      );

      setDraftStatus("saved");

      return true;
    } catch (error) {
      console.error(
        "Failed to restore charging session draft:",
        error
      );

      setDraftStatus("error");
      return false;
    }
  }


  /*
   * Initial load:
   * - load current user
   * - load charging sessions
   * - load custom charging stations
   * - restore an unfinished NEW charging session draft
   */
  useEffect(() => {
    async function initialize() {
      try {
        const userId =
          await getCurrentUserId();

        setCurrentUserId(userId);

        const plan = await getCurrentPlan();
        setSubscriptionPlan(plan);

        await loadSessions();
        await loadStations();
        await loadCustomVehicles();

        await restoreDraft(
          "charging-session:new"
        );

        draftLoadedRef.current = true;
      } catch (error) {
        console.error(
          "Failed to initialize Charge Tracker:",
          error
        );

        alert(
          "Failed to initialize Charge Tracker."
        );
      }
    }

    void initialize();

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(
          autosaveTimerRef.current
        );
      }
    };
  }, []);


  /*
   * Restore a draft when entering edit mode.
   */
  useEffect(() => {
    if (
      !draftLoadedRef.current ||
      editingId === null
    ) {
      return;
    }

    void restoreDraft(
      `charging-session:${editingId}`
    );
  }, [editingId]);


  /*
   * Debounced autosave.
   *
   * Every form change waits 1 second before writing
   * the current draft to Supabase.
   */
  useEffect(() => {
    if (!draftLoadedRef.current) {
      return;
    }

    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(
        autosaveTimerRef.current
      );
    }

    autosaveTimerRef.current =
      setTimeout(() => {
        void autosaveDraft();
      }, 1000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(
          autosaveTimerRef.current
        );
      }
    };
  }, [
    vehicle,
    charger,
    energy,
    cost,
    station,
    date,
    editingId,
  ]);


  async function autosaveDraft() {
    try {
      setDraftStatus("saving");

      await saveFormDraft(
        getDraftKey(),
        getDraftData()
      );

      setDraftStatus("saved");
    } catch (error) {
      console.error(
        "Failed to autosave charging session:",
        error
      );

      setDraftStatus("error");
    }
  }


  function handleAutosaveBlur() {
    /*
     * The normal 1-second debounce handles persistence.
     * Blur also restarts the debounce so leaving a field
     * does not wait for a previous timer.
     */
    if (autosaveTimerRef.current) {
      clearTimeout(
        autosaveTimerRef.current
      );
    }

    autosaveTimerRef.current =
      setTimeout(() => {
        void autosaveDraft();
      }, 1000);
  }


  async function deleteCurrentDraft() {
    try {
      await deleteFormDraft(
        getDraftKey()
      );
    } catch (error) {
      console.error(
        "Failed to delete charging session draft:",
        error
      );
    }
  }


  /*
   * Return today's date using the user's local timezone.
   *
   * We intentionally do not use toISOString()
   * because that uses UTC.
   */
  function getTodayLocalDate() {
    const today = new Date();

    const year =
      today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  const today =
    getTodayLocalDate();


  async function loadSessions() {
    try {
      const data =
        await getChargingSessions();

      setSessions(data);
    } catch (error) {
      console.error(
        "Failed to load charging sessions:",
        error
      );

      alert(
        "Failed to load charging sessions."
      );
    }
  }


  async function loadCustomVehicles() {
    try {
      const data = await getCustomVehicles();
      setCustomVehicles(data);
    } catch (error) {
      console.error("Failed to load custom vehicles:", error);
      alert("Failed to load custom vehicles.");
    }
  }


  async function loadStations() {
    try {
      const data =
        await getChargingStations();

      setCustomStations(data);
    } catch (error) {
      console.error(
        "Failed to load charging stations:",
        error
      );
    }
  }


  async function handleAddVehicle() {
    const brand = vehicleBrand.trim();
    const model = vehicleModel.trim();

    if (!brand || !model) {
      alert("Please enter the vehicle brand and model.");
      return;
    }

    const vehicleName = `${brand} ${model}`.trim();
    const duplicate = allVehicles.some(
      (item) =>
        item.value.trim().toLowerCase() === vehicleName.toLowerCase()
    );

    if (duplicate) {
      alert("This vehicle already exists.");
      return;
    }

    try {
      setSavingVehicle(true);

      const created = await addCustomVehicle({
        brand,
        model,
      });

      setCustomVehicles((current) => [...current, created]);

      const createdName = `${created.brand} ${created.model}`;

      setVehicle(createdName);
      setVehicleSearch(createdName);
      setShowVehicleSuggestions(false);

      setVehicleBrand("");
      setVehicleModel("");
      setShowVehicleForm(false);

      alert("Vehicle added successfully.");
    } catch (error: any) {
      console.error(error);

      if (
        error?.code === "23505" ||
        error?.message?.toLowerCase?.().includes("duplicate")
      ) {
        alert("This vehicle already exists.");
      } else {
        alert(
          error?.message ||
            "Failed to add vehicle."
        );
      }
    } finally {
      setSavingVehicle(false);
    }
  }


  async function handleAddStation() {
    const name = newStationName.trim();

    if (!name) {
      alert("Please enter a charging station name.");
      return;
    }

    const normalizedName = name.toLowerCase();

    const duplicate = allStationOptions.some(
      (item) =>
        item.name.trim().toLowerCase() === normalizedName
    );

    if (duplicate) {
      alert("This charging station already exists.");
      return;
    }

    try {
      setSavingStation(true);

      const newStation = await addChargingStation(
        name,
        newStationCategory
      );

      setCustomStations((current) => {
        const alreadyExists = current.some(
          (item) =>
            item.name.trim().toLowerCase() ===
            newStation.name.trim().toLowerCase()
        );

        return alreadyExists
          ? current
          : [...current, newStation];
      });

      setStation(newStation.name);
      setStationSearch(newStation.name);
      setShowStationSuggestions(false);

      setNewStationName("");
      setNewStationCategory("Other");
      setShowAddStation(false);

      alert("Charging station added successfully.");
    } catch (error: any) {
      console.error(error);

      if (
        error?.code === "23505" ||
        error?.message?.toLowerCase?.().includes("duplicate")
      ) {
        alert("This charging station already exists.");
      } else {
        alert(
          error?.message ||
            "Failed to add charging station."
        );
      }
    } finally {
      setSavingStation(false);
    }
  }


  const allVehicles = useMemo(() => {
    const builtIn = vehicles.map((item) => ({
      value: `${item.brand} ${item.model}`,
      label: `${item.brand} ${item.model}`,
    }));

    const custom = customVehicles.map((item) => ({
      value: `${item.brand} ${item.model}`,
      label: `${item.brand} ${item.model}`,
    }));

    const seen = new Set<string>();

    return [...builtIn, ...custom].filter((item) => {
      const key = item.value.trim().toLowerCase();

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }, [customVehicles]);

  const filteredVehicleOptions = useMemo(() => {
    const query = vehicleSearch.trim().toLowerCase();

    if (!query) return allVehicles;

    return allVehicles.filter((item) =>
      item.label.toLowerCase().includes(query)
    );
  }, [allVehicles, vehicleSearch]);

  const allStationOptions = useMemo(() => {
    const seen = new Set<string>();

    return [...chargingStations, ...customStations].filter((item) => {
      const key = item.name.trim().toLowerCase();

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }, [customStations]);

  const filteredStationOptions = useMemo(() => {
    const query = stationSearch.trim().toLowerCase();

    if (!query) return allStationOptions;

    return allStationOptions.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [allStationOptions, stationSearch]);


  async function saveSession() {
    if (
      !vehicle ||
      !energy ||
      !cost ||
      !date
    ) {
      alert(
        "Please fill all required fields."
      );

      return;
    }


    /*
     * Prevent future charging dates.
     */
    if (date > today) {
      alert(
        "Charging date cannot be in the future."
      );

      return;
    }


    const wasEditing =
      editingId !== null;

    try {
      /*
       * Free users are limited to 20 of their own
       * charging sessions. Editing an existing session
       * does not consume another session slot.
       *
       * Premium users have no charging-session limit.
       */
      if (!wasEditing) {
        const plan =
          await getCurrentPlan();

        const ownSessionCount =
          currentUserId === null
            ? sessions.length
            : sessions.filter(
                (item) =>
                  item.user_id ===
                  currentUserId
              ).length;

        if (
          !canAddChargingSession(
            ownSessionCount,
            plan
          )
        ) {
          alert(
            `The Free plan is limited to ${FREE_LIMITS.chargingSessions} charging sessions. Upgrade to Premium for ₹49 one-time to add more charging sessions.`
          );

          return;
        }
      }

      const session = {
        vehicle,
        charger,
        energy: Number(energy),
        cost: Number(cost),
        station,
        date,
        invoice,
      };


      if (editingId !== null) {
        await updateChargingSession(
          editingId,
          session
        );
      } else {
        await addChargingSession(
          session
        );
      }


      await loadSessions();


      /*
       * Delete the exact draft that was just committed.
       */
      await deleteFormDraft(
        wasEditing
          ? `charging-session:${editingId}`
          : "charging-session:new"
      );


      alert(
        wasEditing
          ? "Charging session updated successfully."
          : "Charging session added successfully."
      );


      resetFormWithoutConfirmation();

    } catch (error: any) {
      console.error(error);

      alert(
        error?.message ||
          (wasEditing
            ? "Failed to update session."
            : "Failed to save session.")
      );
    }
  }


  async function deleteSession(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this charging session?\n\nThis action cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteChargingSession(
        id
      );

      await loadSessions();

      /*
       * A deleted record can no longer have an edit draft.
       */
      await deleteFormDraft(
        `charging-session:${id}`
      );

      alert(
        "Charging session deleted successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to delete the charging session."
      );
    }
  }


  function resetFormWithoutConfirmation() {
    if (autosaveTimerRef.current) {
      clearTimeout(
        autosaveTimerRef.current
      );
    }

    skipAutosaveRef.current = true;

    setEditingId(null);

    const resetVehicle =
      `${defaultVehicle.brand} ${defaultVehicle.model}`;

    setVehicle(resetVehicle);
    setVehicleSearch("");
    setShowVehicleSuggestions(false);
    setStationSearch("");
    setShowStationSuggestions(false);

    setCharger("DC Fast");
    setEnergy("");
    setCost("");
    setStation("");
    setDate("");
    setInvoice("");

    setDraftStatus("idle");

    setInvoiceResetKey(
      (key) => key + 1
    );
  }


  async function resetForm() {
    const confirmed =
      window.confirm(
        "⚠️ Reset all entered values?\n\nAll unsaved information will be cleared."
      );

    if (!confirmed) {
      return;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(
        autosaveTimerRef.current
      );
    }

    await deleteCurrentDraft();

    resetFormWithoutConfirmation();
  }


  return (
    <>
      <style>{`

        .evtoolkitCustomFieldRow {
          width: 100%;
          min-width: 0;
        }

        .evtoolkitCustomFieldControl {
          min-width: 0;
          flex: 1 1 auto;
        }

        .evtoolkitCustomFieldButton {
          flex: 0 0 auto;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .evtoolkitCustomFieldRow {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100% !important;
          }

          .evtoolkitCustomFieldControl {
            width: 100% !important;
            min-width: 0 !important;
            flex: none !important;
          }

          .evtoolkitCustomFieldButton {
            width: 100% !important;
            min-width: 0 !important;
            min-height: 44px !important;
            height: auto !important;
            margin: 0 !important;
            position: static !important;
            top: auto !important;
            transform: none !important;
            white-space: normal !important;
            box-sizing: border-box !important;
          }
        }
        .trackerFileUpload input[type="file"]::file-selector-button {
          background: #16a34a;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 8px 14px;
          margin-right: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .trackerFileUpload input[type="file"]::file-selector-button:hover {
          background: #15803d;
        }
      `}</style>
      <div
        style={{
          position: "relative",
          minHeight: 52,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
        }}
      >
        <UserDetails
          onClick={() => {
            onNavigate?.("profile");
          }}
        />
      </div>

      <div className="welcome">
        <h2>
          📝 Charge Tracker
        </h2>

        <p>
          Record and manage your EV
          charging sessions.
        </p>
      </div>


      <div className="card">
        <h3>
          {editingId !== null
            ? "✏️ Edit Charging Session"
            : "➕ New Charging Session"}
        </h3>


        <label>
          Vehicle
        </label>

        <div
          className="evtoolkitCustomFieldRow"
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "flex-start",
          }}
        >
          <div
            className="evtoolkitCustomFieldControl"
            ref={vehicleDropdownRef}
            style={{
              position: "relative",
              flex: 1,
              minWidth: 0,
            }}
          >
            <input
              type="text"
              placeholder="Type vehicle name to search..."
              value={
                showVehicleSuggestions
                  ? vehicleSearch
                  : vehicle
              }
              disabled={editingId !== null}
              onFocus={() => {
                if (editingId !== null) return;

                setShowVehicleSuggestions(true);
                if (!vehicleSearch) {
                  setVehicleSearch("");
                }
              }}
              onChange={(e) => {
                const value = e.target.value;
                setVehicleSearch(value);
                setShowVehicleSuggestions(true);
              }}
              onBlur={handleAutosaveBlur}
              style={{
                width: "100%",
                boxSizing: "border-box",
                paddingRight: "44px",
              }}
            />

            <button
              type="button"
              aria-label="Open vehicle list"
              disabled={editingId !== null}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (editingId !== null) return;

                if (showVehicleSuggestions) {
                  setShowVehicleSuggestions(false);
                  setVehicleSearch("");
                } else {
                  setVehicleSearch("");
                  setShowVehicleSuggestions(true);
                }
              }}
              style={{
                position: "absolute",
                right: "8px",
                top: "7px",
                width: "32px",
                height: "32px",
                border: "none",
                borderRadius: "6px",
                background: "#374151",
                color: "#f9fafb",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
                padding: 0,
              }}
            >
              ▾
            </button>

            {showVehicleSuggestions && (
              <div
                style={{
                  marginTop: "4px",
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  maxHeight: "220px",
                  overflowY: "auto",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                  zIndex: 100,
                }}
              >
                {filteredVehicleOptions.length > 0 ? (
                  filteredVehicleOptions.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setVehicle(item.value);
                        setVehicleSearch(item.value);
                        setShowVehicleSuggestions(false);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        borderBottom: "1px solid #374151",
                        background: "transparent",
                        color: "#f9fafb",
                        padding: "10px 12px",
                        cursor: "pointer",
                      }}
                    >
                      {item.label}
                    </button>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "10px 12px",
                      color: "#9ca3af",
                      fontSize: "13px",
                    }}
                  >
                    No matching vehicle found. Use ＋ Or Add Custom Vehicle to create one.
                  </div>
                )}
              </div>
            )}
          </div>

          {editingId === null && (
            <button
              type="button"
              className="saveButton evtoolkitCustomFieldButton"
              onClick={() => setShowVehicleForm((current) => !current)}
              style={{
                padding: "0 14px",
                margin: 0,
                whiteSpace: "nowrap",
                flexShrink: 0,
                fontSize: "14px",
                height: "46px",
                position: "relative",
                top: "6px",
              }}
            >
              ＋ Or Add Custom Vehicle
            </button>
          )}
        </div>

        {showVehicleForm && editingId === null && (
          <div
            className="card"
            style={{
              marginTop: "12px",
              marginBottom: "4px",
            }}
          >
            <h4 style={{ marginTop: 0 }}>
              Add Custom Vehicle
            </h4>

            <label>Brand</label>
            <input
              type="text"
              placeholder="e.g. Tata"
              value={vehicleBrand}
              onChange={(e) => setVehicleBrand(e.target.value)}
            />

            <label>Model</label>
            <input
              type="text"
              placeholder="e.g. Nexon EV"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
            />

            <div
              className="buttonGroup"
              style={{ marginTop: "12px" }}
            >
              <button
                type="button"
                className="primaryButton"
                onClick={() => void handleAddVehicle()}
                disabled={savingVehicle}
              >
                {savingVehicle ? "Saving..." : "Save Vehicle"}
              </button>

              <button
                type="button"
                className="dangerButton"
                onClick={() => {
                  setShowVehicleForm(false);
                  setVehicleBrand("");
                  setVehicleModel("");
                }}
                disabled={savingVehicle}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {editingId !== null && (
          <p
            style={{
              marginTop: "6px",
              fontSize: "0.9rem",
              color: "#666",
            }}
          >
            Vehicle cannot be changed
            while editing a charging
            session.
          </p>
        )}


        <label>
          Charging Type
        </label>

        <select
          value={charger}
          onChange={(e) =>
            setCharger(
              e.target.value
            )
          }
          onBlur={
            handleAutosaveBlur
          }
        >
          <option>
            Home AC
          </option>

          <option>
            Public AC
          </option>

          <option>
            DC Fast
          </option>
        </select>


        <label>
          Energy Charged (kWh)
        </label>

        <input
          type="number"
          placeholder="Enter energy charged"
          value={energy}
          onChange={(e) =>
            setEnergy(
              e.target.value
            )
          }
          onBlur={
            handleAutosaveBlur
          }
        />


        <label>
          Charging Station
        </label>


        <div
          className="evtoolkitCustomFieldRow"
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "flex-start",
          }}
        >
          <div
            className="evtoolkitCustomFieldControl"
            ref={stationDropdownRef}
            style={{
              position: "relative",
              flex: 1,
              minWidth: 0,
            }}
          >
            <input
              type="text"
              placeholder="Type charging station to search..."
              value={
                showStationSuggestions
                  ? stationSearch
                  : station
              }
              onFocus={() => {
                setShowStationSuggestions(true);
                if (!stationSearch) {
                  setStationSearch("");
                }
              }}
              onChange={(e) => {
                setStationSearch(e.target.value);
                setShowStationSuggestions(true);
              }}
              onBlur={handleAutosaveBlur}
              style={{
                width: "100%",
                boxSizing: "border-box",
                paddingRight: "44px",
              }}
            />

            <button
              type="button"
              aria-label="Open charging station list"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (showStationSuggestions) {
                  setShowStationSuggestions(false);
                  setStationSearch("");
                } else {
                  setStationSearch("");
                  setShowStationSuggestions(true);
                }
              }}
              style={{
                position: "absolute",
                right: "8px",
                top: "7px",
                width: "32px",
                height: "32px",
                border: "none",
                borderRadius: "6px",
                background: "#374151",
                color: "#f9fafb",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
                padding: 0,
              }}
            >
              ▾
            </button>

            {showStationSuggestions && (
              <div
                style={{
                  marginTop: "4px",
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  maxHeight: "220px",
                  overflowY: "auto",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                  zIndex: 100,
                }}
              >
                {filteredStationOptions.length > 0 ? (
                  filteredStationOptions.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setStation(item.name);
                        setStationSearch(item.name);
                        setShowStationSuggestions(false);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        borderBottom: "1px solid #374151",
                        background: "transparent",
                        color: "#f9fafb",
                        padding: "10px 12px",
                        cursor: "pointer",
                      }}
                    >
                      {item.name}
                    </button>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "10px 12px",
                      color: "#9ca3af",
                      fontSize: "13px",
                    }}
                  >
                    No matching charging station found. Use ＋ Or Add Custom Station to create one.
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="saveButton evtoolkitCustomFieldButton"
            onClick={() => setShowAddStation(true)}
            style={{
              padding: "0 14px",
              margin: 0,
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontSize: "14px",
              height: "46px",
              position: "relative",
              top: "6px",
            }}
          >
            ＋ Or Add Custom Station
          </button>
        </div>

        {showAddStation && (
          <div
            className="card"
            style={{
              marginTop:
                "16px",
              marginBottom:
                "4px",
            }}
          >
            <h4
              style={{
                marginTop: 0,
              }}
            >
              Add Charging Station
            </h4>


            <label>
              Station Name
            </label>

            <input
              type="text"
              placeholder="e.g. ABC Charging Hub"
              value={
                newStationName
              }
              onChange={(e) =>
                setNewStationName(
                  e.target.value
                )
              }
            />


            <label>
              Category
            </label>

            <select
              value={
                newStationCategory
              }
              onChange={(e) =>
                setNewStationCategory(
                  e.target.value
                )
              }
            >
              <option>
                Home
              </option>

              <option>
                Public
              </option>

              <option>
                Office
              </option>

              <option>
                Fleet
              </option>

              <option>
                Highway
              </option>

              <option>
                Commercial
              </option>

              <option>
                OEM
              </option>

              <option>
                Utility
              </option>

              <option>
                Fuel Station
              </option>

              <option>
                Other
              </option>
            </select>


            <div
              className="buttonGroup"
              style={{
                marginTop:
                  "12px",
              }}
            >
              <button
                type="button"
                className="primaryButton"
                onClick={() =>
                  void handleAddStation()
                }
                disabled={
                  savingStation
                }
              >
                {savingStation
                  ? "Saving..."
                  : "Save Station"}
              </button>


              <button
                type="button"
                className="dangerButton"
                onClick={() => {
                  setShowAddStation(
                    false
                  );

                  setNewStationName("");

                  setNewStationCategory(
                    "Other"
                  );
                }}
                disabled={
                  savingStation
                }
              >
                Cancel
              </button>
            </div>
          </div>
        )}


        <label>
          Total Cost (₹)
        </label>

        <input
          type="number"
          value={cost}
          onChange={(e) =>
            setCost(
              e.target.value
            )
          }
          onBlur={
            handleAutosaveBlur
          }
        />


        <label>
          Date
        </label>

        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) =>
            setDate(
              e.target.value
            )
          }
          onBlur={
            handleAutosaveBlur
          }
        />


        <p
          style={{
            fontSize:
              "12px",
            color:
              "#6b7280",
            marginTop:
              "6px",
          }}
        >
          Charging date cannot be
          in the future.
        </p>


        <label>
          Invoice / Receipt
        </label>


        {canUseFileUploads(subscriptionPlan) ? (
          <>
            <div className="trackerFileUpload">
              <ReceiptUploader
                key={
                  invoiceResetKey
                }
                value={invoice}
                onChange={(value) =>
                  setInvoice(value)
                }
              />
            </div>

            <p
              style={{
                fontSize:
                  "12px",
                color:
                  "#6b7280",
                marginTop:
                  "6px",
              }}
            >
              Upload a PDF, image, or
              other document. Recommended
              maximum file size:
              <strong> 5 MB</strong>.
            </p>
          </>
        ) : (
          <div
            style={{
              padding: "12px 14px",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              background: "#eff6ff",
              color: "#1e40af",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            <strong>Premium Plus feature</strong>
            <br />
            File uploads are available only with Premium Plus.
            Premium Plus is coming soon.
          </div>
        )}


        <div className="buttonGroup">
          <button
            className="primaryButton"
            onClick={() =>
              void saveSession()
            }
          >
            {editingId !== null
              ? "💾 Update Session"
              : "💾 Save Session"}
          </button>


          <button
            className="dangerButton"
            onClick={() =>
              void resetForm()
            }
          >
            🔄 Reset Form
          </button>
        </div>


        {draftStatus !== "idle" && (
          <div
            style={{
              marginTop: "10px",
              textAlign: "right",
              fontSize: "13px",
              color:
                draftStatus === "error"
                  ? "#dc2626"
                  : "#6b7280",
            }}
          >
            {draftStatus === "saving" &&
              "Saving…"}

            {draftStatus === "saved" &&
              "✓ Saved"}

            {draftStatus === "error" &&
              "⚠ Draft save failed"}
          </div>
        )}
      </div>


      <div className="card">
        <h3>
          Recent Sessions
        </h3>


        {sessions.length ===
        0 ? (
          <p
            style={{
              marginTop: 15,
            }}
          >
            No charging sessions
            recorded.
          </p>
        ) : (
          <div className="tableContainer">
            <table className="table">

              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date</th>
                  <th>Vehicle</th>
                  <th>Station</th>
                  <th>Type</th>
                  <th>Energy</th>
                  <th>Cost</th>
                  <th>Invoice</th>
                  <th>Action</th>
                </tr>
              </thead>


              <tbody>
                {sessions.map(
                  (
                    session,
                    index
                  ) => {

                    /*
                     * Only the creator of the
                     * record gets Edit/Delete.
                     *
                     * Family members can still
                     * see records belonging to
                     * other family members.
                     */

                    const isOwner =
                      currentUserId !==
                        null &&
                      session.user_id ===
                        currentUserId;


                    return (
                      <tr
                        key={
                          session.id
                        }
                      >
                        <td>
                          {sessions.length -
                            index}
                        </td>


                        <td>
                          {
                            session.date
                          }
                        </td>


                        <td>
                          {
                            session.vehicle
                          }
                        </td>


                        <td>
                          {
                            session.station ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            session.charger
                          }
                        </td>


                        <td>
                          {
                            session.energy.toFixed(
                              1
                            )
                          }{" "}
                          kWh
                        </td>


                        <td>
                          ₹
                          {session.cost.toLocaleString()}
                        </td>


                        <td>
                          {session.invoice ? (
                            <a
                              href={
                                session.invoice
                              }
                              download={`Charging-${session.date}-Invoice`}
                              className="downloadButton"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              ⬇ Download
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>


                        <td>
                          {isOwner ? (
                            <div className="actionButtons">

                              <button
                                className="editButton"
                                onClick={() => {

                                  if (
                                    session.user_id !==
                                    currentUserId
                                  ) {
                                    alert(
                                      "You can only edit your own charging sessions."
                                    );

                                    return;
                                  }


                                  setEditingId(
                                    session.id
                                  );


                                  setVehicle(
                                    session.vehicle
                                  );


                                  setCharger(
                                    session.charger
                                  );


                                  setEnergy(
                                    session.energy.toString()
                                  );


                                  setCost(
                                    session.cost.toString()
                                  );


                                  setStation(
                                    session.station
                                  );


                                  setDate(
                                    session.date
                                  );


                                  setInvoice(
                                    session.invoice ||
                                      ""
                                  );


                                  window.scrollTo({
                                    top: 0,
                                    behavior:
                                      "smooth",
                                  });
                                }}
                              >
                                Edit
                              </button>


                              <button
                                className="deleteButton"
                                onClick={() => {

                                  if (
                                    session.user_id !==
                                    currentUserId
                                  ) {
                                    alert(
                                      "You can only delete your own charging sessions."
                                    );

                                    return;
                                  }


                                  void deleteSession(
                                    session.id
                                  );
                                }}
                              >
                                Delete
                              </button>

                            </div>
                          ) : (
                            <span
                              style={{
                                color:
                                  "#6b7280",
                                fontSize:
                                  "13px",
                              }}
                            >
                              View only
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </>
  );
}


export default Tracker;
