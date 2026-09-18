import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { TyreRecord } from "../types/tyre";

import ReceiptUploader from "../components/ReceiptUploader";
import UserDetails from "../components/UserDetails";

import {
  getTyres,
  addTyre,
  updateTyre,
  deleteTyre,
} from "../services/tyreService";

import { getCurrentUserId } from "../services/authHelper";

import {
  getCurrentPlan,
  canAddTyreHistory,
  FREE_LIMITS,
} from "../services/subscriptionService";

import {
  getFormDraft,
  saveFormDraft,
  deleteFormDraft,
} from "../services/formDraftService";


type TyreRecordWithAttachmentName = TyreRecord & {
  attachment_name: string;
};


const emptyRecord: TyreRecordWithAttachmentName = {
  id: 0,

  user_id: "",

  brand: "",
  model: "",
  size: "",

  purchaseDate: "",
  installDate: "",

  odometer: 0,

  cost: 0,
  dealer: "",
  warrantyMonths: 0,

  receipt: "",
  attachment_name: "",

  notes: "",

  createdAt: "",
  updatedAt: "",
};


interface TyreHistoryProps {
  onNavigate?: (page: string) => void;
}

export default function TyreHistory({ onNavigate }: TyreHistoryProps) {
  const [records, setRecords] =
    useState<TyreRecordWithAttachmentName[]>([]);


  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);


  const [form, setForm] =
    useState<TyreRecordWithAttachmentName>(
      emptyRecord
    );


  const [search, setSearch] =
    useState("");


  const [editingId, setEditingId] =
    useState<number | null>(null);

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
      ? `tyre:${editingId}`
      : "tyre:new";


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
     LOAD CURRENT USER + TYRES
     ========================================================= */

  useEffect(() => {
    async function initialize() {
      try {
        const userId =
          await getCurrentUserId();

        setCurrentUserId(
          userId
        );

        await loadTyres();

        await restoreDraft("tyre:new");

      } catch (err) {
        console.error(
          "Failed to initialize tyre history:",
          err
        );

        alert(
          "Failed to load tyre history."
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
        await getFormDraft<TyreRecordWithAttachmentName>(draftKey);

      if (draft?.draft_data) {
        setForm((current) => ({
          ...current,
          ...draft.draft_data,
          receipt: "",
        }));
        setDraftStatus("saved");
      } else {
        setDraftStatus("idle");
      }
    } catch (err) {
      console.error(
        "Failed to restore tyre draft:",
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

  useEffect(() => {
    if (!draftLoadedRef.current || skipAutosaveRef.current) {
      return;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setDraftStatus("saving");

    autosaveTimerRef.current = setTimeout(() => {
      void saveFormDraft(
        getDraftKey(),
        {
          ...form,
          receipt: "",
        }
      )
        .then(() => {
          setDraftStatus("saved");
        })
        .catch((err) => {
          console.error(
            "Failed to autosave tyre draft:",
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

  useEffect(() => {
    if (editingId !== null) {
      void restoreDraft(`tyre:${editingId}`);
    }
  }, [editingId]);

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

    setDraftStatus("saving");

    void saveFormDraft(
      getDraftKey(),
      {
        ...form,
        receipt: "",
      }
    )
      .then(() => {
        setDraftStatus("saved");
      })
      .catch((err) => {
        console.error(
          "Failed to autosave tyre draft:",
          err
        );
        setDraftStatus("error");
      });
  }



  async function loadTyres() {
    try {
      const tyres =
        await getTyres();

      setRecords(
        tyres.map((tyre) => ({
          ...tyre,
          attachment_name:
            (tyre as TyreRecordWithAttachmentName).attachment_name ?? "",
        }))
      );

    } catch (err) {
      console.error(err);

      alert(
        "Failed to load tyre records."
      );
    }
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
          r.brand
            .toLowerCase()
            .includes(text) ||

          r.model
            .toLowerCase()
            .includes(text) ||

          r.size
            .toLowerCase()
            .includes(text) ||

          r.dealer
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


  const totalInvestment =
    filtered.reduce(
      (sum, r) =>
        sum + r.cost,
      0
    );


  const currentTyre =
    filtered.length > 0
      ? [...filtered].sort(
          (a, b) =>
            new Date(
              b.installDate
            ).getTime() -
            new Date(
              a.installDate
            ).getTime()
        )[0]
      : null;


  let tyreAge = "-";


  if (currentTyre) {
    const diff =
      Date.now() -
      new Date(
        currentTyre.installDate
      ).getTime();


    const days =
      Math.floor(
        diff /
          (1000 *
            60 *
            60 *
            24)
      );


    tyreAge =
      days < 30
        ? `${days} Days`
        : `${Math.floor(
            days / 30
          )} Months`;
  }


  /* =========================================================
     START EDIT
     ========================================================= */

  function handleEdit(
    record: TyreRecordWithAttachmentName
  ) {
    /*
     * UI-side ownership protection.
     *
     * The database RLS independently
     * enforces the same rule.
     */

    if (
      record.user_id !==
      currentUserId
    ) {
      alert(
        "You can only edit your own tyre records."
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
    record: TyreRecordWithAttachmentName
  ) {
    /*
     * Only the owner can delete.
     */

    if (
      record.user_id !==
      currentUserId
    ) {
      alert(
        "You can only delete your own tyre records."
      );

      return;
    }


    if (
      !window.confirm(
        "Delete this tyre record?"
      )
    ) {
      return;
    }


    try {
      await deleteTyre(
        record.id
      );

      await loadTyres();


      alert(
        "Tyre record deleted successfully."
      );

    } catch (
      err
    ) {
      console.error(
        err
      );

      alert(
        "Delete failed."
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
        ? `tyre:${editingId}`
        : "tyre:new";

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    skipAutosaveRef.current = true;
    draftLoadedRef.current = false;

    void deleteFormDraft(draftKey).catch((err) => {
      console.error(
        "Failed to delete tyre draft:",
        err
      );
    });

    setEditingId(null);
    setForm({ ...emptyRecord });
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
      !form.brand ||
      !form.model ||
      !form.size ||
      !form.installDate
    ) {
      alert(
        "Please complete all required fields."
      );

      return;
    }


    if (
      form.purchaseDate &&
      form.purchaseDate >
        today
    ) {
      alert(
        "Purchase date cannot be in the future."
      );

      return;
    }


    if (
      form.installDate >
      today
    ) {
      alert(
        "Install date cannot be in the future."
      );

      return;
    }


    if (
      form.purchaseDate &&
      form.installDate &&
      form.purchaseDate >
        form.installDate
    ) {
      alert(
        "Purchase date cannot be after the install date."
      );

      return;
    }


    try {
      if (
        editingId !== null
      ) {
        /*
         * Extra application-side ownership check.
         *
         * The database RLS is the final authority.
         */

        if (
          form.user_id !==
          currentUserId
        ) {
          alert(
            "You can only update your own tyre records."
          );

          return;
        }


        await updateTyre({
          ...form,
          id: editingId,
        });

      } else {
        /*
         * Enforce the Free-plan tyre history limit.
         * Only records owned by the current user count.
         * Premium users have no numeric limit.
         */

        const plan = await getCurrentPlan();

        const ownTyreCount =
          currentUserId === null
            ? records.length
            : records.filter(
                (record) =>
                  record.user_id === currentUserId
              ).length;

        if (
          !canAddTyreHistory(
            ownTyreCount,
            plan
          )
        ) {
          alert(
            `The Free plan is limited to ${FREE_LIMITS.tyreHistory} tyre history records. Upgrade to Premium for ₹49 one-time to add more tyre history records.`
          );

          return;
        }

        /*
         * addTyre() assigns the current
         * authenticated user's user_id.
         */

        await addTyre(
          form
        );
      }


      const savedDraftKey =
        editingId !== null
          ? `tyre:${editingId}`
          : "tyre:new";

      await deleteFormDraft(savedDraftKey);

      skipAutosaveRef.current = true;
      draftLoadedRef.current = false;

      await loadTyres();


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


      alert(
        editingId !== null
          ? "Tyre updated successfully."
          : "Tyre added successfully."
      );

    } catch (
      err
    ) {
      console.error(
        err
      );

      alert(
        editingId !== null
          ? "Failed to update tyre."
          : "Failed to save tyre."
      );
    }
  }


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
          🛞 Tyre History
        </h2>

        <p>
          Track tyre purchases,
          warranty, dealer details
          and maintenance.
        </p>
      </div>


      {/* ======================================================
          ADD / EDIT TYRE
          ====================================================== */}

      <div className="card">
        <h3>
          {editingId !== null
            ? "Edit Tyre Record"
            : "Add Tyre Record"}
        </h3>


        <div className="formGrid">

          <div>
            <label>
              Brand
            </label>

            <input
              type="text"
              value={
                form.brand
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  brand:
                    e.target.value,
                })
              }
              placeholder="Michelin"
            />
          </div>


          <div>
            <label>
              Model
            </label>

            <input
              type="text"
              value={
                form.model
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  model:
                    e.target.value,
                })
              }
              placeholder="Primacy 4 ST"
            />
          </div>


          <div>
            <label>
              Tyre Size
            </label>

            <input
              type="text"
              value={
                form.size
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  size:
                    e.target.value,
                })
              }
              placeholder="215/55 R18"
            />
          </div>


          <div>
            <label>
              Purchase Date
            </label>

            <input
              type="date"
              value={
                form.purchaseDate
              }
              onBlur={handleAutosaveBlur}
              max={today}
              onChange={(e) =>
                setForm({
                  ...form,
                  purchaseDate:
                    e.target.value,
                })
              }
            />
          </div>


          <div>
            <label>
              Install Date
            </label>

            <input
              type="date"
              value={
                form.installDate
              }
              onBlur={handleAutosaveBlur}
              max={today}
              onChange={(e) =>
                setForm({
                  ...form,
                  installDate:
                    e.target.value,
                })
              }
            />
          </div>


          <div>
            <label>
              Odometer (km)
            </label>

            <input
              type="number"
              value={
                form.odometer === 0 ? "" : form.odometer
              }
              onBlur={handleAutosaveBlur}
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


          <div>
            <label>
              Dealer
            </label>

            <input
              type="text"
              value={
                form.dealer
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  dealer:
                    e.target.value,
                })
              }
              placeholder="Tyre Dealer"
            />
          </div>


          <div>
            <label>
              Cost (INR)
            </label>

            <input
              type="number"
              value={
                form.cost === 0 ? "" : form.cost
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  cost:
                    Number(
                      e.target.value
                    ),
                })
              }
            />
          </div>


          <div>
            <label>
              Warranty (Months)
            </label>

            <input
              type="number"
              value={
                form.warrantyMonths === 0 ? "" : form.warrantyMonths
              }
              onBlur={handleAutosaveBlur}
              onChange={(e) =>
                setForm({
                  ...form,
                  warrantyMonths:
                    Number(
                      e.target.value
                    ),
                })
              }
            />
          </div>

        </div>


        <p
          style={{
            fontSize:
              "12px",
            color:
              "#6b7280",
            marginTop:
              "8px",
          }}
        >
          Purchase and installation
          dates cannot be in the
          future.
        </p>


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
          Invoice / Receipt
        </label>


        <ReceiptUploader
          value={form.receipt}
          fileName={form.attachment_name}
          onChange={(receipt) => {
            setForm({
              ...form,
              receipt,
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
          className="primaryButton"
          onClick={() =>
            void handleSave()
          }
        >
          {editingId !== null
            ? "Update Tyre"
            : "Add Tyre"}
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


      {/* ======================================================
          KPIs
          ====================================================== */}

      <div className="kpiGrid">

        <div className="kpiCard">
          <h3>
            Total Tyre Records
          </h3>

          <h2>
            {
              filtered.length
            }
          </h2>
        </div>


        <div className="kpiCard">
          <h3>
            Total Investment
          </h3>

          <h2>
            ₹{" "}
            {
              totalInvestment.toFixed(
                2
              )
            }
          </h2>
        </div>


        <div className="kpiCard">
          <h3>
            Current Tyre
          </h3>

          <h2>
            {currentTyre
              ? currentTyre.brand
              : "-"}
          </h2>
        </div>


        <div className="kpiCard">
          <h3>
            Tyre Age
          </h3>

          <h2>
            {tyreAge}
          </h2>
        </div>

      </div>


      {/* ======================================================
          TYRE RECORDS
          ====================================================== */}

      <div className="card">

        <input
          type="text"
          placeholder="Search by brand, model, dealer or size..."
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
                  Brand
                </th>

                <th>
                  Model
                </th>

                <th>
                  Size
                </th>

                <th>
                  Installed
                </th>

                <th>
                  Odometer
                </th>

                <th>
                  Cost
                </th>

                <th>
                  Warranty
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
                  <td
                    colSpan={10}
                  >
                    No tyre records
                    found.
                  </td>
                </tr>

              ) : (

                filtered.map(
                  (
                    record,
                    index
                  ) => {

                    /*
                     * OWNERSHIP CHECK
                     *
                     * Family records are visible,
                     * but only the record owner
                     * gets Edit/Delete.
                     */

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
                            record.brand
                          }
                        </td>


                        <td>
                          {
                            record.model
                          }
                        </td>


                        <td>
                          {
                            record.size
                          }
                        </td>


                        <td>
                          {
                            record.installDate
                          }
                        </td>


                        <td>
                          {
                            record.odometer.toLocaleString()
                          }{" "}
                          km
                        </td>


                        <td>
                          ₹{" "}
                          {
                            record.cost.toLocaleString()
                          }
                        </td>


                        <td>
                          {
                            record.warrantyMonths
                          }{" "}
                          Months
                        </td>


                        <td>
                          {record.receipt ? (

                            <>


                            <a
                              href={
                                record.receipt
                              }
                              download={record.attachment_name || `${record.brand}-${record.model}-Receipt`}
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