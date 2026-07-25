import { useEffect, useMemo, useState } from "react";
import type { TyreRecord } from "../types/tyre";

const STORAGE_KEY = "evtoolkit_tyres";

export function useTyres() {
  const [tyres, setTyres] = useState<TyreRecord[]>([]);
  const [search, setSearch] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      setTyres(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to load tyre history:", err);
      setTyres([]);
    }
  }, []);

  // Save whenever tyres change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tyres));
  }, [tyres]);

  // Add
  const addTyre = (record: TyreRecord) => {
    setTyres((prev) =>
      [...prev, record].sort(
        (a, b) =>
          new Date(b.installDate).getTime() -
          new Date(a.installDate).getTime()
      )
    );
  };

  // Update
  const updateTyre = (record: TyreRecord) => {
    setTyres((prev) =>
      prev
        .map((item) => (item.id === record.id ? record : item))
        .sort(
          (a, b) =>
            new Date(b.installDate).getTime() -
            new Date(a.installDate).getTime()
        )
    );
  };

  // Delete
  const deleteTyre = (id: number) => {
    setTyres((prev) => prev.filter((item) => item.id !== id));
  };

  // Search
  const filteredTyres = useMemo(() => {
    if (!search.trim()) return tyres;

    const keyword = search.toLowerCase();

    return tyres.filter((item) =>
      [
        item.brand,
        item.model,
        item.size,
        item.dealer,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [search, tyres]);

  return {
    tyres,
    filteredTyres,
    search,
    setSearch,
    addTyre,
    updateTyre,
    deleteTyre,
  };
}