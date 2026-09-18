import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  InsuranceRecord,
} from "../types/insurance";

import {
  getInsurance,
  addInsurance,
  updateInsurance,
  deleteInsurance,
} from "../services/insuranceService";

import { getCurrentUserId } from "../services/authHelper";

import {
  getCurrentPlan,
  canAddInsurance,
  FREE_LIMITS,
} from "../services/subscriptionService";

import {
  getFormDraft,
  saveFormDraft,
  deleteFormDraft,
} from "../services/formDraftService";

import {
  getCustomVehicles,
  addCustomVehicle,
  type CustomVehicleRecord,
} from "../services/customVehicleService";

import { vehicles } from "../data/vehicles";

import ReceiptUploader from "../components/ReceiptUploader";
import UserDetails from "../components/UserDetails";


const emptyPolicy: InsuranceRecord = {
  id: 0,
  user_id: "",
  vehicle: "",
  company: "",
  policy_number: "",
  policy_type: "Comprehensive",
  start_date: "",
  expiry_date: "",
  premium: 0,
  idv: 0,
  addons: "",
  agent: "",
  contact_number: "",
  notes: "",
  attachment: "",
  attachment_name: "",
};


const emptyVehicleForm = {
  brand: "",
  model: "",
};


const INSURANCE_ADDONS = [
  // Core motor insurance add-ons
  "Zero Depreciation / Depreciation Reimbursement",
  "NCB Protection / NCB Protect",
  "Return to Invoice (RTI) / Invoice Protection",
  "Total Cover – Registration, Road Tax & Insurance",
  "Roadside Assistance (RSA) / Emergency Assistance",
  "Engine & Gearbox Protection / Engine Secure",
  "Consumables Expenses Cover",
  "Tyre Protector / Tyre Secure",
  "Rim Protector / Alloy Wheel Protection",
  "Key Protect / Key Replacement",
  "Loss of Personal Belongings",
  "Personal Belongings – Electronic Equipment",
  "Personal Belongings – Theft",
  "Personal Belongings – Damage",
  "Daily Allowance Benefit",
  "Daily Allowance Benefit Plus",
  "Downtime Protection / Loss of Use",
  "Garage Cash / Workshop Cash",
  "EMI Protection / EMI Protector",
  "Emergency Hotel Accommodation",
  "Emergency Transport Expenses",
  "Additional Towing Charges",
  "Outstation Emergency Cover",
  "Small Repair Claim",
  "Loss of Driving Licence / RC Cover",
  "Additional Limit of TPPD",
  "Voluntary Deductible Option",

  // Roadside / emergency assistance variants
  "24x7 Towing Assistance",
  "Fuel Delivery Assistance",
  "Flat Tyre Assistance",
  "Battery Jump-Start Assistance",
  "Lockout Assistance",
  "Lost Key Assistance",
  "Duplicate Key Assistance",
  "Minor On-Site Repair Assistance",
  "Alternate Travel / Taxi Assistance",

  // Glass, body and parts protection
  "Glass / Windshield Protection",
  "Repair of Glass, Fibre, Plastic & Rubber Parts",
  "Plastic & Fibre Parts Protection",
  "Electrical / Electronic Accessories Cover",
  "Non-Electrical Accessories Cover",
  "CNG / LPG Kit Cover",
  "Trailer / Side-Car Cover",
  "Vehicle Accessories Protection",
  "Car Accessories Protection",

  // Finance / vehicle value protection
  "Road Tax & Registration Charges Cover",
  "Registration Charges Protection",
  "New Vehicle Replacement Cover",
  "Vehicle Replacement / Car Replacement Cover",
  "Loan / Finance Gap Protection",
  "Invoice Price / On-Road Price Protection",

  // Driver / passenger / legal protection
  "Personal Accident Cover – Owner Driver",
  "Personal Accident Cover – Unnamed Passengers",
  "Hospital Cash Cover",
  "Medical Expenses Cover",
  "Legal Liability to Paid Driver",
  "Legal Liability to Employees",
  "Additional Third-Party Property Damage (TPPD)",
  "Geographical Extension Cover",

  // Usage / telematics based covers
  "Pay As You Drive / Limit Sure",
  "Pay How You Drive / Telematics",
  "Limited Kilometre / Usage-Based Cover",

  // EV-specific protection
  "Electric Motor Protection",
  "Electric Vehicle Battery Protection",
  "Electric Vehicle Protect Cover",
  "Zero Depreciation – Battery (Hybrid / EV)",
  "EV Battery Management System (BMS) Protection",
  "Electric Vehicle Charger Cover",
  "Battery Charger & Accessories Cover",
  "Home EV Charger & Charging Accessories Cover",
  "EV Charger Zero Depreciation",
  "Zero Depreciation for Battery & Charger",
  "Electric Surge Secure",
  "EV Electrical / Electronic Components Protection",
  "EV Battery Water Ingress Protection",
  "EV Battery Mechanical Shock Protection",
  "EV Battery Uncontrolled Electrochemical Reaction Protection",
  "EV Emergency Charging / Mobile Charging Assistance",
  "EV Battery Breakdown Towing Assistance",
  "EV Roadside Charging Assistance",

  // Common specialised variants
  "Hydrostatic Lock / Water Ingress Protection",
  "Engine Hydrostatic Lock Cover",
  "Consumable Fluids & Lubricants Cover",
  "Tyre & Rim Protection Bundle",
  "Key & Lock Replacement",
  "Personal Effects & Baggage Cover",
  "Child Seat / Baby Seat Protection",
  "Vehicle Consumables & Small Parts Cover",
  "Carrying Capacity / Passenger Extension",
  "Other / Custom Add-on",
];


interface InsuranceProps {
  onNavigate?: (page: string) => void;
}

export default function Insurance({
  onNavigate,
}: InsuranceProps) {
  const [records, setRecords] =
    useState<InsuranceRecord[]>([]);

  const [
    currentUserId,
    setCurrentUserId,
  ] = useState<string | null>(null);

  const [form, setForm] =
    useState<InsuranceRecord>(
      emptyPolicy
    );

  const [
    editingId,
    setEditingId,
  ] = useState<number | null>(null);

  const [search, setSearch] =
    useState("");

  const [selectedAddon, setSelectedAddon] =
    useState("");

  /*
   * =========================================================
   * CUSTOM VEHICLES
   * =========================================================
   */

  const [
    customVehicles,
    setCustomVehicles,
  ] = useState<CustomVehicleRecord[]>([]);

  const [
    showAddVehicle,
    setShowAddVehicle,
  ] = useState(false);

  const [
    newVehicle,
    setNewVehicle,
  ] = useState(
    emptyVehicleForm
  );

  const [
    addingVehicle,
    setAddingVehicle,
  ] = useState(false);

  /*
   * =========================================================
   * AUTOSAVE
   * =========================================================
   */

  const [draftStatus, setDraftStatus] =
    useState<"idle" | "loading" | "saving" | "saved" | "error">("idle");

  const autosaveTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const skipAutosaveRef =
    useRef(true);

  const draftLoadedRef =
    useRef(false);

  const getDraftKey = () =>
    editingId !== null
      ? `insurance:${editingId}`
      : "insurance:new";

  /*
   * =========================================================
   * DATE
   * =========================================================
   */

  function getTodayLocalDate() {
    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  const today =
    getTodayLocalDate();


  /*
   * =========================================================
   * LOAD USER + POLICIES + CUSTOM VEHICLES
   * =========================================================
   */

  useEffect(() => {
    async function initialize() {
      try {
        const userId =
          await getCurrentUserId();

        setCurrentUserId(
          userId
        );

        await Promise.all([
          loadPolicies(),
          loadCustomVehicles(),
        ]);

        await restoreDraft("insurance:new");

      } catch (err) {
        console.error(
          "Failed to initialize insurance:",
          err
        );

        alert(
          "Failed to initialize insurance."
        );
      }
    }

    void initialize();
  }, []);

  async function restoreDraft(draftKey: string) {
    try {
      setDraftStatus("loading");
      skipAutosaveRef.current = true;
      draftLoadedRef.current = false;

      const draft =
        await getFormDraft<InsuranceRecord>(draftKey);

      if (draft?.draft_data) {
        setForm((current) => ({
          ...current,
          ...draft.draft_data,
        }));
        setDraftStatus("saved");
      } else {
        setDraftStatus("idle");
      }
    } catch (err) {
      console.error(
        "Failed to restore insurance draft:",
        err
      );
      setDraftStatus("error");
    } finally {
      draftLoadedRef.current = true;

      window.setTimeout(() => {
        skipAutosaveRef.current = false;
      }, 0);
    }
  }

  /*
   * Autosave the current form after one second of inactivity.
   * The actual attachment data is intentionally excluded from
   * drafts because receipts can be large. The filename is kept.
   */
  useEffect(() => {
    if (!draftLoadedRef.current || skipAutosaveRef.current) {
      return;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setDraftStatus("saving");

    autosaveTimerRef.current = setTimeout(() => {
      const draftData: InsuranceRecord = {
        ...form,
        attachment: "",
      };

      void saveFormDraft(
        getDraftKey(),
        draftData
      )
        .then(() => {
          setDraftStatus("saved");
        })
        .catch((err) => {
          console.error(
            "Failed to autosave insurance draft:",
            err
          );
          setDraftStatus("error");
        });
    }, 1000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [form, editingId]);

  /*
   * Restore the draft belonging to the record being edited.
   */
  useEffect(() => {
    if (editingId === null) {
      return;
    }

    void restoreDraft(`insurance:${editingId}`);
  }, [editingId]);


  async function loadPolicies() {
    try {
      const data =
        await getInsurance();

      setRecords(data);

    } catch (err) {
      console.error(err);

      alert(
        "Failed to load insurance policies."
      );
    }
  }


  async function loadCustomVehicles() {
    try {
      const data =
        await getCustomVehicles();

      setCustomVehicles(
        data
      );

    } catch (err) {
      console.error(
        "Failed to load custom vehicles:",
        err
      );

      alert(
        "Failed to load custom vehicles."
      );
    }
  }


  /*
   * =========================================================
   * VEHICLE LIST
   * =========================================================
   */

  const vehicleOptions = useMemo(() => {
    const builtIn = vehicles.map(
      (vehicle) => ({
        key: `${vehicle.country}-${vehicle.id}`,
        value: `${vehicle.brand} ${vehicle.model}`,
        label: `${vehicle.brand} ${vehicle.model}`,
      })
    );

    const custom = customVehicles.map(
      (vehicle) => ({
        key: `custom-${vehicle.id}`,
        value: `${vehicle.brand} ${vehicle.model}`,
        label: `${vehicle.brand} ${vehicle.model} (Custom)`,
      })
    );

    return [
      ...builtIn,
      ...custom,
    ];
  }, [customVehicles]);


  /*
   * =========================================================
   * ADD CUSTOM VEHICLE
   * =========================================================
   */

  async function handleAddVehicle() {
    const brand =
      newVehicle.brand.trim();

    const model =
      newVehicle.model.trim();

    if (!brand || !model) {
      alert(
        "Please enter both vehicle brand and model."
      );

      return;
    }

    const duplicate =
      vehicleOptions.some(
        (vehicle) =>
          vehicle.value
            .trim()
            .toLowerCase() ===
          `${brand} ${model}`
            .trim()
            .toLowerCase()
      );

    if (duplicate) {
      alert(
        "This vehicle already exists."
      );

      return;
    }

    try {
      setAddingVehicle(true);

      const created =
        await addCustomVehicle({
          brand,
          model,
        });

      setCustomVehicles(
        (current) => [
          ...current,
          created,
        ]
      );

      const vehicleName =
        `${created.brand} ${created.model}`;

      setForm(
        (current) => ({
          ...current,
          vehicle:
            vehicleName,
        })
      );

      setNewVehicle(
        emptyVehicleForm
      );

      setShowAddVehicle(
        false
      );

      alert(
        "Vehicle added successfully."
      );

    } catch (err: any) {
      console.error(
        "Failed to add custom vehicle:",
        err
      );

      alert(
        err?.message ||
          "Failed to add vehicle."
      );

    } finally {
      setAddingVehicle(
        false
      );
    }
  }


  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const filtered =
    useMemo(() => {
      const text =
        search.toLowerCase();

      return records.filter(
        (r) =>
          r.vehicle
            .toLowerCase()
            .includes(text) ||

          r.company
            .toLowerCase()
            .includes(text) ||

          r.policy_number
            .toLowerCase()
            .includes(text) ||

          r.policy_type
            .toLowerCase()
            .includes(text) ||

          (r.notes ?? "")
            .toLowerCase()
            .includes(text)
      );
    }, [
      records,
      search,
    ]);


  /*
   * =========================================================
   * KPI
   * =========================================================
   */

  const totalPremium =
    filtered.reduce(
      (sum, r) =>
        sum +
        Number(
          r.premium ?? 0
        ),
      0
    );


  const activePolicies =
    filtered.filter(
      (r) =>
        new Date(
          r.expiry_date
        ) >= new Date()
    ).length;


  /*
   * =========================================================
   * STATUS
   * =========================================================
   */

  function getStatus(
    expiry: string
  ) {
    const todayDate =
      new Date();

    const expiryDate =
      new Date(expiry);

    const diff =
      Math.ceil(
        (
          expiryDate.getTime() -
          todayDate.getTime()
        ) /
          (
            1000 *
            60 *
            60 *
            24
          )
      );

    if (diff < 0) {
      return {
        text: "Expired",
        color: "#dc2626",
      };
    }

    if (diff <= 30) {
      return {
        text: "Expiring Soon",
        color: "#d97706",
      };
    }

    return {
      text: "Active",
      color: "#16a34a",
    };
  }


  /*
   * =========================================================
   * EDIT
   * =========================================================
   */

  function handleEdit(
    record: InsuranceRecord
  ) {
    if (
      record.user_id !==
      currentUserId
    ) {
      alert(
        "You can only edit your own insurance policies."
      );

      return;
    }

    skipAutosaveRef.current = true;
    draftLoadedRef.current = false;

    setEditingId(
      record.id
    );

    setForm(
      record
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  async function handleDelete(
    record: InsuranceRecord
  ) {
    if (
      record.user_id !==
      currentUserId
    ) {
      alert(
        "You can only delete your own insurance policies."
      );

      return;
    }

    if (
      !window.confirm(
        "Delete this insurance policy?"
      )
    ) {
      return;
    }

    try {
      await deleteInsurance(
        record.id
      );

      await loadPolicies();

      alert(
        "Insurance policy deleted successfully."
      );

    } catch (err) {
      console.error(err);

      alert(
        "Failed to delete insurance policy."
      );
    }
  }


  /*
   * =========================================================
   * ADD-ONS
   * =========================================================
   */

  function getSelectedAddons(): string[] {
    return form.addons
      .split(",")
      .map((addon) => addon.trim())
      .filter(Boolean);
  }


  function addAddon() {
    const addon = selectedAddon.trim();

    if (!addon) {
      return;
    }

    const current = getSelectedAddons();

    if (current.some((item) => item.toLowerCase() === addon.toLowerCase())) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      addons: [...current, addon].join(", "),
    }));

    setSelectedAddon("");
  }


  function removeAddon(addonToRemove: string) {
    const updated = getSelectedAddons().filter(
      (addon) => addon.toLowerCase() !== addonToRemove.toLowerCase()
    );

    setForm((previous) => ({
      ...previous,
      addons: updated.join(", "),
    }));
  }


  function handleReset() {
    if (!window.confirm("Are you sure you want to reset the values you have entered? This will clear the current form.")) {
      return;
    }

    const draftKey =
      editingId !== null
        ? `insurance:${editingId}`
        : "insurance:new";

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    skipAutosaveRef.current = true;
    draftLoadedRef.current = false;

    void deleteFormDraft(draftKey).catch((err) => {
      console.error(
        "Failed to delete insurance draft:",
        err
      );
    });

    setEditingId(null);
    setForm({ ...emptyPolicy });
    setSelectedAddon("");
    setShowAddVehicle(false);
    setNewVehicle({ ...emptyVehicleForm });
    setDraftStatus("idle");

    window.setTimeout(() => {
      draftLoadedRef.current = true;
      skipAutosaveRef.current = false;
    }, 0);
  }


  /*
   * =========================================================
   * AUTOSAVE ON BLUR
   * =========================================================
   */

  function handleAutosaveBlur() {
    if (
      !draftLoadedRef.current ||
      skipAutosaveRef.current
    ) {
      return;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    const draftData: InsuranceRecord = {
      ...form,
      attachment: "",
    };

    setDraftStatus("saving");

    void saveFormDraft(
      getDraftKey(),
      draftData
    )
      .then(() => {
        setDraftStatus("saved");
      })
      .catch((err) => {
        console.error(
          "Failed to autosave insurance draft:",
          err
        );
        setDraftStatus("error");
      });
  }


  /*
   * =========================================================
   * SAVE / UPDATE
   * =========================================================
   */

  async function handleSave() {
    if (
      !form.vehicle ||
      !form.company ||
      !form.policy_number ||
      !form.start_date ||
      !form.expiry_date
    ) {
      alert(
        "Please complete all required fields."
      );

      return;
    }

    if (
      form.start_date >
      today
    ) {
      alert(
        "Policy start date cannot be in the future."
      );

      return;
    }

    if (
      form.expiry_date <
      form.start_date
    ) {
      alert(
        "Policy expiry date cannot be before the policy start date."
      );

      return;
    }

    try {
      if (
        editingId !== null
      ) {
        if (
          form.user_id !==
          currentUserId
        ) {
          alert(
            "You can only update your own insurance policies."
          );

          return;
        }

        await updateInsurance(
          editingId,
          form
        );

        alert(
          "Insurance policy updated successfully."
        );

      } else {
        const plan = await getCurrentPlan();

        const ownInsuranceCount =
          currentUserId === null
            ? records.length
            : records.filter(
                (record) =>
                  record.user_id === currentUserId
              ).length;

        if (
          !canAddInsurance(
            ownInsuranceCount,
            plan
          )
        ) {
          alert(
            `The Free plan is limited to ${FREE_LIMITS.insurance} insurance policy. Upgrade to Premium for ₹49 one-time to add more insurance policies.`
          );

          return;
        }

        const {
          id,
          user_id,
          ...newPolicy
        } = form;

        await addInsurance(
          newPolicy as Omit<
            InsuranceRecord,
            "id" | "user_id"
          >
        );

        alert(
          "Insurance policy added successfully."
        );
      }

      const savedDraftKey =
        editingId !== null
          ? `insurance:${editingId}`
          : "insurance:new";

      await deleteFormDraft(
        savedDraftKey
      );

      skipAutosaveRef.current = true;
      draftLoadedRef.current = false;

      await loadPolicies();

      setEditingId(
        null
      );

      setForm(
        emptyPolicy
      );

      setSelectedAddon("");

      setDraftStatus("idle");

      window.setTimeout(() => {
        draftLoadedRef.current = true;
        skipAutosaveRef.current = false;
      }, 0);

    } catch (err) {
      console.error(err);

      alert(
        "Failed to save insurance policy."
      );
    }
  }


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
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
          🛡 Insurance
        </h2>

        <p>
          Manage insurance policies,
          renewals and policy
          documents.
        </p>
      </div>


      {/* =====================================================
          FORM
          ===================================================== */}

      <div className="card">

        <h3>
          {editingId !== null
            ? "Edit Insurance Policy"
            : "Add Insurance Policy"}
        </h3>


        <div className="formGrid">

          {/* =================================================
              VEHICLE
              ================================================= */}

          <div>
            <label>
              Vehicle
            </label>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >

              <select
                value={
                  form.vehicle
                }
                onBlur={handleAutosaveBlur}
                onChange={(e) =>
                  setForm({
                    ...form,
                    vehicle:
                      e.target.value,
                  })
                }
                disabled={
                  editingId !== null
                }
                style={{
                  flex: 1,
                }}
              >

                <option value="">
                  Select Vehicle
                </option>

                {vehicleOptions.map(
                  (vehicle) => (
                    <option
                      key={
                        vehicle.key
                      }
                      value={
                        vehicle.value
                      }
                    >
                      {
                        vehicle.label
                      }
                    </option>
                  )
                )}

              </select>

              {editingId === null && (
                <button
                  type="button"
                  className="saveButton"
                  onClick={() =>
                    setShowAddVehicle(
                      (current) =>
                        !current
                    )
                  }
                  style={{
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  ＋ Add Vehicle
                </button>
              )}

            </div>


            {/* ===============================================
                ADD VEHICLE FORM
                =============================================== */}

            {showAddVehicle &&
              editingId === null && (

                <div
                  style={{
                    marginTop:
                      "12px",
                    padding:
                      "14px",
                    border:
                      "1px solid #e5e7eb",
                    borderRadius:
                      "8px",
                    background:
                      "#f8fafc",
                  }}
                >

                  <strong>
                    Add Custom Vehicle
                  </strong>

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap:
                        "10px",
                      marginTop:
                        "12px",
                    }}
                  >

                    <div>
                      <label>
                        Brand
                      </label>

                      <input
                        type="text"
                        value={
                          newVehicle.brand
                        }
                        placeholder="Tata"
                        disabled={
                          addingVehicle
                        }
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            brand:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>


                    <div>
                      <label>
                        Model
                      </label>

                      <input
                        type="text"
                        value={
                          newVehicle.model
                        }
                        placeholder="Curvv EV"
                        disabled={
                          addingVehicle
                        }
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            model:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>

                  </div>


                  <div
                    style={{
                      display:
                        "flex",
                      gap:
                        "8px",
                      marginTop:
                        "12px",
                    }}
                  >

                    <button
                      type="button"
                      className="saveButton"
                      disabled={
                        addingVehicle
                      }
                      onClick={() =>
                        void handleAddVehicle()
                      }
                    >
                      {addingVehicle
                        ? "Saving..."
                        : "Save Vehicle"}
                    </button>


                    <button
                      type="button"
                      className="restoreButton"
                      disabled={
                        addingVehicle
                      }
                      onClick={() => {
                        setShowAddVehicle(
                          false
                        );

                        setNewVehicle(
                          emptyVehicleForm
                        );
                      }}
                    >
                      Cancel
                    </button>

                  </div>

                </div>
              )}

          </div>


          <div>
            <label>
              Insurance Company
            </label>

            <input
              type="text"
              value={
                form.company
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  company:
                    e.target.value,
                })
              }
              placeholder="ICICI Lombard"
            />
          </div>


          <div>
            <label>
              Policy Number
            </label>

            <input
              type="text"
              value={
                form.policy_number
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  policy_number:
                    e.target.value,
                })
              }
              placeholder="Policy Number"
            />
          </div>


          <div>
            <label>
              Policy Type
            </label>

            <select
              value={
                form.policy_type
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  policy_type:
                    e.target.value,
                })
              }
            >
              <option>
                Comprehensive
              </option>

              <option>
                Third Party
              </option>

              <option>
                Own Damage
              </option>

              <option>
                Zero Depreciation
              </option>
            </select>
          </div>


          <div>
            <label>
              Policy Start Date
            </label>

            <input
              type="date"
              value={
                form.start_date
              }
              max={today}
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  start_date:
                    e.target.value,
                })
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
              Policy start date
              cannot be in the
              future.
            </p>
          </div>


          <div>
            <label>
              Policy Expiry Date
            </label>

            <input
              type="date"
              value={
                form.expiry_date
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  expiry_date:
                    e.target.value,
                })
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
              Future expiry dates
              are allowed.
            </p>
          </div>


          <div>
            <label>
              Premium (₹)
            </label>

            <input
              type="number"
              value={
                form.premium === 0 ? "" : form.premium
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  premium:
                    Number(
                      e.target.value
                    ),
                })
              }
            />
          </div>


          <div>
            <label>
              IDV (₹)
            </label>

            <input
              type="number"
              value={
                form.idv === 0 ? "" : form.idv
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  idv:
                    Number(
                      e.target.value
                    ),
                })
              }
            />
          </div>


          <div>
            <label>
              Add-ons
            </label>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <select
                value={selectedAddon}
                onChange={(e) =>
                  setSelectedAddon(e.target.value)
                }
                style={{
                  flex: 1,
                }}
              >
                <option value="">
                  Select an add-on
                </option>

                {INSURANCE_ADDONS.map((addon) => (
                  <option
                    key={addon}
                    value={addon}
                  >
                    {addon}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="saveButton"
                onClick={addAddon}
                disabled={!selectedAddon.trim()}
              >
                ＋ Add
              </button>
            </div>

            {getSelectedAddons().length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                {getSelectedAddons().map((addon) => (
                  <span
                    key={addon}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 10px",
                      borderRadius: "16px",
                      background: "#2563eb",
                      border: "1px solid #60a5fa",
                      color: "#ffffff",
                      fontSize: "13px",
                    }}
                  >
                    {addon}
                    <button
                      type="button"
                      onClick={() => removeAddon(addon)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: 700,
                        color: "#dbeafe",
                        padding: 0,
                      }}
                      aria-label={`Remove ${addon}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>


          <div>
            <label>
              Agent / Broker
            </label>

            <input
              type="text"
              value={
                form.agent
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  agent:
                    e.target.value.replace(
                      /[^A-Za-z\s.'-]/g,
                      ""
                    ),
                })
              }
              placeholder="Agent Name"
              inputMode="text"
              autoComplete="name"
            />
          </div>


          <div>
            <label>
              Contact Number
            </label>

            <input
              type="tel"
              value={
                form.contact_number
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_number:
                    e.target.value.replace(
                      /\D/g,
                      ""
                    ),
                })
              }
              placeholder="9876543210"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={15}
            />
          </div>

        </div>


        <label>
          Notes
        </label>

        <textarea
          rows={3}
          value={
            form.notes
          }
          onBlur={handleAutosaveBlur}
          onChange={(e) =>
            setForm({
              ...form,
              notes:
                e.target.value,
            })
          }
        />


        <br />


        <label>
          Policy Document
        </label>

        <ReceiptUploader
          value={form.attachment}
          fileName={form.attachment_name}
          onChange={(attachment) => {
            setForm({
              ...form,
              attachment,
            });
            handleAutosaveBlur();
          }}
          onFileNameChange={(attachment_name) => {
            setForm({
              ...form,
              attachment_name,
            });
            handleAutosaveBlur();
          }}
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
          Upload your insurance
          policy (PDF or image).
          Recommended maximum
          file size:
          <strong>
            {" "}
            5 MB
          </strong>
          .
        </p>


        <br />


        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "4px",
          }}
        >
          <button
            className="saveButton"
            onClick={() =>
              void handleSave()
            }
          >
            {editingId !== null
              ? "Update Policy"
              : "Add Insurance Policy"}
          </button>

          {draftStatus === "loading" && (
            <span
              style={{
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Loading draft...
            </span>
          )}

          {draftStatus === "saving" && (
            <span
              style={{
                fontSize: "13px",
                color: "#d97706",
              }}
            >
              Saving...
            </span>
          )}

          {draftStatus === "saved" && (
            <span
              style={{
                fontSize: "13px",
                color: "#16a34a",
                fontWeight: 600,
              }}
            >
              ✓ Saved
            </span>
          )}

          {draftStatus === "error" && (
            <span
              style={{
                fontSize: "13px",
                color: "#dc2626",
              }}
            >
              Draft save failed
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            style={{
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "10px 18px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reset
          </button>
        </div>

      </div>


      {/* =====================================================
          KPIs
          ===================================================== */}

      <div className="kpiGrid">

        <div className="kpiCard">
          <h3>
            Total Policies
          </h3>

          <h2>
            {
              filtered.length
            }
          </h2>
        </div>


        <div className="kpiCard">
          <h3>
            Active Policies
          </h3>

          <h2>
            {
              activePolicies
            }
          </h2>
        </div>


        <div className="kpiCard">
          <h3>
            Total Premium
          </h3>

          <h2>
            ₹{" "}
            {totalPremium.toLocaleString(
              "en-IN"
            )}
          </h2>
        </div>

      </div>


      {/* =====================================================
          POLICY TABLE
          ===================================================== */}

      <div className="card">

        <input
          type="text"
          placeholder="Search by company, vehicle or policy number..."
          value={
            search
          }
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />


        <div className="tableContainer">

          <table className="table">

            <thead>
              <tr>
                <th>#</th>
                <th>Vehicle</th>
                <th>Company</th>
                <th>Policy No.</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Premium</th>
                <th>Document</th>
                <th>Actions</th>
              </tr>
            </thead>


            <tbody>

              {filtered.length ===
              0 ? (

                <tr>
                  <td colSpan={10}>
                    No insurance
                    policies found.
                  </td>
                </tr>

              ) : (

                filtered.map(
                  (
                    record,
                    index
                  ) => {

                    const status =
                      getStatus(
                        record.expiry_date
                      );

                    const isOwner =
                      currentUserId !==
                        null &&
                      record.user_id ===
                        currentUserId;

                    return (
                      <tr
                        key={
                          record.id
                        }
                      >

                        <td>
                          {
                            index + 1
                          }
                        </td>

                        <td>
                          {
                            record.vehicle
                          }
                        </td>

                        <td>
                          {
                            record.company
                          }
                        </td>

                        <td>
                          {
                            record.policy_number
                          }
                        </td>

                        <td>
                          {
                            record.expiry_date
                          }
                        </td>

                        <td>

                          <span
                            style={{
                              color:
                                status.color,
                              fontWeight:
                                600,
                            }}
                          >
                            {
                              status.text
                            }
                          </span>

                        </td>

                        <td>
                          ₹{" "}
                          {Number(
                            record.premium ??
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          {record.addons?.trim() || "-"}
                        </td>

                        <td>

                          {record.attachment ? (

                            <>

                            <a
                              href={
                                record.attachment
                              }
                              download={record.attachment_name || `${record.company}-Insurance`}
                              className="downloadButton"
                            >
                              ⬇ Download
                            </a>

                            {record.attachment_name && (
                              <div
                                style={{
                                  marginTop: "5px",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  wordBreak: "break-word",
                                }}
                              >
                                📎 {record.attachment_name}
                              </div>
                            )}

                            </>

                          ) : (
                            "-"
                          )}

                        </td>

                        <td>

                          {isOwner ? (

                            <div className="actionButtons">

                              <button
                                className="editButton"
                                onClick={() =>
                                  handleEdit(
                                    record
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="deleteButton"
                                onClick={() =>
                                  void handleDelete(
                                    record
                                  )
                                }
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
                )

              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}