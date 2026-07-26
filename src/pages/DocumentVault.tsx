import { useEffect, useMemo, useState } from "react";
import type { DocumentRecord } from "../types/document";
import {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../services/documentVaultService";

import { vehicles } from "../data/vehicles";
import ReceiptUploader from "../components/ReceiptUploader";

const emptyRecord: DocumentRecord = {
  id: 0,
  title: "",
  category: "",
  vehicle: "",
  documentDate: "",
  file: "",
  notes: "",
};

export default function DocumentVault() {
  const [records, setRecords] = useState<DocumentRecord[]>([]);
  const [form, setForm] = useState<DocumentRecord>(emptyRecord);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  async function loadDocuments() {
    try {
      const data = await getDocuments();
      setRecords(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load documents.");
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  const filtered = useMemo(() => {
    const text = search.toLowerCase();

    return records.filter(
      (r) =>
        r.title.toLowerCase().includes(text) ||
        r.category.toLowerCase().includes(text) ||
        r.vehicle.toLowerCase().includes(text) ||
        (r.notes ?? "").toLowerCase().includes(text)
    );
  }, [records, search]);

  const totalDocuments = filtered.length;

  return (
    <>
  <div className="welcome">
    <h2>📁 Document Vault</h2>
    <p>
      Store and manage all your vehicle-related documents in one place.
    </p>
  </div>

  <div className="card">

    <h3>
      {editingId !== null
        ? "Edit Document"
        : "Add Document"}
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
        <label>Category</label>

        <select
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
        >
          <option value="">Select Category</option>
          <option>Registration Certificate (RC)</option>
          <option>Insurance</option>
          <option>Driving Licence</option>
          <option>Purchase Invoice</option>
          <option>Warranty</option>
          <option>Service Record</option>
          <option>Tyre Invoice</option>
          <option>Charging</option>
          <option>FASTag</option>
          <option>Loan</option>
          <option>Pollution Certificate</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label>Document Title</label>

        <input
          type="text"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          placeholder="Insurance Policy 2026"
        />
      </div>

      <div>
        <label>Document Date</label>

        <input
          type="date"
          value={form.documentDate}
          onChange={(e) =>
            setForm({
              ...form,
              documentDate: e.target.value,
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

    <label>Attachment</label>

    <ReceiptUploader
      value={form.file}
      onChange={(file) =>
        setForm({
          ...form,
          file,
        })
      }
    />

    <p
      style={{
        fontSize: 12,
        color: "#666",
        marginTop: 8,
      }}
    >
      You can upload PDF, images, Word, Excel and other document formats.
      Recommended maximum file size: <strong>5 MB</strong>.
    </p>

    <br />

    <button
      className="saveButton"
      onClick={async () => {
        if (
          !form.vehicle ||
          !form.category ||
          !form.title ||
          !form.documentDate
        ) {
          alert("Please complete all required fields.");
          return;
        }

        try {
          if (editingId !== null) {
            await updateDocument({
              ...form,
              id: editingId,
            });

            alert("Document updated successfully.");
          } else {
            const { id, ...newDocument } = form;

            await addDocument(newDocument);

            alert("Document added successfully.");
          }

          await loadDocuments();

          setEditingId(null);
          setForm(emptyRecord);

        } catch (error) {
          console.error(error);
          alert("Failed to save document.");
        }
      }}
    >
      {editingId !== null
        ? "Update Document"
        : "Add Document"}
    </button>

  </div>

  <div className="kpiGrid">

    <div className="kpiCard">
      <h3>Total Documents</h3>
      <h2>{totalDocuments}</h2>
    </div>

    <div className="kpiCard">
      <h3>Categories</h3>
      <h2>
        {new Set(filtered.map((d) => d.category)).size}
      </h2>
    </div>

    <div className="kpiCard">
      <h3>Vehicles</h3>
      <h2>
        {new Set(filtered.map((d) => d.vehicle)).size}
      </h2>
    </div>

  </div>

  <div className="card">

    <input
      type="text"
      placeholder="Search documents..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <div className="tableContainer">

      <table className="table">

        <thead>

          <tr>
            <th>#</th>
            <th>Vehicle</th>
            <th>Category</th>
            <th>Title</th>
            <th>Date</th>
            <th>Attachment</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

        {filtered.length === 0 ? (

<tr>
  <td colSpan={7}>
    No documents found.
  </td>
</tr>

) : (

filtered.map((record, index) => (

  <tr key={record.id}>

    <td>{index + 1}</td>

    <td>{record.vehicle}</td>

    <td>{record.category}</td>

    <td>{record.title}</td>

    <td>{record.documentDate}</td>

    <td>
  {record.file ? (
    <a
    href={record.file}
    download={record.title}
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
                "Delete this document?"
              )
            ) {
              return;
            }

            try {

              await deleteDocument(record.id);

              await loadDocuments();

              alert(
                "Document deleted successfully."
              );

            } catch (err) {

              console.error(err);

              alert(
                "Failed to delete document."
              );

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