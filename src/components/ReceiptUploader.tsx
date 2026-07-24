import { useRef } from "react";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export default function ReceiptUploader({
  value,
  onChange,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      onChange(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,image/*"
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
        </div>
      )}

    </div>
  );
}