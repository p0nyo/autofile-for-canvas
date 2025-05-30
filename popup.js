
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pdf-list");
  const spinner = document.getElementById("spinner");
  const selectAllCheckbox = document.getElementById("select-all");
  const downloadBtn = document.getElementById("download-zip");

  // Show spinner
  spinner.style.display = "block";

  chrome.storage.local.get("pdfLinks", ({ pdfLinks }) => {
    // Hide spinner after data retrieval
    spinner.style.display = "none";

    if (!pdfLinks || pdfLinks.length === 0) {
      container.textContent = "No PDFs found.";
      return;
    }

    pdfLinks.forEach((link, index) => {
      const wrapper = document.createElement("div");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "pdf-checkbox";
      checkbox.dataset.index = index;
      

      const a = document.createElement("a");
      a.href = link.url;
      a.textContent = link.text.replace(/^Download\s*/, "");
      a.target = "_blank";
      a.style.marginLeft = "8px";

      wrapper.appendChild(checkbox);
      wrapper.appendChild(a);
      container.appendChild(wrapper);
    });


    selectAllCheckbox.addEventListener("change", () => {
      const checkboxes = container.querySelectorAll(".pdf-checkbox");
      checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
    });

    downloadBtn.addEventListener("click", async () => {
      const checkboxes = container.querySelectorAll(".pdf-checkbox:checked");
      if (checkboxes.length === 0) {
        alert("No PDFs selected.");
        return;
      }

    const zip = new JSZip();

    // Create array of fetch promises
    const fetchPromises = Array.from(checkboxes).map(async (cb) => {
      const idx = cb.dataset.index;
      const { url, filename } = pdfLinks[idx];

      try {
        const res = await fetch(url, { credentials: "include" });
        const blob = await res.blob();
        return { filename, blob };
      } catch (err) {
        console.error("Failed to fetch:", url, err);
        return null; // skip failed fetches
      }
    });

    // Wait for all fetches to finish
    const results = await Promise.all(fetchPromises);

    console.log(results);

    // Add all blobs to the zip
    results.forEach(file => {
      if (file) {
        zip.file(file.filename, file.blob);
      }
    });

    console.log("Files in zip:");
    let idx = 1;
    Object.keys(zip.files).forEach((filename) => {
      console.log(idx + "-", filename);
      idx += 1;
    });


    // Generate and trigger download
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "canvas_batch_download.zip");

    });
  });
});
