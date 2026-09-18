import {
    useCallback,
    useEffect,
    useRef,
    useState,
  } from "react";
  import {
    deleteFormDraft,
    getFormDraft,
    saveFormDraft,
  } from "../services/draftService";
  
  export type AutosaveStatus =
    | "idle"
    | "loading"
    | "saving"
    | "saved"
    | "error";
  
  interface UseAutosaveDraftOptions<T> {
    formKey: string;
    draftKey: string;
    data: T;
    onRestore: (draftData: T) => void;
    enabled?: boolean;
    debounceMs?: number;
  }
  
  export function useAutosaveDraft<T>({
    formKey,
    draftKey,
    data,
    onRestore,
    enabled = true,
    debounceMs = 1000,
  }: UseAutosaveDraftOptions<T>) {
    const [status, setStatus] = useState<AutosaveStatus>(
      enabled ? "loading" : "idle"
    );
  
    const dataRef = useRef(data);
    const hydratedRef = useRef(false);
    const restoringRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mountedRef = useRef(true);
  
    dataRef.current = data;
  
    const saveNow = useCallback(async () => {
      if (!enabled || !hydratedRef.current || restoringRef.current) {
        return;
      }
  
      if (mountedRef.current) {
        setStatus("saving");
      }
  
      try {
        await saveFormDraft(formKey, draftKey, dataRef.current);
  
        if (mountedRef.current) {
          setStatus("saved");
        }
      } catch (error) {
        console.error("Autosave failed:", error);
  
        if (mountedRef.current) {
          setStatus("error");
        }
      }
    }, [draftKey, enabled, formKey]);
  
    const clearDraft = useCallback(async () => {
      if (!enabled) return;
  
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
  
      try {
        await deleteFormDraft(formKey, draftKey);
  
        if (mountedRef.current) {
          setStatus("idle");
        }
      } catch (error) {
        console.error("Could not clear form draft:", error);
        throw error;
      }
    }, [draftKey, enabled, formKey]);
  
    useEffect(() => {
      mountedRef.current = true;
  
      if (!enabled) {
        setStatus("idle");
        return () => {
          mountedRef.current = false;
        };
      }
  
      hydratedRef.current = false;
      restoringRef.current = false;
      setStatus("loading");
  
      let cancelled = false;
  
      async function loadDraft() {
        try {
          const draft = await getFormDraft<T>(formKey, draftKey);
  
          if (cancelled) return;
  
          if (draft?.draft_data != null) {
            restoringRef.current = true;
            onRestore(draft.draft_data);
  
            // Allow the parent state update caused by onRestore to complete
            // before autosave becomes active.
            setTimeout(() => {
              restoringRef.current = false;
              hydratedRef.current = true;
  
              if (mountedRef.current) {
                setStatus("saved");
              }
            }, 0);
          } else {
            hydratedRef.current = true;
            setStatus("idle");
          }
        } catch (error) {
          console.error("Could not load form draft:", error);
  
          if (!cancelled && mountedRef.current) {
            hydratedRef.current = true;
            setStatus("error");
          }
        }
      }
  
      loadDraft();
  
      return () => {
        cancelled = true;
        mountedRef.current = false;
  
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [draftKey, enabled, formKey, onRestore]);
  
    useEffect(() => {
      if (!enabled || !hydratedRef.current || restoringRef.current) {
        return;
      }
  
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
  
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void saveNow();
      }, debounceMs);
  
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [data, debounceMs, enabled, saveNow]);
  
    return {
      status,
      saveNow,
      clearDraft,
      isSaving: status === "saving",
      isSaved: status === "saved",
      hasError: status === "error",
    };
  }
  