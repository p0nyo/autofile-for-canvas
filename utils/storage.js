export async function getPdfLinks() {
  return new Promise((resolve) => {
    chrome.storage.local.get("pdfLinks", ({ pdfLinks }) => {
      resolve(pdfLinks || []);
    });
  });
}
