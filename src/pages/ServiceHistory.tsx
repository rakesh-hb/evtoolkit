import { useEffect, useMemo, useState } from "react";
import type { ServiceRecord } from "../types/service";
import {
  getServiceRecords,
  addServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
} from "../services/serviceHistoryService";

import { vehicles } from "../data/vehicles";
import ReceiptUploader from "../components/ReceiptUploader";


const emptyRecord: ServiceRecord = {
  id: 0,
  vehicle: "",
  date: "",
  odometer: 0,
  serviceType: "",
  serviceCenter: "",
  amount: 0,
  //nextServiceKm: 0,
  //nextServiceDate: "",
  notes: "",
  attachment: "",
};

export default function ServiceHistory() {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [form, setForm] = useState<ServiceRecord>(emptyRecord);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadRecords() {
    try {
      const data = await getServiceRecords();
      setRecords(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load service history.");
    }
  }
  
  useEffect(() => {
    loadRecords();
  }, []);

  const filtered = useMemo(() => {
    const text = search.toLowerCase();

    return records.filter(
      (r) =>
        r.serviceType.toLowerCase().includes(text) ||
        r.serviceCenter.toLowerCase().includes(text) ||
        (r.notes ?? "").toLowerCase().includes(text)
    );
  }, [records, search]);

  const totalCost = filtered.reduce(
    (sum, r) => sum + r.amount,
    0
  );

  return (
    <>
      <div className="welcome">
        <h2>🔧 Service History</h2>
        <p>Track maintenance and servicing of your EV.</p>
      </div>

      <div className="card">


<h3>
  {editingId !== null
    ? "Edit Service Record"
    : "Add Service Record"}
</h3>

  <div className="formGrid">

    <div>
      <label>Date</label>
      <input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />
    </div>

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
      <label>Odometer (km)</label>
      <input
        type="number"
        value={form.odometer}
        onChange={(e) =>
          setForm({
            ...form,
            odometer: Number(e.target.value),
          })
        }
      />
    </div>

    <div>
      <label>Service Type</label>

      <select
        value={form.serviceType}
        onChange={(e) =>
          setForm({
            ...form,
            serviceType: e.target.value,
          })
        }
      >
        <option value="">Select</option>
        <option>Regular Service</option>
        <option>Battery Check</option>
        <option>Brake Service</option>
        <option>Coolant Change</option>
        <option>Software Update</option>
        <option>Tyre Rotation</option>
        <option>Wheel Alignment</option>
        <option>General Inspection</option>
        <option>Other</option>
      </select>
    </div>

    <div>
      <label>Service Centre</label>
      <input
        value={form.serviceCenter}
        onChange={(e) =>
          setForm({
            ...form,
            serviceCenter: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label>Amount (INR)</label>
      <input
        type="number"
        value={form.amount}
        onChange={(e) =>
          setForm({
            ...form,
            amount: Number(e.target.value),
          })
        }
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
  <label>Invoice / Receipt</label>

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
  Supported file types: PDF, images, and other document formats. Recommended
  maximum file size: <strong>5 MB</strong> per file for optimal performance.
</p>

  <br />

  <button
  className="saveButton"
  onClick={async () => {
    if (
      !form.vehicle ||
      !form.date ||
      !form.serviceType ||
      !form.serviceCenter
    ) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      if (editingId !== null) {
        await updateServiceRecord({
          ...form,
          id: editingId,
        });

        alert("Service updated successfully.");
      } else {
        const { id, ...newRecord } = form;
await addServiceRecord(newRecord);

        alert("Service record added successfully.");
      }

      await loadRecords();

      setEditingId(null);
      setForm(emptyRecord);
    } catch (error: any) {
      console.error("Supabase error:", error);
    
      alert(
        error?.message ||
        error?.details ||
        error?.hint ||
        JSON.stringify(error)
      );
    }
  }}
>
  {editingId !== null
    ? "Update Service"
    : "Add Service Record"}
</button>

</div>

      <div className="kpiGrid">

        <div className="kpiCard">
          <h3>Total Services</h3>
          <h2>{filtered.length}</h2>
        </div>

        <div className="kpiCard">
          <h3>Total Cost</h3>
          <h2>INR {totalCost.toFixed(2)}</h2>
        </div>

      </div>

      <div className="card">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

<div className="tableContainer">
  
</div>
        <table className="table">

        <thead>
  <tr>
    <th>Date</th>
    <th>Type</th>
    <th>Centre</th>
    <th>Cost</th>
    <th>Receipt</th>
    <th>Actions</th>
  </tr>
</thead>

          <tbody>

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  No service records found.
                </td>
              </tr>
            ) : (
              filtered.map((record) => (
                <tr key={record.id}>

  <td>{record.date}</td>

  <td>{record.serviceType}</td>

  <td>{record.serviceCenter}</td>

  <td>INR {record.amount.toFixed(2)}</td>

  <td>
  {record.attachment ? (
    <a
      href={record.attachment}
      download={`${record.vehicle}-${record.serviceType}-Receipt`}
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

    {" "}

    <button
  className="deleteButton"
  onClick={async () => {
    if (!window.confirm("Delete this service record?")) {
      return;
    }
  
    try {
      await deleteServiceRecord(record.id);
      await loadRecords();
  
      alert("Service record deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete service record.");
    }
  }}
    >
      Delete
    </button>
    </div>
  </td>

</tr>
              ))
            )}

          </tbody>

        </table>

      </div>
    </>
  );
}