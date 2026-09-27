import { supabase } from "../lib/supabase";

const STORAGE_BUCKET = "premium_plus_attachments";
const SIGNED_URL_EXPIRY_SECONDS = 60 * 10;

export async function downloadAttachment(
  attachment: string,
  fileName: string
) {
  if (!attachment) return;

  try {
    let url = attachment;

    // Premium Plus attachments are stored as private Supabase
    // Storage paths. Generate a short-lived signed URL for them.
    if (!attachment.startsWith("data:") && !attachment.startsWith("http://") && !attachment.startsWith("https://")) {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(attachment, SIGNED_URL_EXPIRY_SECONDS);

      if (error || !data?.signedUrl) {
        throw error || new Error("Unable to create a download link.");
      }

      url = data.signedUrl;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to download the attachment.");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName || "attachment";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error("Failed to download attachment:", error);
    alert(
      error instanceof Error
        ? error.message
        : "Failed to download attachment."
    );
  }
}
