import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ServiceRecord,
} from "../types/service";

import {
  getServiceRecords,
  addServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
} from "../services/serviceHistoryService";

import { getCurrentUserId } from "../services/authHelper";

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

import {
  getServiceTypes,
  addServiceType,
  type ServiceTypeRecord,
} from "../services/serviceTypeService";

import { vehicles } from "../data/vehicles";

import ReceiptUploader from "../components/ReceiptUploader";
import UserDetails from "../components/UserDetails";


const emptyRecord: ServiceRecord = {
  id: 0,
  user_id: "",
  vehicle: "",
  date: "",
  odometer: 0,
  serviceType: "",
  serviceCenter: "",
  amount: 0,
  notes: "",
  attachment: "",
  attachment_name: "",
};


const builtInServiceTypes = [
  "Regular Service",
  "Battery Check",
  "Brake Service",
  "Coolant Change",
  "Software Update",
  "Tyre Rotation",
  "Wheel Alignment",
  "General Inspection",
  "Other",
];


interface ServiceHistoryProps {
  onNavigate?: (page: string) => void;
}

export default function ServiceHistory({
  onNavigate,
}: ServiceHistoryProps) {
  const [records, setRecords] =
    useState<ServiceRecord[]>([]);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<ServiceRecord>(
      emptyRecord
    );

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);


  /* ============================================================
     CUSTOM VEHICLES
     ============================================================ */

  const [customVehicles, setCustomVehicles] =
    useState<CustomVehicleRecord[]>([]);

  const [showVehicleForm, setShowVehicleForm] =
    useState(false);

  const [vehicleBrand, setVehicleBrand] =
    useState("");

  const [vehicleModel, setVehicleModel] =
    useState("");

  const [savingVehicle, setSavingVehicle] =
    useState(false);


  /* ============================================================
     CUSTOM SERVICE TYPES
     ============================================================ */

  const [customServiceTypes, setCustomServiceTypes] =
    useState<ServiceTypeRecord[]>([]);

  const [showServiceTypeForm, setShowServiceTypeForm] =
    useState(false);

  const [serviceTypeName, setServiceTypeName] =
    useState("");

  const [savingServiceType, setSavingServiceType] =
    useState(false);


  /* ============================================================
     AUTOSAVE
     ============================================================ */

  const [draftStatus, setDraftStatus] =
    useState<"idle" | "loading" | "saving" | "saved" | "error">("idle");

  const autosaveTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const draftReadyRef = useRef(false);
  const skipAutosaveRef = useRef(true);

  const getDraftKey = () =>
    editingId !== null
      ? `service-history:${editingId}`
      : "service-history:new";


  /* ============================================================
     DATE
     ============================================================ */

  function getTodayLocalDate() {
    const today =
      new Date();

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


  /* ============================================================
     LOAD DATA
     ============================================================ */

  async function initialize() {
    try {
      const userId =
        await getCurrentUserId();

      setCurrentUserId(
        userId
      );

      await Promise.all([
        loadRecords(),
        loadCustomVehicles(),
        loadCustomServiceTypes(),
      ]);

      await restoreDraft("service-history:new");

    } catch (err: any) {
      console.error(
        "Failed to initialize service history:",
        err
      );

      alert(
        err?.message ||
          "Failed to initialize Service History."
      );
    }
  }


  async function loadRecords() {
    try {
      const data =
        await getServiceRecords();

      setRecords(
        data
      );

    } catch (err: any) {
      console.error(
        "Failed to load service history:",
        err
      );

      setRecords([]);

      alert(
        JSON.stringify(
          {
            message:
              err?.message,
            details:
              err?.details,
            hint:
              err?.hint,
            code:
              err?.code,
          },
          null,
          2
        )
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


  async function loadCustomServiceTypes() {
    try {
      const data =
        await getServiceTypes();

      setCustomServiceTypes(
        data
      );

    } catch (err) {
      console.error(
        "Failed to load custom service types:",
        err
      );

      alert(
        "Failed to load custom service types."
      );
    }
  }


  useEffect(() => {
    void initialize();
  }, []);


  async function restoreDraft(draftKey: string) {
    try {
      setDraftStatus("loading");
      draftReadyRef.current = false;
      skipAutosaveRef.current = true;

      const draft = await getFormDraft<ServiceRecord>(draftKey);

      if (draft?.draft_data) {
        setForm((current) => ({
          ...current,
          ...draft.draft_data,
          attachment: "",
        }));
        setDraftStatus("saved");
      } else {
        setDraftStatus("idle");
      }
    } catch (error) {
      console.error("Failed to restore service history draft:", error);
      setDraftStatus("error");
    } finally {
      draftReadyRef.current = true;
      window.setTimeout(() => { skipAutosaveRef.current = false; }, 0);
    }
  }

  useEffect(() => {
    if (!draftReadyRef.current || skipAutosaveRef.current) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setDraftStatus("saving");
    autosaveTimerRef.current = setTimeout(() => {
      void saveFormDraft(getDraftKey(), { ...form, attachment: "" })
        .then(() => setDraftStatus("saved"))
        .catch((error) => {
          console.error("Failed to autosave service history draft:", error);
          setDraftStatus("error");
        });
    }, 1000);
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [form, editingId]);

  useEffect(() => {
    if (editingId !== null) void restoreDraft(`service-history:${editingId}`);
  }, [editingId]);

  function handleAutosaveBlur() {
    if (!draftReadyRef.current || skipAutosaveRef.current) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setDraftStatus("saving");
    void saveFormDraft(getDraftKey(), { ...form, attachment: "" })
      .then(() => setDraftStatus("saved"))
      .catch((error) => {
        console.error("Failed to autosave service history draft:", error);
        setDraftStatus("error");
      });
  }


  /* ============================================================
     VEHICLE LIST
     ============================================================ */

  const allVehicles =
    useMemo(() => {
      const builtInVehicles =
        vehicles.map(
          (vehicle) => ({
            value:
              `${vehicle.brand} ${vehicle.model}`,
            label:
              `${vehicle.brand} ${vehicle.model}`,
          })
        );

      const custom =
        customVehicles.map(
          (vehicle) => ({
            value:
              `${vehicle.brand} ${vehicle.model}`,
            label:
              `${vehicle.brand} ${vehicle.model}`,
          })
        );

      const combined = [
        ...builtInVehicles,
        ...custom,
      ];

      const seen =
        new Set<string>();

      return combined.filter(
        (vehicle) => {
          const key =
            vehicle.value
              .trim()
              .toLowerCase();

          if (seen.has(key)) {
            return false;
          }

          seen.add(key);

          return true;
        }
      );
    }, [
      customVehicles,
    ]);


  /* ============================================================
     SERVICE TYPE LIST
     ============================================================ */

  const allServiceTypes =
    useMemo(() => {
      const combined = [
        ...builtInServiceTypes,
        ...customServiceTypes.map(
          (serviceType) =>
            serviceType.name
        ),
      ];

      const seen =
        new Set<string>();

      return combined.filter(
        (serviceType) => {
          const key =
            serviceType
              .trim()
              .toLowerCase();

          if (seen.has(key)) {
            return false;
          }

          seen.add(key);

          return true;
        }
      );
    }, [
      customServiceTypes,
    ]);


  /* ============================================================
     ADD CUSTOM VEHICLE
     ============================================================ */

  async function handleAddVehicle() {
    const brand =
      vehicleBrand.trim();

    const model =
      vehicleModel.trim();

    if (!brand || !model) {
      alert(
        "Please enter the vehicle brand and model."
      );

      return;
    }

    const vehicleName =
      `${brand} ${model}`;


    const duplicate =
      allVehicles.some(
        (vehicle) =>
          vehicle.value
            .trim()
            .toLowerCase() ===
          vehicleName
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
      setSavingVehicle(
        true
      );

      const created =
        await addCustomVehicle({
          brand,
          model,
        });


      setCustomVehicles(
        (previous) => [
          ...previous,
          created,
        ]
      );


      const createdVehicle =
        `${created.brand} ${created.model}`;


      setForm(
        (previous) => ({
          ...previous,
          vehicle:
            createdVehicle,
        })
      );


      setVehicleBrand(
        ""
      );

      setVehicleModel(
        ""
      );

      setShowVehicleForm(
        false
      );


      alert(
        "Vehicle added successfully."
      );

    } catch (error) {
      console.error(
        "Failed to add vehicle:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add vehicle."
      );

    } finally {
      setSavingVehicle(
        false
      );
    }
  }


  /* ============================================================
     ADD CUSTOM SERVICE TYPE
     ============================================================ */

  async function handleAddServiceType() {
    const name =
      serviceTypeName.trim();

    if (!name) {
      alert(
        "Please enter a service type."
      );

      return;
    }


    const duplicate =
      allServiceTypes.some(
        (serviceType) =>
          serviceType
            .trim()
            .toLowerCase() ===
          name.toLowerCase()
      );


    if (duplicate) {
      alert(
        "This service type already exists."
      );

      return;
    }


    try {
      setSavingServiceType(
        true
      );

      const created =
        await addServiceType(
          name
        );


      setCustomServiceTypes(
        (previous) => [
          ...previous,
          created,
        ]
      );


      setForm(
        (previous) => ({
          ...previous,
          serviceType:
            created.name,
        })
      );


      setServiceTypeName(
        ""
      );

      setShowServiceTypeForm(
        false
      );


      alert(
        "Service type added successfully."
      );

    } catch (error) {
      console.error(
        "Failed to add service type:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add service type."
      );

    } finally {
      setSavingServiceType(
        false
      );
    }
  }


  /* ============================================================
     SEARCH
     ============================================================ */

  const filtered =
    useMemo(() => {
      const text =
        search.toLowerCase();

      return records.filter(
        (r) =>
          r.serviceType
            .toLowerCase()
            .includes(text) ||
          r.serviceCenter
            .toLowerCase()
            .includes(text) ||
          r.vehicle
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


  const totalCost =
    filtered.reduce(
      (sum, r) =>
        sum + r.amount,
      0
    );


  /* ============================================================
     RESET
     ============================================================ */

  function handleReset() {
    if (!window.confirm("Are you sure you want to reset the values you have entered? This will clear the current form.")) {
      return;
    }

    const draftKey = getDraftKey();
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    skipAutosaveRef.current = true;
    draftReadyRef.current = false;
    void deleteFormDraft(draftKey).catch((error) =>
      console.error("Failed to delete service history draft:", error)
    );

    setEditingId(null);
    setForm({ ...emptyRecord });
    setShowVehicleForm(false);
    setVehicleBrand("");
    setVehicleModel("");
    setShowServiceTypeForm(false);
    setServiceTypeName("");
    setDraftStatus("idle");

    window.setTimeout(() => {
      draftReadyRef.current = true;
      skipAutosaveRef.current = false;
    }, 0);
  }


  /* ============================================================
     SAVE / UPDATE
     ============================================================ */

  async function handleSave() {
    if (
      !form.vehicle ||
      !form.date ||
      !form.serviceType ||
      !form.serviceCenter
    ) {
      alert(
        "Please complete all required fields."
      );

      return;
    }


    if (
      form.date > today
    ) {
      alert(
        "Service date cannot be in the future."
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
            "You can only update your own service records."
          );

          return;
        }


        await updateServiceRecord({
          ...form,
          id: editingId,
        });


        alert(
          "Service updated successfully."
        );

      } else {
        const {
          id,
          ...newRecord
        } = form;


        await addServiceRecord(
          newRecord
        );


        alert(
          "Service record added successfully."
        );
      }


      const savedDraftKey = getDraftKey();
      await deleteFormDraft(savedDraftKey);

      skipAutosaveRef.current = true;
      draftReadyRef.current = false;

      await loadRecords();

      setEditingId(
        null
      );

      setForm(
        emptyRecord
      );

      setDraftStatus("idle");

      window.setTimeout(() => {
        draftReadyRef.current = true;
        skipAutosaveRef.current = false;
      }, 0);

    } catch (
      error: any
    ) {
      console.error(
        "Supabase error:",
        error
      );

      alert(
        error?.message ||
          error?.details ||
          error?.hint ||
          JSON.stringify(
            error
          )
      );
    }
  }


  /* ============================================================
     DELETE
     ============================================================ */

  async function handleDelete(
    record: ServiceRecord
  ) {
    if (
      record.user_id !==
      currentUserId
    ) {
      alert(
        "You can only delete your own service records."
      );

      return;
    }


    if (
      !window.confirm(
        "Delete this service record?"
      )
    ) {
      return;
    }


    try {
      await deleteServiceRecord(
        record.id
      );

      await loadRecords();


      alert(
        "Service record deleted successfully."
      );

    } catch (
      error
    ) {
      console.error(
        error
      );

      alert(
        "Failed to delete service record."
      );
    }
  }


  /* ============================================================
     START EDIT
     ============================================================ */

  function handleEdit(
    record: ServiceRecord
  ) {
    if (
      record.user_id !==
      currentUserId
    ) {
      alert(
        "You can only edit your own service records."
      );

      return;
    }


    skipAutosaveRef.current = true;
    draftReadyRef.current = false;

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


  /* ============================================================
     RENDER
     ============================================================ */

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
          🔧 Service History
        </h2>

        <p>
          Track maintenance and
          servicing of your EV.
        </p>

      </div>


      {/* ======================================================
          ADD / EDIT SERVICE
          ====================================================== */}

      <div className="card">

        <h3>
          {editingId !== null
            ? "Edit Service Record"
            : "Add Service Record"}
        </h3>


        <div className="formGrid">

          {/* ==================================================
              DATE
              ================================================== */}

          <div>

            <label>
              Date
            </label>

            <input
              type="date"
              value={
                form.date
              }
              max={today}
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  date:
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
              Service date cannot
              be in the future.
            </p>

          </div>


          {/* ==================================================
              VEHICLE
              ================================================== */}

          <div>

            <label>
              Vehicle
            </label>

            <div
              style={{
                display:
                  "flex",
                gap:
                  "8px",
                alignItems:
                  "center",
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

                {allVehicles.map(
                  (vehicle) => (
                    <option
                      key={
                        vehicle.value
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
                    setShowVehicleForm(
                      (value) =>
                        !value
                    )
                  }
                >
                  ＋ Add Vehicle
                </button>
              )}

            </div>


            {showVehicleForm &&
              editingId === null && (
                <div
                  style={{
                    marginTop:
                      "10px",
                    padding:
                      "12px",
                    border:
                      "1px solid #e5e7eb",
                    borderRadius:
                      "8px",
                  }}
                >

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap:
                        "8px",
                    }}
                  >

                    <input
                      type="text"
                      placeholder="Brand"
                      value={
                        vehicleBrand
                      }
                      onChange={(e) =>
                        setVehicleBrand(
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="text"
                      placeholder="Model"
                      value={
                        vehicleModel
                      }
                      onChange={(e) =>
                        setVehicleModel(
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <div
                    style={{
                      display:
                        "flex",
                      gap:
                        "8px",
                      marginTop:
                        "10px",
                    }}
                  >

                    <button
                      type="button"
                      className="saveButton"
                      disabled={
                        savingVehicle
                      }
                      onClick={() =>
                        void handleAddVehicle()
                      }
                    >
                      {savingVehicle
                        ? "Saving..."
                        : "Save Vehicle"}
                    </button>


                    <button
                      type="button"
                      onClick={() => {
                        setShowVehicleForm(
                          false
                        );
                        setVehicleBrand(
                          ""
                        );
                        setVehicleModel(
                          ""
                        );
                      }}
                    >
                      Cancel
                    </button>

                  </div>

                </div>
              )}

          </div>


          {/* ==================================================
              ODOMETER
              ================================================== */}

          <div>

            <label>
              Odometer (km)
            </label>

            <input
              type="number"
              value={
                form.odometer === 0 ? "" : form.odometer
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  odometer:
                    Number(
                      e.target.value
                    ),
                })
              }
            />

          </div>


          {/* ==================================================
              SERVICE TYPE
              ================================================== */}

          <div>

            <label>
              Service Type
            </label>

            <div
              style={{
                display:
                  "flex",
                gap:
                  "8px",
                alignItems:
                  "center",
              }}
            >

              <select
                value={
                  form.serviceType
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    serviceType:
                      e.target.value,
                  })
                }
                style={{
                  flex: 1,
                }}
              >

                <option value="">
                  Select Service Type
                </option>

                {allServiceTypes.map(
                  (serviceType) => (
                    <option
                      key={
                        serviceType
                      }
                      value={
                        serviceType
                      }
                    >
                      {
                        serviceType
                      }
                    </option>
                  )
                )}

              </select>


              <button
                type="button"
                className="saveButton"
                onClick={() =>
                  setShowServiceTypeForm(
                    (value) =>
                      !value
                  )
                }
              >
                ＋ Add Service Type
              </button>

            </div>


            {showServiceTypeForm && (
              <div
                style={{
                  marginTop:
                    "10px",
                  padding:
                    "12px",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius:
                    "8px",
                }}
              >

                <input
                  type="text"
                  placeholder="Service type"
                  value={
                    serviceTypeName
                  }
                  onChange={(e) =>
                    setServiceTypeName(
                      e.target.value
                    )
                  }
                />


                <div
                  style={{
                    display:
                      "flex",
                    gap:
                      "8px",
                    marginTop:
                      "10px",
                  }}
                >

                  <button
                    type="button"
                    className="saveButton"
                    disabled={
                      savingServiceType
                    }
                    onClick={() =>
                      void handleAddServiceType()
                    }
                  >
                    {savingServiceType
                      ? "Saving..."
                      : "Save Service Type"}
                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setShowServiceTypeForm(
                        false
                      );
                      setServiceTypeName(
                        ""
                      );
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

          </div>


          {/* ==================================================
              SERVICE CENTRE
              ================================================== */}

          <div>

            <label>
              Service Centre
            </label>

            <input
              value={
                form.serviceCenter
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  serviceCenter:
                    e.target.value,
                })
              }
            />

          </div>


          {/* ==================================================
              AMOUNT
              ================================================== */}

          <div>

            <label>
              Amount (INR)
            </label>

            <input
              type="number"
              value={
                form.amount === 0 ? "" : form.amount
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount:
                    Number(
                      e.target.value
                    ),
                })
              }
            />

          </div>

        </div>


        {/* ====================================================
            NOTES
            ==================================================== */}

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


        {/* ====================================================
            ATTACHMENT
            ==================================================== */}

        <label>
          Invoice / Receipt
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
          Supported file types:
          PDF, images, and other
          document formats.
          Recommended maximum
          file size:{" "}
          <strong>
            5 MB
          </strong>{" "}
          per file for optimal
          performance.
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
              ? "Update Service"
              : "Add Service Record"}
          </button>

          {draftStatus === "loading" && (
            <span style={{ fontSize: "13px", color: "#6b7280" }}>Loading draft...</span>
          )}
          {draftStatus === "saving" && (
            <span style={{ fontSize: "13px", color: "#d97706" }}>Saving...</span>
          )}
          {draftStatus === "saved" && (
            <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600 }}>✓ Saved</span>
          )}
          {draftStatus === "error" && (
            <span style={{ fontSize: "13px", color: "#dc2626" }}>Draft save failed</span>
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


      {/* ======================================================
          KPIs
          ====================================================== */}

      <div className="kpiGrid">

        <div className="kpiCard">

          <h3>
            Total Services
          </h3>

          <h2>
            {
              filtered.length
            }
          </h2>

        </div>


        <div className="kpiCard">

          <h3>
            Total Cost
          </h3>

          <h2>
            INR{" "}
            {
              totalCost.toFixed(
                2
              )
            }
          </h2>

        </div>

      </div>


      {/* ======================================================
          SERVICE HISTORY
          ====================================================== */}

      <div className="card">

        <input
          type="text"
          placeholder="Search..."
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

                <th>
                  Date
                </th>

                <th>
                  Vehicle
                </th>

                <th>
                  Type
                </th>

                <th>
                  Centre
                </th>

                <th>
                  Cost
                </th>

                <th>
                  Receipt
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filtered.length ===
              0 ? (

                <tr>

                  <td colSpan={7}>
                    No service
                    records found.
                  </td>

                </tr>

              ) : (

                filtered.map(
                  (record) => {

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
                            record.date
                          }
                        </td>


                        <td>
                          {
                            record.vehicle
                          }
                        </td>


                        <td>
                          {
                            record.serviceType
                          }
                        </td>


                        <td>
                          {
                            record.serviceCenter
                          }
                        </td>


                        <td>
                          INR{" "}
                          {
                            record.amount.toFixed(
                              2
                            )
                          }
                        </td>


                        <td>

                          {record.attachment ? (

                            <>

                            <a
                              href={
                                record.attachment
                              }
                              download={record.attachment_name || `${record.vehicle}-${record.serviceType}-Receipt`}
                              className="downloadButton"
                            >
                              ⬇
                              Download
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