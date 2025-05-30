export async function downloadSelectedPdfs(checkboxes, pdfLinks) {
  const zip = new JSZip();
  const fetchPromises = Array.from(checkboxes).map(async (cb) => {
    const idx = cb.dataset.index;
    const { url, filename } = pdfLinks[idx];

    try {
      const res = await fetch(url, { credentials: "include" });
      const blob = await res.blob();
      return { filename, blob };
    } catch (err) {
      console.error("Failed to fetch:", url, err);
      return null;
    }
  });

  const results = await Promise.all(fetchPromises);
  results.forEach(file => {
    if (file) zip.file(file.filename, file.blob);
  });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "canvas_files.zip");
}
