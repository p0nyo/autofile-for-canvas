document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pdf-list");
  const loaderOverlay = document.getElementById("loader-overlay");
  const selectAllCheckbox = document.getElementById("select-all");
  const downloadBtn = document.getElementById("download-zip");

  let currentPdfLinksJSON = "";

  function renderPdfList(pdfLinks) {
    container.innerHTML = "";

    pdfLinks.forEach((link, index) => {
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.padding = "8px";
      wrapper.style.marginBottom = "6px";
      wrapper.style.border = "1px solid #ccc";
      wrapper.style.backgroundColor = "#f9f9f9";
      wrapper.style.transition = "background-color 0.2s";

      wrapper.addEventListener("mouseenter", () => {
        wrapper.style.backgroundColor = "#fcc6c2";
      });

      wrapper.addEventListener("mouseleave", () => {
        wrapper.style.backgroundColor = "#f9f9f9";
      });

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "pdf-checkbox";
      checkbox.dataset.index = index;
      checkbox.style.accentColor = "red";

      const p = document.createElement("p");
      p.textContent = link.text.replace(/^Download\s*/, "");
      p.style.pointerEvents = "none";
      p.style.fontSize = "16px";
      p.style.fontWeight = "500";
      wrapper.addEventListener("click", (e) => {
        if (e.target !== p) {
          checkbox.checked = !checkbox.checked;
        }
      })

      wrapper.appendChild(checkbox);
      wrapper.appendChild(p);
      container.appendChild(wrapper);

    

    });


    // Ensure select-all toggles all
    selectAllCheckbox.checked = false;
    selectAllCheckbox.addEventListener("change", () => {
      const checkboxes = container.querySelectorAll(".pdf-checkbox");
      checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
    });
  }

  async function loadAndRender() {
    chrome.storage.local.get("pdfLinks", ({ pdfLinks }) => {
      console.log(pdfLinks);
      const newPdfLinksJSON = JSON.stringify(pdfLinks || []);
      if (newPdfLinksJSON !== currentPdfLinksJSON) {
        currentPdfLinksJSON = newPdfLinksJSON;
        renderPdfList(pdfLinks);
      }
    });
  }

  setInterval(() => {
    loadAndRender();
  }, 100);


  downloadBtn.addEventListener("click", async () => {
    loaderOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
    const checkboxes = container.querySelectorAll(".pdf-checkbox:checked");
    if (checkboxes.length === 0) {
      alert("No PDFs selected.");
      // loaderOverlay.style.display = "none";
      return;
    }

    const zip = new JSZip();

    const fetchPromises = Array.from(checkboxes).map(async (cb) => {
      const idx = cb.dataset.index;
      const { url, filename } = JSON.parse(currentPdfLinksJSON)[idx];

      try {
        const res = await fetch(url, { credentials: "include" });
        const blob = await res.blob();
        loaderOverlay.style.display = "none";
        return { filename, blob };
      } catch (err) {
        console.error("Failed to fetch:", url, err);
        loaderOverlay.style.display = "none";
        return null;
      }
    });

    const results = await Promise.all(fetchPromises);

    results.forEach(file => {
      if (file) {
        zip.file(file.filename, file.blob);
      }
    });

    console.log("Files in zip:");
    let idx = 1;
    Object.keys(zip.files).forEach((filename) => {
      console.log(`${idx++} - ${filename}`);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "canvas_files.zip");
  });
});
