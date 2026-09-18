import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  DocumentRecord,
} from "../types/document";

import {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../services/documentVaultService";

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
  getDocumentCategories,
  addDocumentCategory,
  type DocumentCategory,
} from "../services/documentCategoryService";

import { vehicles } from "../data/vehicles";

import ReceiptUploader from "../components/ReceiptUploader";


const emptyRecord: DocumentRecord = {
  id: 0,
  user_id: "",

  title: "",
  category: "",
  vehicle: "",
  documentDate: "",
  file: "",
  attachment_name: "",
  notes: "",
  createdAt: "",
};


const builtInCategories = [
  "Registration Certificate (RC)",
  "Insurance",
  "Driving Licence",
  "Purchase Invoice",
  "Warranty",
  "Service Record",
  "Tyre Invoice",
  "Charging",
  "FASTag",
  "Loan",
  "Pollution Certificate",
  "Other",
];


export default function DocumentVault() {
  const [records, setRecords] =
    useState<DocumentRecord[]>([]);

  const [
    currentUserId,
    setCurrentUserId,
  ] = useState<string | null>(null);

  const [form, setForm] =
    useState<DocumentRecord>(
      emptyRecord
    );

  const [
    editingId,
    setEditingId,
  ] = useState<number | null>(null);


  /* =========================================================
     AUTOSAVE
     ========================================================= */

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
      ? `document-vault:${editingId}`
      : "document-vault:new";


  const [search, setSearch] =
    useState("");

  /* =========================================================
     CUSTOM VEHICLES
     ========================================================= */

  const [
    customVehicles,
    setCustomVehicles,
  ] = useState<CustomVehicleRecord[]>([]);

  const [
    showVehicleForm,
    setShowVehicleForm,
  ] = useState(false);

  const [vehicleBrand, setVehicleBrand] =
    useState("");

  const [vehicleModel, setVehicleModel] =
    useState("");

  const [
    savingVehicle,
    setSavingVehicle,
  ] = useState(false);


  /* =========================================================
     CUSTOM CATEGORIES
     ========================================================= */

  const [
    customCategories,
    setCustomCategories,
  ] = useState<DocumentCategory[]>([]);

  const [
    showCategoryForm,
    setShowCategoryForm,
  ] = useState(false);

  const [
    categoryName,
    setCategoryName,
  ] = useState("");

  const [
    savingCategory,
    setSavingCategory,
  ] = useState(false);


  /* =========================================================
     DATE
     ========================================================= */

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


  /* =========================================================
     LOAD CURRENT USER + DOCUMENTS + VEHICLES + CATEGORIES
     ========================================================= */

  useEffect(() => {
    async function initialize() {
      try {
        const userId =
          await getCurrentUserId();

        setCurrentUserId(
          userId
        );

        await Promise.all([
          loadDocuments(),
          loadCustomVehicles(),
          loadCustomCategories(),
        ]);


        await restoreDraft("document-vault:new");
      } catch (err) {
        console.error(
          "Failed to initialize document vault:",
          err
        );

        alert(
          "Failed to initialize Document Vault."
        );
      }
    }


    void initialize();
  }, []);


  async function loadDocuments() {
    try {
      const data =
        await getDocuments();

      setRecords(
        data
      );

    } catch (err) {
      console.error(
        err
      );

      alert(
        "Failed to load documents."
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


  async function loadCustomCategories() {
    try {
      const data =
        await getDocumentCategories();

      setCustomCategories(
        data
      );

    } catch (err) {
      console.error(
        "Failed to load custom categories:",
        err
      );

      alert(
        "Failed to load document categories."
      );
    }
  }


  /* =========================================================
     VEHICLE LIST
     ========================================================= */

  const allVehicles = useMemo(() => {
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


  /* =========================================================
     CATEGORY LIST
     ========================================================= */

  const allCategories =
    useMemo(() => {
      const combined = [
        ...builtInCategories,
        ...customCategories.map(
          (category) =>
            category.name
        ),
      ];

      const seen =
        new Set<string>();

      return combined.filter(
        (category) => {
          const key =
            category
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
      customCategories,
    ]);


  /* =========================================================
     ADD CUSTOM VEHICLE
     ========================================================= */

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

    const duplicate =
      allVehicles.some(
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

      const vehicleName =
        `${created.brand} ${created.model}`;

      setForm(
        (previous) => ({
          ...previous,
          vehicle:
            vehicleName,
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


  /* =========================================================
     ADD CUSTOM CATEGORY
     ========================================================= */

  async function handleAddCategory() {
    const name =
      categoryName.trim();

    if (!name) {
      alert(
        "Please enter a category name."
      );

      return;
    }

    const duplicate =
      allCategories.some(
        (category) =>
          category
            .trim()
            .toLowerCase() ===
          name.toLowerCase()
      );

    if (duplicate) {
      alert(
        "This category already exists."
      );

      return;
    }

    try {
      setSavingCategory(
        true
      );

      const created =
        await addDocumentCategory(
          name
        );

      setCustomCategories(
        (previous) => [
          ...previous,
          created,
        ]
      );

      setForm(
        (previous) => ({
          ...previous,
          category:
            created.name,
        })
      );

      setCategoryName(
        ""
      );

      setShowCategoryForm(
        false
      );

      alert(
        "Category created successfully."
      );

    } catch (error) {
      console.error(
        "Failed to create category:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create category."
      );

    } finally {
      setSavingCategory(
        false
      );
    }
  }



  async function restoreDraft(draftKey: string) {
    try {
      setDraftStatus("loading");
      skipAutosaveRef.current = true;
      draftLoadedRef.current = false;

      const draft =
        await getFormDraft<DocumentRecord>(draftKey);

      if (draft?.draft_data) {
        setForm((current) => ({
          ...current,
          ...draft.draft_data,
          file: "",
        }));
        setDraftStatus("saved");
      } else {
        setDraftStatus("idle");
      }
    } catch (err) {
      console.error("Failed to restore document draft:", err);
      setDraftStatus("error");
    } finally {
      draftLoadedRef.current = true;
      window.setTimeout(() => {
        skipAutosaveRef.current = false;
      }, 0);
    }
  }

  useEffect(() => {
    if (!draftLoadedRef.current || skipAutosaveRef.current) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setDraftStatus("saving");

    autosaveTimerRef.current = setTimeout(() => {
      void saveFormDraft(
        getDraftKey(),
        {
          ...form,
          file: "",
        }
      )
        .then(() => setDraftStatus("saved"))
        .catch((err) => {
          console.error("Failed to autosave document draft:", err);
          setDraftStatus("error");
        });
    }, 1000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [form, editingId]);

  useEffect(() => {
    if (editingId !== null) {
      void restoreDraft(`document-vault:${editingId}`);
    }
  }, [editingId]);

  function handleAutosaveBlur() {
    if (!draftLoadedRef.current || skipAutosaveRef.current) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setDraftStatus("saving");

    void saveFormDraft(
      getDraftKey(),
      {
        ...form,
        file: "",
      }
    )
      .then(() => setDraftStatus("saved"))
      .catch((err) => {
        console.error("Failed to autosave document draft:", err);
        setDraftStatus("error");
      });
  }


  /* =========================================================
     SEARCH
     ========================================================= */

  const filtered =
    useMemo(() => {
      const text =
        search.toLowerCase();

      return records.filter(
        (r) =>
          r.title
            .toLowerCase()
            .includes(text) ||

          r.category
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


  const totalDocuments =
    filtered.length;


  /* =========================================================
     EDIT
     ========================================================= */

  function handleEdit(
    record: DocumentRecord
  ) {
    if (
      record.user_id !==
      currentUserId
    ) {
      alert(
        "You can only edit your own documents."
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


  /* =========================================================
     DELETE
     ========================================================= */

  async function handleDelete(
    record: DocumentRecord
  ) {
    if (
      record.user_id !==
      currentUserId
    ) {
      alert(
        "You can only delete your own documents."
      );

      return;
    }

    if (
      !window.confirm(
        "Delete this document?"
      )
    ) {
      return;
    }

    try {
      await deleteDocument(
        record.id
      );

      await loadDocuments();

      alert(
        "Document deleted successfully."
      );

    } catch (err) {
      console.error(
        err
      );

      alert(
        "Failed to delete document."
      );
    }
  }


  /* =========================================================
     RESET
     ========================================================= */

  function handleReset() {
    if (!window.confirm("Are you sure you want to reset the values you have entered? This will clear the current form.")) {
      return;
    }

    const draftKey =
      editingId !== null
        ? `document-vault:${editingId}`
        : "document-vault:new";

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    skipAutosaveRef.current = true;
    draftLoadedRef.current = false;

    void deleteFormDraft(draftKey).catch((err) => {
      console.error("Failed to delete document draft:", err);
    });

    setEditingId(null);
    setForm({ ...emptyRecord });
    setShowVehicleForm(false);
    setVehicleBrand("");
    setVehicleModel("");
    setShowCategoryForm(false);
    setCategoryName("");
    setDraftStatus("idle");

    window.setTimeout(() => {
      draftLoadedRef.current = true;
      skipAutosaveRef.current = false;
    }, 0);
  }


  /* =========================================================
     SAVE / UPDATE
     ========================================================= */

  async function handleSave() {
    if (
      !form.vehicle ||
      !form.category ||
      !form.title ||
      !form.documentDate
    ) {
      alert(
        "Please complete all required fields."
      );

      return;
    }

    if (
      form.documentDate >
      today
    ) {
      alert(
        "Document date cannot be in the future."
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
            "You can only update your own documents."
          );

          return;
        }

        await updateDocument({
          ...form,
          id: editingId,
        });

        alert(
          "Document updated successfully."
        );

      } else {
        const {
          id,
          user_id,
          createdAt,
          ...newDocument
        } = form;

        await addDocument(
          newDocument
        );

        alert(
          "Document added successfully."
        );
      }

      const savedDraftKey =
        editingId !== null
          ? `document-vault:${editingId}`
          : "document-vault:new";

      await deleteFormDraft(savedDraftKey);

      skipAutosaveRef.current = true;
      draftLoadedRef.current = false;

      await loadDocuments();

      setEditingId(
        null
      );

      setForm(
        emptyRecord
      );

      setDraftStatus("idle");

      window.setTimeout(() => {
        draftLoadedRef.current = true;
        skipAutosaveRef.current = false;
      }, 0);

    } catch (error) {
      console.error(
        error
      );

      alert(
        editingId !== null
          ? "Failed to update document."
          : "Failed to add document."
      );
    }
  }


  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <>
      <div className="welcome">

        <h2>
          📁 Document Vault
        </h2>

        <p>
          Store and manage all your
          vehicle-related documents
          in one place.
        </p>

      </div>


      {/* =====================================================
          ADD / EDIT DOCUMENT
          ===================================================== */}

      <div className="card">

        <h3>
          {editingId !== null
            ? "Edit Document"
            : "Add Document"}
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

            </div>


            {showVehicleForm && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              >

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "8px",
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
                    display: "flex",
                    gap: "8px",
                    marginTop: "10px",
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


          {/* =================================================
              CATEGORY
              ================================================= */}

          <div>
            <label>
              Category
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
                  form.category
                }
                onBlur={handleAutosaveBlur}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category:
                      e.target.value,
                  })
                }
                style={{
                  flex: 1,
                }}
              >

                <option value="">
                  Select Category
                </option>

                {allCategories.map(
                  (category) => (
                    <option
                      key={
                        category
                      }
                      value={
                        category
                      }
                    >
                      {
                        category
                      }
                    </option>
                  )
                )}

              </select>


              <button
                type="button"
                className="saveButton"
                onClick={() =>
                  setShowCategoryForm(
                    (value) =>
                      !value
                  )
                }
              >
                ＋ Create Category
              </button>

            </div>


            {showCategoryForm && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              >

                <input
                  type="text"
                  placeholder="Category name"
                  value={
                    categoryName
                  }
                  onChange={(e) =>
                    setCategoryName(
                      e.target.value
                    )
                  }
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
                    disabled={
                      savingCategory
                    }
                    onClick={() =>
                      void handleAddCategory()
                    }
                  >
                    {savingCategory
                      ? "Saving..."
                      : "Save Category"}
                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(
                        false
                      );
                      setCategoryName(
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


          {/* =================================================
              TITLE
              ================================================= */}

          <div>
            <label>
              Document Title
            </label>

            <input
              type="text"
              value={
                form.title
              }
              onBlur={handleAutosaveBlur}
                onChange={(e) =>
                setForm({
                  ...form,
                  title:
                    e.target.value,
                })
              }
              placeholder="Insurance Policy 2026"
            />
          </div>


          {/* =================================================
              DATE
              ================================================= */}

          <div>
            <label>
              Document Date
            </label>

            <input
              type="date"
              value={
                form.documentDate
              }
              max={today}
              onChange={(e) =>
                setForm({
                  ...form,
                  documentDate:
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
              Document date cannot
              be in the future.
            </p>

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
          Attachment
        </label>


        <ReceiptUploader
          value={form.file}
          fileName={form.attachment_name}
          onChange={(file) => {
            setForm({
              ...form,
              file,
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
            fontSize: 12,
            color: "#666",
            marginTop: 8,
          }}
        >
          You can upload PDF,
          images, Word, Excel and
          other document formats.
          Recommended maximum
          file size:{" "}
          <strong>
            5 MB
          </strong>
          .
        </p>


        <br />


        <div
          style={{
            minHeight: "20px",
            marginBottom: "8px",
            fontSize: "13px",
          }}
        >
          {draftStatus === "loading" && (
            <span style={{ color: "#6b7280" }}>
              Loading draft...
            </span>
          )}
          {draftStatus === "saving" && (
            <span style={{ color: "#d97706" }}>
              Saving...
            </span>
          )}
          {draftStatus === "saved" && (
            <span
              style={{
                color: "#16a34a",
                fontWeight: 600,
              }}
            >
              ✓ Saved
            </span>
          )}
          {draftStatus === "error" && (
            <span style={{ color: "#dc2626" }}>
              Draft save failed
            </span>
          )}
        </div>

        <button
          className="saveButton"
          onClick={() =>
            void handleSave()
          }
        >
          {editingId !== null
            ? "Update Document"
            : "Add Document"}
        </button>

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
            Total Documents
          </h3>

          <h2>
            {
              totalDocuments
            }
          </h2>

        </div>


        <div className="kpiCard">

          <h3>
            Categories
          </h3>

          <h2>
            {
              new Set(
                filtered.map(
                  (d) =>
                    d.category
                )
              ).size
            }
          </h2>

        </div>


        <div className="kpiCard">

          <h3>
            Vehicles
          </h3>

          <h2>
            {
              new Set(
                filtered.map(
                  (d) =>
                    d.vehicle
                )
              ).size
            }
          </h2>

        </div>

      </div>


      {/* =====================================================
          DOCUMENT TABLE
          ===================================================== */}

      <div className="card">

        <input
          type="text"
          placeholder="Search documents..."
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
                  #
                </th>

                <th>
                  Vehicle
                </th>

                <th>
                  Category
                </th>

                <th>
                  Title
                </th>

                <th>
                  Date
                </th>

                <th>
                  Attachment
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
                    No documents
                    found.
                  </td>

                </tr>

              ) : (

                filtered.map(
                  (
                    record,
                    index
                  ) => {

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
                            record.category
                          }
                        </td>


                        <td>
                          {
                            record.title
                          }
                        </td>


                        <td>
                          {
                            record.documentDate
                          }
                        </td>


                        <td>

                          {record.file ? (

                            <>


                            <a
                              href={
                                record.file
                              }
                              download={
                                record.title
                              }
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