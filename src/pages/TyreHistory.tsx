import { useEffect, useMemo, useState } from "react";
import type { TyreRecord } from "../types/tyre";
//import { supabase } from "../lib/supabase";
import ReceiptUploader from "../components/ReceiptUploader";

import {
  getTyres,
  addTyre,
  updateTyre,
  deleteTyre,
} from "../services/tyreService";


const emptyRecord: TyreRecord = {
  id: 0,
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

  notes: "",

  createdAt: "",
  updatedAt: "",
};

export default function TyreHistory() {
  const [records, setRecords] =
    useState<TyreRecord[]>([]);

  const [form, setForm] =
    useState<TyreRecord>(emptyRecord);

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

    useEffect(() => {
      loadTyres();
    }, []);
    
    async function loadTyres() {
      try {
        const tyres = await getTyres();
        setRecords(tyres);
      } catch (err) {
        console.error(err);
        alert("Failed to load tyre records.");
      }
    }

  const filtered = useMemo(() => {
    const text = search.toLowerCase();

    return records.filter(
      (r) =>
        r.brand.toLowerCase().includes(text) ||
        r.model.toLowerCase().includes(text) ||
        r.size.toLowerCase().includes(text) ||
        r.dealer.toLowerCase().includes(text) ||
        (r.notes ?? "")
          .toLowerCase()
          .includes(text)
    );
  }, [records, search]);

  const totalInvestment = filtered.reduce(
    (sum, r) => sum + r.cost,
    0
  );

  const currentTyre =
    filtered.length > 0
      ? [...filtered].sort(
          (a, b) =>
            new Date(b.installDate).getTime() -
            new Date(a.installDate).getTime()
        )[0]
      : null;

  let tyreAge = "-";

  if (currentTyre) {
    const diff =
      Date.now() -
      new Date(
        currentTyre.installDate
      ).getTime();

    const days = Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );

    tyreAge =
      days < 30
        ? `${days} Days`
        : `${Math.floor(days / 30)} Months`;
  }

  return (
    <>
      <div className="welcome">
        <h2>🛞 Tyre History</h2>

        <p>
          Track tyre purchases, warranty,
          dealer details and maintenance.
        </p>
      </div>

      <div className="card">

        <h3>
          {editingId
            ? "Edit Tyre Record"
            : "Add Tyre Record"}
        </h3>
        <div className="formGrid">

<div>
  <label>Brand</label>
  <input
    type="text"
    value={form.brand}
    onChange={(e) =>
      setForm({
        ...form,
        brand: e.target.value,
      })
    }
    placeholder="Michelin"
  />
</div>

<div>
  <label>Model</label>
  <input
    type="text"
    value={form.model}
    onChange={(e) =>
      setForm({
        ...form,
        model: e.target.value,
      })
    }
    placeholder="Primacy 4 ST"
  />
</div>

<div>
  <label>Tyre Size</label>
  <input
    type="text"
    value={form.size}
    onChange={(e) =>
      setForm({
        ...form,
        size: e.target.value,
      })
    }
    placeholder="215/55 R18"
  />
</div>

<div>
  <label>Purchase Date</label>
  <input
    type="date"
    value={form.purchaseDate}
    onChange={(e) =>
      setForm({
        ...form,
        purchaseDate: e.target.value,
      })
    }
  />
</div>

<div>
  <label>Install Date</label>
  <input
    type="date"
    value={form.installDate}
    onChange={(e) =>
      setForm({
        ...form,
        installDate: e.target.value,
      })
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
  <label>Dealer</label>
  <input
    type="text"
    value={form.dealer}
    onChange={(e) =>
      setForm({
        ...form,
        dealer: e.target.value,
      })
    }
    placeholder="Tyre Dealer"
  />
</div>

<div>
  <label>Cost (INR)</label>
  <input
    type="number"
    value={form.cost}
    onChange={(e) =>
      setForm({
        ...form,
        cost: Number(e.target.value),
      })
    }
  />
</div>

<div>
  <label>Warranty (Months)</label>
  <input
    type="number"
    value={form.warrantyMonths}
    onChange={(e) =>
      setForm({
        ...form,
        warrantyMonths: Number(e.target.value),
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
value={form.receipt}
onChange={(receipt) =>
  setForm({
    ...form,
    receipt,
  })
}
/>

<br /> 
<button
  className="primaryButton"
  onClick={async () => {

    if (
      !form.brand ||
      !form.model ||
      !form.size ||
      !form.installDate
    ) {
      alert("Please complete all required fields.");
      return;
    }

    try {

      if (editingId !== null) {

        await updateTyre({
          ...form,
          id: editingId,
        });

      } else {

        await addTyre(form);

      }

      await loadTyres();

      setEditingId(null);

      setForm(emptyRecord);

    } catch (err) {

      console.error(err);

      alert("Failed to save tyre.");

    }

  }}
>
          {editingId !== null
            ? "Update Tyre"
            : "Add Tyre"}
        </button>

      </div>

      <div className="kpiGrid">

        <div className="kpiCard">
          <h3>Total Tyre Records</h3>
          <h2>{filtered.length}</h2>
        </div>

        <div className="kpiCard">
          <h3>Total Investment</h3>
          <h2>₹ {totalInvestment.toFixed(2)}</h2>
        </div>

        <div className="kpiCard">
          <h3>Current Tyre</h3>
          <h2>
            {currentTyre
              ? currentTyre.brand
              : "-"}
          </h2>
        </div>

        <div className="kpiCard">
          <h3>Tyre Age</h3>
          <h2>{tyreAge}</h2>
        </div>

      </div>
      <div className="card">

<input
  type="text"
  placeholder="Search by brand, model, dealer or size..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<div className="tableContainer">

  <table className="table">

    <thead>

      <tr>
        <th>#</th>
        <th>Brand</th>
        <th>Model</th>
        <th>Size</th>
        <th>Installed</th>
        <th>Odometer</th>
        <th>Cost</th>
        <th>Warranty</th>
        <th>Receipt</th>
        <th>Actions</th>
      </tr>

    </thead>

    <tbody>

      {filtered.length === 0 ? (

        <tr>
          <td colSpan={10}>
            No tyre records found.
          </td>
        </tr>

      ) : (

        filtered.map((record, index) => (

          <tr key={record.id}>

            <td>{index + 1}</td>

            <td>{record.brand}</td>

            <td>{record.model}</td>

            <td>{record.size}</td>

            <td>{record.installDate}</td>

            <td>{record.odometer.toLocaleString()} km</td>

            <td>₹ {record.cost.toLocaleString()}</td>

            <td>{record.warrantyMonths} Months</td>

            <td>

              {record.receipt ? (

                <a
                  href={record.receipt}
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
  <div className="actionButtons">

    <button
      className="editButton"
      onClick={async () => {
        setEditingId(record.id);
        setForm(record);
      }}
    >
      Edit
    </button>

    <button
  className="deleteButton"
  onClick={async () => {

    if (!window.confirm("Delete this tyre record?")) {
      return;
    }

    try {

      await deleteTyre(record.id);

      await loadTyres();

    } catch (err) {

      console.error(err);

      alert("Delete failed");

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

</div>

</>
);

}