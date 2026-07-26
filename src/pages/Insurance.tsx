import { useEffect, useMemo, useState } from "react";
import type { InsuranceRecord } from "../types/insurance";

import {
  getInsurance,
  addInsurance,
  updateInsurance,
  deleteInsurance,
} from "../services/insuranceService";

import { vehicles } from "../data/vehicles";
import ReceiptUploader from "../components/ReceiptUploader";

const emptyPolicy: InsuranceRecord = {
  id: 0,

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
};

export default function Insurance() {
  const [records, setRecords] =
    useState<InsuranceRecord[]>([]);

  const [form, setForm] =
    useState<InsuranceRecord>(emptyPolicy);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadPolicies();
  }, []);

  async function loadPolicies() {
    try {
      const data = await getInsurance();
      setRecords(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load insurance policies.");
    }
  }

  const filtered = useMemo(() => {
    const text = search.toLowerCase();

    return records.filter(
      (r) =>
        r.vehicle.toLowerCase().includes(text) ||
        r.company.toLowerCase().includes(text) ||
        r.policy_number.toLowerCase().includes(text) ||
        r.policy_type.toLowerCase().includes(text) ||
        (r.notes ?? "").toLowerCase().includes(text)
    );
  }, [records, search]);

  const totalPremium = filtered.reduce(
    (sum, r) => sum + r.premium,
    0
  );

  const activePolicies = filtered.filter(
    (r) =>
      new Date(r.expiry_date) >= new Date()
  ).length;

  function getStatus(expiry: string) {
    const today = new Date();

    const expiryDate = new Date(expiry);

    const diff = Math.ceil(
      (expiryDate.getTime() -
        today.getTime()) /
        (1000 * 60 * 60 * 24)
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

  return (
    <>
      <div className="welcome">
        <h2>🛡 Insurance</h2>

        <p>
          Manage insurance policies,
          renewals and policy documents.
        </p>
      </div>

      <div className="card">

        <h3>
          {editingId !== null
            ? "Edit Insurance Policy"
            : "Add Insurance Policy"}
        </h3>

        <div className="formGrid">

        <div>
  <label>Vehicle</label>

  <select
    value={form.vehicle}
    onChange={(e) =>
      setForm({
        ...form,
        vehicle: e.target.value,
      })
    }
    disabled={editingId !== null}
  >
    <option value="">Select Vehicle</option>

    {vehicles.map((vehicle) => (
      <option
        key={`${vehicle.country}-${vehicle.id}`}
        value={`${vehicle.brand} ${vehicle.model}`}
      >
        {vehicle.brand} {vehicle.model}
      </option>
    ))}
  </select>
</div>

<div>
  <label>Insurance Company</label>

  <input
    type="text"
    value={form.company}
    onChange={(e) =>
      setForm({
        ...form,
        company: e.target.value,
      })
    }
    placeholder="ICICI Lombard"
  />
</div>

<div>
  <label>Policy Number</label>

  <input
    type="text"
    value={form.policy_number}
    onChange={(e) =>
      setForm({
        ...form,
        policy_number: e.target.value,
      })
    }
    placeholder="Policy Number"
  />
</div>

<div>
  <label>Policy Type</label>

  <select
    value={form.policy_type}
    onChange={(e) =>
      setForm({
        ...form,
        policy_type: e.target.value,
      })
    }
  >
    <option>Comprehensive</option>
    <option>Third Party</option>
    <option>Own Damage</option>
    <option>Zero Depreciation</option>
  </select>
</div>

<div>
  <label>Policy Start Date</label>

  <input
    type="date"
    value={form.start_date}
    onChange={(e) =>
      setForm({
        ...form,
        start_date: e.target.value,
      })
    }
  />
</div>

<div>
  <label>Policy Expiry Date</label>

  <input
    type="date"
    value={form.expiry_date}
    onChange={(e) =>
      setForm({
        ...form,
        expiry_date: e.target.value,
      })
    }
  />
</div>

<div>
  <label>Premium (₹)</label>

  <input
    type="number"
    value={form.premium}
    onChange={(e) =>
      setForm({
        ...form,
        premium: Number(e.target.value),
      })
    }
  />
</div>

<div>
  <label>IDV (₹)</label>

  <input
    type="number"
    value={form.idv}
    onChange={(e) =>
      setForm({
        ...form,
        idv: Number(e.target.value),
      })
    }
  />
</div>


<div>
  <label>Add-ons</label>

  <input
    type="text"
    value={form.addons}
    onChange={(e) =>
      setForm({
        ...form,
        addons: e.target.value,
      })
    }
    placeholder="Zero Dep, RSA, Engine Protect"
  />
</div>

<div>
  <label>Agent / Broker</label>

  <input
    type="text"
    value={form.agent}
    onChange={(e) =>
      setForm({
        ...form,
        agent: e.target.value,
      })
    }
    placeholder="Agent Name"
  />
</div>

<div>
  <label>Contact Number</label>

  <input
    type="text"
    value={form.contact_number}
    onChange={(e) =>
      setForm({
        ...form,
        contact_number: e.target.value,
      })
    }
    placeholder="9876543210"
  />
</div>


</div>

<label>Notes</label>

<textarea
  rows={3}
  value={form.notes}
  onChange={(e) =>
    setForm({
      ...form,
      notes: e.target.value,
    })
  }
/>

<br />

<label>Policy Document</label>

<ReceiptUploader
  value={form.attachment}
  onChange={(attachment) =>
    setForm({
      ...form,
      attachment,
    })
  }
/>

<p
  style={{
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "6px",
  }}
>
  Upload your insurance policy (PDF or image).
  Recommended maximum file size:
  <strong> 5 MB</strong>.
</p>

<br />

<button
  className="saveButton"
  onClick={async () => {

    if (
      !form.vehicle ||
      !form.company ||
      !form.policy_number ||
      !form.start_date ||
      !form.expiry_date
    ) {
      alert("Please complete all required fields.");
      return;
    }

    try {

      if (editingId !== null) {

        await updateInsurance(
          editingId,
          form
        );

        alert("Insurance policy updated successfully.");

      } else {

        const { id, ...newPolicy } = form;

        await addInsurance(
          newPolicy as InsuranceRecord
        );

        alert("Insurance policy added successfully.");

      }

      await loadPolicies();

      setEditingId(null);

      setForm(emptyPolicy);

    } catch (err) {

      console.error(err);

      alert("Failed to save insurance policy.");

    }

  }}
>
  {editingId !== null
    ? "Update Policy"
    : "Add Insurance Policy"}
</button>

</div>

<div className="kpiGrid">

  <div className="kpiCard">
    <h3>Total Policies</h3>
    <h2>{filtered.length}</h2>
  </div>

  <div className="kpiCard">
    <h3>Active Policies</h3>
    <h2>{activePolicies}</h2>
  </div>

  <div className="kpiCard">
    <h3>Total Premium</h3>
    <h2>₹ {totalPremium.toLocaleString("en-IN")}</h2>
  </div>

</div>

<div className="card">

  <input
    type="text"
    placeholder="Search by company, vehicle or policy number..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
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

      {filtered.length === 0 ? (

<tr>
  <td colSpan={9}>
    No insurance policies found.
  </td>
</tr>

) : (

filtered.map((record, index) => {

  const status = getStatus(record.expiry_date);

  return (

    <tr key={record.id}>

      <td>{index + 1}</td>

      <td>{record.vehicle}</td>

      <td>{record.company}</td>

      <td>{record.policy_number}</td>

      <td>{record.expiry_date}</td>

      <td>
        <span
          style={{
            color: status.color,
            fontWeight: 600,
          }}
        >
          {status.text}
        </span>
      </td>

      <td>
        ₹ {record.premium.toLocaleString("en-IN")}
      </td>

      <td>
        {record.attachment ? (
          <a
            href={record.attachment}
            download={`${record.company}-Insurance`}
            className="downloadButton"
          >
            ⬇ Download
          </a>
        ) : (
          "-"
        )}
      </td>

      <td>

        <div className="actionButtons">

          <button
            className="editButton"
            onClick={() => {

              setEditingId(record.id);

              setForm(record);

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });

            }}
          >
            Edit
          </button>

          <button
            className="deleteButton"
            onClick={async () => {

              if (
                !window.confirm(
                  "Delete this insurance policy?"
                )
              ) {
                return;
              }

              try {

                await deleteInsurance(record.id);

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

            }}
          >
            Delete
          </button>

        </div>

      </td>

    </tr>

  );

})

)}

    </tbody>

  </table>

</div>

</div>

  </>
);
}

