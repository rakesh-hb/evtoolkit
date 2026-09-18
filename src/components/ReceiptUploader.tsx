import { useRef } from "react";

interface Props {
  value?: string;
  fileName?: string;
  onChange: (value: string) => void;
  onFileNameChange?: (fileName: string) => void;
}

export default function ReceiptUploader({
  value,
  fileName,
  onChange,
  onFileNameChange,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onFileNameChange?.(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      onChange(reader.result as string);

      /*
       * Clear the native file input so the previous
       * filename is not retained by the browser.
       *
       * The actual file data and filename remain in
       * the parent component state.
       */
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    };

    reader.readAsDataURL(file);
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