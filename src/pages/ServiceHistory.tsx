import { useEffect, useMemo, useState } from "react";
import type { ServiceRecord } from "../types/service";
import { test, loadData, saveData } from "../utils/storage";

console.log(test);

import ReceiptUploader from "../components/ReceiptUploader";

const STORAGE_KEY = "serviceHistory";

const emptyRecord: ServiceRecord = {
  id: 0,
  date: "",
  odometer: 0,
  serviceType: "",
  serviceCenter: "",
  amount: 0,
  nextServiceKm: 0,
  nextServiceDate: "",
  notes: "",
  attachment: "",
};

export default function ServiceHistory() {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [form, setForm] = useState<ServiceRecord>(emptyRecord);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    setRecords(loadData<ServiceRecord[]>(STORAGE_KEY, []));
  }, []);

  useEffect(() => {
    saveData(STORAGE_KEY, records);
  }, [records]);

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

  <h3>Add Service Record</h3>

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

    <div>
      <label>Next Service (km)</label>
      <input
        type="number"
        value={form.nextServiceKm}
        onChange={(e) =>
          setForm({
            ...form,
            nextServiceKm: Number(e.target.value),
          })
        }
      />
    </div>

    <div>
      <label>Next Service Date</label>
      <input
        type="date"
        value={form.nextServiceDate}
        onChange={(e) =>
          setForm({
            ...form,
            nextServiceDate: e.target.value,
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

  <br />

  <button
  onClick={() => {

    if (
      !form.date ||
      !form.serviceType ||
      !form.serviceCenter
    ) {
      alert("Please complete all required fields.");
      return;
    }

    if (editingId !== null) {

      setRecords(
        records.map((r) =>
          r.id === editingId
            ? { ...form, id: editingId }
            : r
        )
      );

      setEditingId(null);

    } else {

      setRecords([
        ...records,
        {
          ...form,
          id: Date.now(),
        },
      ]);

    }

    setForm(emptyRecord);

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
        target="_blank"
        rel="noopener noreferrer"
      >
        View
      </a>
    ) : (
      "-"
    )}
  </td>

  <td>

    <button
      onClick={() => {

        setEditingId(record.id);

        setForm(record);

      }}
    >
      Edit
    </button>

    {" "}

    <button
      onClick={() => {

        if (
          window.confirm(
            "Delete this service record?"
          )
        ) {

          setRecords(
            records.filter(
              (r) => r.id !== record.id
            )
          );

        }

      }}
    >
      Delete
    </button>

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