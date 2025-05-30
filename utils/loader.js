export function showLoader() {
  document.getElementById("loader-overlay").style.display = "block";
  document.body.style.overflow = "hidden";
}

export function hideLoader() {
  document.getElementById("loader-overlay").style.display = "none";
  document.body.style.overflow = "";
}
