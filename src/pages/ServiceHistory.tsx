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
  getCurrentPlan,
  canAddServiceHistory,
  canUseFileUploads,
  FREE_LIMITS,
  type SubscriptionPlan,
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

  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>("free");

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

  const [vehicleSearch, setVehicleSearch] =
    useState("");

  const [showVehicleSuggestions, setShowVehicleSuggestions] =
    useState(false);

  const [vehicleBrand, setVehicleBrand] =
    useState("");

  const [vehicleModel, setVehicleModel] =
    useState("");

  const [savingVehicle, setSavingVehicle] =
    useState(false);

  const [customServiceType, setCustomServiceType] =
    useState("");

  const [serviceSearch, setServiceSearch] =
    useState("");

  const [showServiceSuggestions, setShowServiceSuggestions] =
    useState(false);

  const [showCustomServiceForm, setShowCustomServiceForm] =
    useState(false);

  const vehicleDropdownRef =
    useRef<HTMLDivElement | null>(null);

  const serviceDropdownRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        showVehicleSuggestions &&
        vehicleDropdownRef.current &&
        !vehicleDropdownRef.current.contains(target)
      ) {
        setShowVehicleSuggestions(false);
      }

      if (
        showServiceSuggestions &&
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(target)
      ) {
        setShowServiceSuggestions(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setShowVehicleSuggestions(false);
      setShowServiceSuggestions(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showVehicleSuggestions, showServiceSuggestions]);


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

      const plan = await getCurrentPlan();
      setSubscriptionPlan(plan);

      await Promise.all([
        loadRecords(),
        loadCustomVehicles(),
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


  const filteredVehicleOptions = useMemo(() => {
    const query = vehicleSearch.trim().toLowerCase();

    if (!query) return allVehicles;

    return allVehicles.filter((vehicle) =>
      vehicle.label.toLowerCase().includes(query)
    );
  }, [allVehicles, vehicleSearch]);


  /* ============================================================
     SERVICE OPTIONS
     ============================================================ */

  const serviceOptions = {
    "Free Service": [
      "General Inspection",
      "Battery Check",
      "12V Battery Check",
      "Tyre Pressure Check",
      "Tyre Rotation",
      "Wheel Alignment",
      "Brake Inspection",
      "Brake Fluid Check",
      "Coolant Level Check",
      "Washer Fluid Top-up",
      "Charging System Check",
      "Charging Port Inspection",
      "Software Update",
      "Firmware Update",
      "Road Test",
      "Safety Inspection",
      "Other",
    ],
    "Paid Service": [
      "Oil Change",
      "Coolant Change",
      "Brake Service",
      "Brake Pad Replacement",
      "Brake Disc Replacement",
      "Brake Fluid Change",
      "Brake Caliper Service",
      "Tyre Replacement",
      "Wheel Alignment",
      "Wheel Balancing",
      "Tyre Rotation",
      "Wheel Bearing Replacement",
      "Battery Replacement",
      "12V Battery Replacement",
      "Battery Health Check",
      "AC Service",
      "AC Filter Replacement",
      "Cabin Filter Replacement",
      "Air Filter Replacement",
      "Wiper Blade Replacement",
      "Suspension Service",
      "Shock Absorber Replacement",
      "Steering Service",
      "Wheel Hub Service",
      "Charging Port Service",
      "Charging System Repair",
      "Coolant System Repair",
      "Software / Firmware Repair",
      "Software Update",
      "General Repair",
      "Electrical Repair",
      "Body Repair",
      "Other",
    ],
    "Other Service": [],
  };

  const serviceCategories = Object.keys(serviceOptions) as Array<
    keyof typeof serviceOptions
  >;

  const [selectedServiceCategory, setSelectedServiceCategory] =
    useState<keyof typeof serviceOptions | "">("");

  const [selectedServiceToAdd, setSelectedServiceToAdd] = useState("");
  const [otherServiceDetail, setOtherServiceDetail] = useState("");

  const availableServices = selectedServiceCategory
    ? serviceOptions[selectedServiceCategory]
    : [];

  const filteredServiceOptions = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase();

    if (!query) return availableServices;

    return availableServices.filter((service) =>
      service.toLowerCase().includes(query)
    );
  }, [availableServices, serviceSearch]);

  /* ============================================================
     ADD CUSTOM VEHICLE
     ============================================================ */

  async function handleAddVehicle() {
    const brand = vehicleBrand.trim();
    const model = vehicleModel.trim();

    if (!brand || !model) {
      alert("Please enter the vehicle brand and model.");
      return;
    }

    const vehicleName = `${brand} ${model}`;
    const duplicate = allVehicles.some(
      (vehicle) =>
        vehicle.value.trim().toLowerCase() ===
        vehicleName.trim().toLowerCase()
    );

    if (duplicate) {
      alert("This vehicle already exists.");
      return;
    }

    try {
      setSavingVehicle(true);

      const created = await addCustomVehicle({ brand, model });

      setCustomVehicles((previous) => [...previous, created]);

      const createdVehicle = `${created.brand} ${created.model}`;

      setForm((previous) => ({
        ...previous,
        vehicle: createdVehicle,
      }));
      setVehicleSearch(createdVehicle);
      setShowVehicleSuggestions(false);

      setVehicleBrand("");
      setVehicleModel("");
      setShowVehicleForm(false);

      alert("Vehicle added successfully.");
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to add vehicle."
      );
    } finally {
      setSavingVehicle(false);
    }
  }


  /* ============================================================
     SERVICES PERFORMED
     ============================================================ */

  const selectedServiceTypes = useMemo(
    () =>
      form.serviceType
        .split(",")
        .map((service) => service.trim())
        .filter(Boolean),
    [form.serviceType]
  );

  function addServiceToForm() {
    const selectedService = selectedServiceToAdd.trim();
    const customDetail = otherServiceDetail.trim();
    const customService = customServiceType.trim();

    if (!selectedServiceCategory && !customService) return;

    const isOtherCategory = selectedServiceCategory === "Other Service";

    const service =
      customService
        ? customService
        : isOtherCategory
          ? customDetail
            ? `Other Service - ${customDetail}`
            : ""
          : selectedService === "Other"
            ? customDetail
              ? `${selectedServiceCategory} - Other - ${customDetail}`
              : ""
            : selectedService;

    if (!service) {
      alert("Please enter the custom service detail.");
      return;
    }

    if (selectedServiceTypes.some((selected) => selected.toLowerCase() === service.toLowerCase())) {
      setSelectedServiceToAdd("");
      setOtherServiceDetail("");
      return;
    }

    setForm((previous) => ({
      ...previous,
      serviceType: [...selectedServiceTypes, service].join(", "),
    }));

    setSelectedServiceToAdd("");
    setOtherServiceDetail("");
    setCustomServiceType("");
  }

  function removeServiceFromForm(serviceToRemove: string) {
    setForm((previous) => ({
      ...previous,
      serviceType: selectedServiceTypes
        .filter(
          (service) =>
            service.toLowerCase() !== serviceToRemove.toLowerCase()
        )
        .join(", "),
    }));
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
    setSelectedServiceToAdd("");
    setSelectedServiceCategory("");
    setOtherServiceDetail("");
    setCustomServiceType("");
    setServiceSearch("");
    setShowServiceSuggestions(false);
    setShowCustomServiceForm(false);
    setVehicleSearch("");
    setShowVehicleSuggestions(false);
    setDraftStatus("idle");

    window.setTimeout(() => {
      draftReadyRef.current = true;
      skipAutosaveRef.current = false;
    }, 0);
  }


  function getServiceCategoryFromRecord(serviceType: string): "Free Service" | "Paid Service" | null {
    const normalized = serviceType.trim().toLowerCase();

    if (
      normalized.startsWith("1st free service") ||
      normalized.startsWith("2nd free service") ||
      normalized.startsWith("3rd free service") ||
      normalized.startsWith("4th free service") ||
      normalized.startsWith("5th free service") ||
      normalized.startsWith("free service")
    ) {
      return "Free Service";
    }

    if (
      normalized.startsWith("1st paid service") ||
      normalized.startsWith("2nd paid service") ||
      normalized.startsWith("3rd paid service") ||
      normalized.startsWith("4th paid service") ||
      normalized.startsWith("5th paid service") ||
      normalized.startsWith("paid service")
    ) {
      return "Paid Service";
    }

    return null;
  }

  function getOrdinal(count: number) {
    if (count % 100 >= 11 && count % 100 <= 13) return `${count}th`;
    switch (count % 10) {
      case 1: return `${count}st`;
      case 2: return `${count}nd`;
      case 3: return `${count}rd`;
      default: return `${count}th`;
    }
  }

  function getNextServiceLabel(category: "Free Service" | "Paid Service") {
    const count = records.filter((record) => {
      if (record.user_id !== currentUserId) return false;
      return getServiceCategoryFromRecord(record.serviceType) === category;
    }).length;

    return `${getOrdinal(count + 1)} ${category}`;
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
        /*
         * Enforce the Free-plan service history limit.
         * Only records owned by the current user count.
         * Premium users have no numeric limit.
         */

        const plan = await getCurrentPlan();

        const ownServiceCount =
          currentUserId === null
            ? records.length
            : records.filter(
                (record) =>
                  record.user_id === currentUserId
              ).length;

        if (
          !canAddServiceHistory(
            ownServiceCount,
            plan
          )
        ) {
          alert(
            `The Free plan is limited to ${FREE_LIMITS.serviceHistory} service history records. Upgrade to Premium for ₹69 one-time to add more service history records.`
          );

          return;
        }

        const serviceLabel = getNextServiceLabel(
          selectedServiceCategory === "Free Service" ||
          selectedServiceCategory === "Paid Service"
            ? selectedServiceCategory
            : form.serviceType.toLowerCase().startsWith("paid")
              ? "Paid Service"
              : "Free Service"
        );

        const serviceDetails = form.serviceType
          .split(",")
          .map((service) => service.trim())
          .filter(Boolean)
          .join(", ");

        const recordWithServiceLabel = {
          ...form,
          serviceType: `${serviceLabel} - ${serviceDetails}`,
        };

        const {
          id,
          ...newRecord
        } = recordWithServiceLabel;


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
      setVehicleSearch("");
      setShowVehicleSuggestions(false);

      setSelectedServiceCategory("");
      setSelectedServiceToAdd("");
      setOtherServiceDetail("");
      setCustomServiceType("");
      setServiceSearch("");
      setShowServiceSuggestions(false);
      setShowCustomServiceForm(false);
      setVehicleSearch("");
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
              className="evtoolkitCustomFieldRow"
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >

              <div
                className="evtoolkitCustomFieldControl"
                ref={vehicleDropdownRef}
                style={{ position: "relative", flex: 1 }}
              >
                <input
                  type="text"
                  placeholder="Type vehicle name to search..."
                  value={editingId !== null ? form.vehicle : vehicleSearch}
                  disabled={editingId !== null}
                  onFocus={() => {
                    if (editingId === null) {
                      setShowVehicleSuggestions(true);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setVehicleSearch(value);
                    setShowVehicleSuggestions(true);

                    setForm((previous) => ({
                      ...previous,
                      vehicle: "",
                    }));
                  }}
                  onBlur={(e) => {
                    handleAutosaveBlur();
                    const next = e.relatedTarget as Node | null;
                    if (!next || !vehicleDropdownRef.current?.contains(next)) {
                      setShowVehicleSuggestions(false);
                    }
                  }}
                  style={{ paddingRight: "44px" }}
                />

                <button
                  type="button"
                  aria-label="Show vehicle list"
                  disabled={editingId !== null}
                  onClick={() => {
                    if (editingId === null) {
                      setShowVehicleSuggestions((open) => !open);
                    }
                  }}
                  style={{
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "32px",
                    height: "32px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#374151",
                    color: "#f9fafb",
                    cursor: editingId === null ? "pointer" : "not-allowed",
                    fontSize: "18px",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ▾
                </button>

                {editingId === null &&
                  showVehicleSuggestions && (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        zIndex: 100,
                        background: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        maxHeight: "220px",
                        overflowY: "auto",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                      }}
                    >
                      {filteredVehicleOptions.length > 0 ? (
                        filteredVehicleOptions.map((vehicle) => (
                          <button
                            key={vehicle.value}
                            type="button"
                            onClick={() => {
                              setForm((previous) => ({
                                ...previous,
                                vehicle: vehicle.value,
                              }));
                              setVehicleSearch(vehicle.value);
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
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#374151";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            {vehicle.label}
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
                  className="saveButton"
                  onClick={() => setShowVehicleForm((value) => !value)}
                  style={{
                    height: "46px",
                    alignSelf: "flex-start",
                    marginTop: "6px",
                    boxSizing: "border-box",
                  }}
                >
                  ＋ Or Add Custom Vehicle
                </button>
              )}

            </div>

            {editingId !== null && form.vehicle && (
              <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
                Selected vehicle: {form.vehicle}
              </p>
            )}

            {showVehicleForm && editingId === null && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Brand"
                    value={vehicleBrand}
                    onChange={(e) => setVehicleBrand(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Model"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    type="button"
                    className="saveButton"
                    disabled={savingVehicle}
                    onClick={() => void handleAddVehicle()}
                  >
                    {savingVehicle ? "Saving..." : "Save Vehicle"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowVehicleForm(false);
                      setVehicleBrand("");
                      setVehicleModel("");
                    }}
                    style={{
                      background: "#dc2626",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      cursor: "pointer",
                      fontWeight: 600,
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
              SERVICES PERFORMED
              ================================================== */}

          <div>

            <label>
              Services Performed
            </label>

            <div
              className="evtoolkitCustomFieldRow"
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >

              <select
                className="evtoolkitCustomFieldControl"
                value={selectedServiceCategory}
                onChange={(e) => {
                  const category =
                    e.target.value as keyof typeof serviceOptions | "";
                  setSelectedServiceCategory(category);
                  setSelectedServiceToAdd("");
                  setOtherServiceDetail("");
                  setServiceSearch("");
                  setShowServiceSuggestions(false);
                }}
                onBlur={handleAutosaveBlur}
                style={{ flex: 1 }}
              >
                <option value="">Select Service Type</option>
                {serviceCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {selectedServiceCategory !== "Other Service" && (
                <div
                  className="evtoolkitCustomFieldControl"
                  ref={serviceDropdownRef}
                  style={{ position: "relative", flex: 1 }}
                >
                  <input
                    type="text"
                    placeholder={
                      selectedServiceCategory
                        ? "Type service name to search..."
                        : "Select service type first"
                    }
                    value={serviceSearch}
                    disabled={!selectedServiceCategory}
                    onFocus={() => {
                      if (selectedServiceCategory) {
                        setShowServiceSuggestions(true);
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setServiceSearch(value);
                      setSelectedServiceToAdd("");
                      setShowServiceSuggestions(true);
                    }}
                    onBlur={(e) => {
                      handleAutosaveBlur();
                      const next = e.relatedTarget as Node | null;
                      if (!next || !serviceDropdownRef.current?.contains(next)) {
                        setShowServiceSuggestions(false);
                      }
                    }}
                    style={{ paddingRight: "44px" }}
                  />

                  <button
                    type="button"
                    aria-label="Show service list"
                    disabled={!selectedServiceCategory}
                    onClick={() => {
                      if (selectedServiceCategory) {
                        setShowServiceSuggestions((open) => !open);
                      }
                    }}
                    style={{
                      position: "absolute",
                      right: "6px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "32px",
                      height: "32px",
                      border: "none",
                      borderRadius: "6px",
                      background: "#374151",
                      color: "#f9fafb",
                      cursor: selectedServiceCategory ? "pointer" : "not-allowed",
                      fontSize: "18px",
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    ▾
                  </button>

                  {selectedServiceCategory &&
                    showServiceSuggestions && (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          zIndex: 100,
                          background: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          maxHeight: "220px",
                          overflowY: "auto",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                        }}
                      >
                        {filteredServiceOptions.length > 0 ? (
                          filteredServiceOptions.map((service) => (
                            <button
                              key={service}
                              type="button"
                              onClick={() => {
                                setSelectedServiceToAdd(service);
                                setServiceSearch(service);
                                setShowServiceSuggestions(false);
                                if (service !== "Other") {
                                  setOtherServiceDetail("");
                                }
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
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#374151";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                              }}
                            >
                              {service}
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
                            No matching service found. Use ＋ Or Add Custom Service.
                          </div>
                        )}
                      </div>
                    )}
                </div>
              )}

              {(selectedServiceCategory === "Other Service" || selectedServiceToAdd === "Other") && (
                <input
                  type="text"
                  value={otherServiceDetail}
                  onChange={(e) => setOtherServiceDetail(e.target.value)}
                  onBlur={handleAutosaveBlur}
                  placeholder="Enter custom service detail"
                  aria-label="Custom service detail"
                  style={{ flex: 1 }}
                />
              )}

              <button
                type="button"
                className="saveButton evtoolkitCustomFieldButton"
                onClick={() => {
                  setShowCustomServiceForm((value) => !value);
                  setCustomServiceType("");
                }}
                style={{
                  height: "46px",
                  alignSelf: "flex-start",
                  marginTop: "6px",
                  boxSizing: "border-box",
                }}
              >
                ＋ Or Add Custom Service
              </button>

              <button
                type="button"
                className="saveButton evtoolkitCustomFieldButton"
                style={{
                  height: "46px",
                  alignSelf: "flex-start",
                  marginTop: "6px",
                  boxSizing: "border-box",
                }}
                disabled={
                  (!selectedServiceCategory && !customServiceType.trim()) ||
                  (selectedServiceCategory &&
                    selectedServiceCategory !== "Other Service" &&
                    !selectedServiceToAdd &&
                    !customServiceType.trim()) ||
                  ((selectedServiceCategory === "Other Service" ||
                    selectedServiceToAdd === "Other") &&
                    !otherServiceDetail.trim() &&
                    !customServiceType.trim())
                }
                onClick={addServiceToForm}
              >
                ＋ Add
              </button>
            </div>

            {showCustomServiceForm && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              >
                <input
                  type="text"
                  value={customServiceType}
                  onChange={(e) => setCustomServiceType(e.target.value)}
                  onBlur={handleAutosaveBlur}
                  placeholder="Enter custom service name"
                  aria-label="Custom service name"
                  style={{ width: "100%" }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    type="button"
                    className="saveButton"
                    disabled={!customServiceType.trim()}
                    onClick={() => {
                      addServiceToForm();
                      setShowCustomServiceForm(false);
                    }}
                  >
                    Save Custom Service
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomServiceForm(false);
                      setCustomServiceType("");
                    }}
                    style={{
                      background: "#dc2626",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {selectedServiceTypes.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                {selectedServiceTypes.map((service) => (
                  <span
                    key={service}
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
                    {service}

                    <button
                      type="button"
                      onClick={() =>
                        removeServiceFromForm(service)
                      }
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: 700,
                        color: "#dbeafe",
                        padding: 0,
                      }}
                      aria-label={`Remove ${service}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {selectedServiceTypes.length === 0 && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginTop: "6px",
                }}
              >
                Select Free Service or Paid Service, choose the services
                performed, and press Add. You can add multiple services.
              </p>
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
          rows={4}
          value={
            form.notes
          }
          placeholder="If you want to add a note, write it here..."
          onBlur={handleAutosaveBlur}
          onChange={(e) =>
            setForm({
              ...form,
              notes:
                e.target.value,
            })
          }
          style={{
            width: "100%",
            minHeight: "110px",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />


        <br />


        {/* ====================================================
            ATTACHMENT
            ==================================================== */}

        <label>
          Invoice / Receipt
        </label>

        {canUseFileUploads(subscriptionPlan) ? (
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
              .serviceHistoryFileUpload input[type="file"]::file-selector-button {
                background: #16a34a;
                color: #ffffff;
                border: none;
                border-radius: 6px;
                padding: 8px 14px;
                margin-right: 10px;
                cursor: pointer;
                font-weight: 600;
              }

              .serviceHistoryFileUpload input[type="file"]::file-selector-button:hover {
                background: #15803d;
              }
            `}</style>
            <div className="serviceHistoryFileUpload">
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
            Invoice and receipt uploads are available only with Premium Plus.
            Premium Plus is coming soon.
          </div>
        )}


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