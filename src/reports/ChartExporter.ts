import { toPng } from "html-to-image";

export async function captureChart(id: string) {
  const element = document.getElementById(id);

  if (!element) return null;

  return await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });
}