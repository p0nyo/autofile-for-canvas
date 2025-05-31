export function showLoader(textContent) {
  document.getElementById("loader-overlay").style.display = "block";
  document.getElementById("loader-text").textContent = textContent;
  document.body.style.overflow = "hidden";
}

export function hideLoader() {
  document.getElementById("loader-overlay").style.display = "none";
  document.body.style.overflow = "";
}
