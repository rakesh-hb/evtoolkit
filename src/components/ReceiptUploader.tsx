import { useRef } from "react";

import { supabase } from "../lib/supabase";
import { getCurrentPlan } from "../services/subscriptionService";

interface Props {
  value?: string;
  fileName?: string;
  onChange: (value: string) => void;
  onFileNameChange?: (fileName: string) => void;
  onAttachmentChange?: (value: string, fileName: string) => void;
}

const STORAGE_BUCKET = "premium_plus_attachments";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_");
}

export default function ReceiptUploader({
  value,
  fileName,
  onChange,
  onFileNameChange,
  onAttachmentChange,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("The selected file is larger than 5 MB.");
      if (fileRef.current) {
        fileRef.current.value = "";
      }
      return;
    }

    try {
      const plan = await getCurrentPlan();

      /*
       * Premium Plus attachments are stored in private
       * Supabase Storage. Free and Premium keep the existing
       * Base64/Data URL behavior for backward compatibility.
       */
      if (plan === "premium_plus") {
        const {
          data: {
            user,
          },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error(
            "Unable to identify the current user."
          );
        }

        const safeFileName =
          sanitizeFileName(file.name) ||
          "attachment";

        const storagePath =
          `${user.id}/${crypto.randomUUID()}-${safeFileName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, file, {
            contentType:
              file.type || "application/octet-stream",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        /*
         * Pass the storage path and filename together so the
         * parent can update both attachment fields atomically.
         */
        if (onAttachmentChange) {
          onAttachmentChange(storagePath, file.name);
        } else {
          onChange(storagePath);
          onFileNameChange?.(file.name);
        }

        if (fileRef.current) {
          fileRef.current.value = "";
        }

        return;
      }

      /*
       * Existing behavior for Free and Premium users.
       */
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result as string;

        if (onAttachmentChange) {
          onAttachmentChange(dataUrl, file.name);
        } else {
          onChange(dataUrl);
          onFileNameChange?.(file.name);
        }

        if (fileRef.current) {
          fileRef.current.value = "";
        }
      };

      reader.onerror = () => {
        console.error("Failed to read the selected file.");
        alert("Failed to read the selected file.");

        if (fileRef.current) {
          fileRef.current.value = "";
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(
        "Failed to upload attachment:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload attachment."
      );

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
        onChange={handleFile}
      />

      {value && (
        <div
          style={{
            marginTop: 12,
          }}
        >
          <small>
            Attachment added ✓
          </small>

          {fileName && (
            <div
              style={{
                marginTop: 4,
                wordBreak: "break-word",
              }}
            >
              <small>
                📎 {fileName}
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
