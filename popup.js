import { renderPdfFilters, renderPdfList, addFiltersToDom, renderResultsContent, addSearchBarLogic } from "./utils/domUtils.js";
import { getPdfLinks, getCourseTitle } from "./utils/storage.js";
import { filterBySuffix } from "./utils/filter.js";
import { downloadSelectedPdfs } from "./utils/download.js";
import { showLoader, hideLoader } from "./utils/loader.js";


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pdf-list");
  const filterContainer = document.getElementById("suffix-filters");
  const selectAllCheckbox = document.getElementById("select-all");
  const downloadBtn = document.getElementById("download-zip");

  let currentPdfLinksJSON = "";
  let downloadingState = false;
  
  selectAllCheckbox.checked = false;
  selectAllCheckbox.addEventListener("change", () => {
    const checkboxes = container.querySelectorAll(".pdf-checkbox");
    checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
  });

  async function loadAndRender() {
      const pdfLinks = await getPdfLinks();

      if (pdfLinks.length === 0) {
        showLoader("Loading attachments...");
      } else {
        const courseTitle = await getCourseTitle();
        const newPdfLinksJSON = JSON.stringify(pdfLinks || []);
        if (newPdfLinksJSON !== currentPdfLinksJSON) {
          currentPdfLinksJSON = newPdfLinksJSON;
          const { pdfLinks: updatedPdfLinks, suffixSet } = filterBySuffix(pdfLinks);
          renderPdfFilters(filterContainer, suffixSet);
          renderPdfList(container, updatedPdfLinks);
          addFiltersToDom(container, updatedPdfLinks);
          addSearchBarLogic(container, updatedPdfLinks);
          renderResultsContent(courseTitle);
        }
        hideLoader();
      }
  }

  setInterval(() => {
    if (!downloadingState) {
      loadAndRender();
    }
  }, 1000);


  downloadBtn.addEventListener("click", async () => {
    downloadingState = true;

    const courseTitle = await getCourseTitle();
    const checkboxes = container.querySelectorAll(".pdf-checkbox:checked");
    if (checkboxes.length === 0) {
      alert("No PDFs selected.");
      return;
    }

    showLoader("Please wait...");
    const pdfLinks = JSON.parse(currentPdfLinksJSON);
    await downloadSelectedPdfs(checkboxes, pdfLinks, courseTitle);
    hideLoader();
    downloadingState = false;
  });
});
