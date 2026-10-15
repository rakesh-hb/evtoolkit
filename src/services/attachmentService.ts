import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { supabase } from "../lib/supabase";

const STORAGE_BUCKET = "premium_plus_attachments";
const SIGNED_URL_EXPIRY_SECONDS = 60 * 10;

type AttachmentAction = "download" | "share" | "cancel";

function getSafeFileName(fileName: string): string {
  const cleaned = (fileName || "attachment")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
    .trim();

  return cleaned || "attachment";
}

async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length))
    );
  }

  return btoa(binary);
}

/**
 * File action dialog styled to match the Analytics Report export dialog.
 * Used by pages that call downloadAttachment(), keeping file actions consistent.
 */
function chooseAttachmentAction(fileName: string): Promise<AttachmentAction> {
  return new Promise((resolve) => {
    let resolved = false;

    const finish = (action: AttachmentAction) => {
      if (resolved) return;
      resolved = true;
      document.removeEventListener("keydown", handleKeyDown);
      overlay.remove();
      resolve(action);
    };

    const overlay = document.createElement("div");
    overlay.setAttribute("role", "presentation");
    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:2147483647",
      "background:rgba(0,0,0,.58)",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "padding:16px",
      "box-sizing:border-box",
    ].join(";");

    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "attachment-action-title");
    dialog.style.cssText = [
      "width:100%",
      "max-width:360px",
      "background:#111827",
      "color:#f9fafb",
      "border:1px solid #374151",
      "border-radius:16px",
      "padding:22px",
      "box-shadow:0 20px 60px rgba(0,0,0,.4)",
      "box-sizing:border-box",
      "font-family:inherit",
    ].join(";");

    const header = document.createElement("div");
    header.style.cssText =
      "display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px";

    const title = document.createElement("h3");
    title.id = "attachment-action-title";
    title.textContent = "Attachment options";
    title.style.cssText = "margin:0;font-size:18px;font-weight:700";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close");
    closeButton.style.cssText =
      "border:0;background:transparent;color:#d1d5db;cursor:pointer;padding:4px;font-size:24px;line-height:1";
    closeButton.addEventListener("click", () => finish("cancel"));

    header.append(title, closeButton);

    const description = document.createElement("p");
    description.textContent = `Choose how you want to handle ${fileName}.`;
    description.style.cssText =
      "margin:0 0 18px;color:#9ca3af;font-size:13px;overflow-wrap:anywhere";

    const makeActionButton = (
      heading: string,
      detail: string,
      action: Exclude<AttachmentAction, "cancel">,
      icon: string
    ) => {
      const button = document.createElement("button");
      button.type = "button";
      button.style.cssText = [
        "width:100%",
        "display:flex",
        "align-items:center",
        "gap:12px",
        "padding:13px 14px",
        "border-radius:10px",
        "border:1px solid #374151",
        "background:#1f2937",
        "color:#f9fafb",
        "text-align:left",
        "cursor:pointer",
        "font:inherit",
        "margin-bottom:10px",
      ].join(";");

      const iconBox = document.createElement("span");
      iconBox.textContent = icon;
      iconBox.setAttribute("aria-hidden", "true");
      iconBox.style.cssText =
        "width:24px;flex:0 0 24px;text-align:center;font-size:20px";

      const textBox = document.createElement("span");
      textBox.style.cssText = "display:block;min-width:0";

      const strong = document.createElement("strong");
      strong.textContent = heading;
      strong.style.cssText = "display:block;font-size:14px;font-weight:700";

      const subtext = document.createElement("span");
      subtext.textContent = detail;
      subtext.style.cssText =
        "display:block;color:#9ca3af;font-size:12px;margin-top:3px";

      textBox.append(strong, subtext);
      button.append(iconBox, textBox);
      button.addEventListener("click", () => finish(action));
      return button;
    };

    const downloadButton = makeActionButton(
      "Download file",
      Capacitor.isNativePlatform()
        ? "Save a copy to EV Toolkit's Documents storage"
        : "Save a copy using your browser",
      "download",
      "⬇"
    );

    const shareButton = makeActionButton(
      "Share file",
      "Send it to another app or person",
      "share",
      "↗"
    );
    shareButton.style.marginBottom = "0";

    dialog.append(
      header,
      description,
      downloadButton,
      shareButton
    );
    overlay.appendChild(dialog);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) finish("cancel");
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") finish("cancel");
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.appendChild(overlay);
    downloadButton.focus();
  });
}

async function shareOnWeb(blob: Blob, fileName: string): Promise<void> {
  const file = new File([blob], fileName, {
    type: blob.type || "application/octet-stream",
  });

  if (
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    await navigator.share({
      title: fileName,
      text: "Attachment from EV Toolkit",
      files: [file],
    });
    return;
  }

  // Browsers without file sharing support fall back to a normal download.
  downloadOnWeb(blob, fileName);
}

function downloadOnWeb(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export async function downloadAttachment(
  attachment: string,
  fileName: string
): Promise<void> {
  if (!attachment) {
    alert("No attachment is available.");
    return;
  }

  try {
    let url = attachment;

    // Private Supabase Storage paths need a short-lived signed URL.
    if (
      !attachment.startsWith("data:") &&
      !attachment.startsWith("http://") &&
      !attachment.startsWith("https://")
    ) {
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
      throw new Error(
        `Unable to download the attachment (HTTP ${response.status}).`
      );
    }

    const blob = await response.blob();
    const safeFileName = getSafeFileName(fileName);
    const action = await chooseAttachmentAction(safeFileName);

    if (action === "cancel") return;

    if (!Capacitor.isNativePlatform()) {
      if (action === "download") {
        downloadOnWeb(blob, safeFileName);
      } else {
        await shareOnWeb(blob, safeFileName);
      }
      return;
    }

    const base64 = await blobToBase64(blob);

    if (action === "download") {
      await Filesystem.writeFile({
        path: safeFileName,
        data: base64,
        directory: Directory.Documents,
        recursive: true,
      });

      alert(
        `Saved "${safeFileName}" to EV Toolkit's Documents storage. ` +
          "To save it in the phone's public Downloads folder, choose Share and select a file-saving app."
      );
      return;
    }

    const cachedFile = await Filesystem.writeFile({
      path: safeFileName,
      data: base64,
      directory: Directory.Cache,
      recursive: true,
    });

    await Share.share({
      title: safeFileName,
      text: "Attachment from EV Toolkit",
      url: cachedFile.uri,
      dialogTitle: "Share attachment",
    });
  } catch (error) {
    console.error("Failed to download attachment:", error);
    alert(
      error instanceof Error
        ? error.message
        : "Failed to download attachment."
    );
  }
}
