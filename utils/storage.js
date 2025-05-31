export async function getPdfLinks() {
  return new Promise((resolve) => {
    chrome.storage.local.get("pdfLinks", ({ pdfLinks }) => {
      resolve(pdfLinks || []);
    });
  });
}

export async function getCourseTitle() {
  return new Promise((resolve) => {
    chrome.storage.local.get("courseTitle", ({ courseTitle }) => {
      resolve(courseTitle || "");
    });
  });
}
