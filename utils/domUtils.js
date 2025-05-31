export function renderPdfList(container, pdfLinks) {
  container.innerHTML = "";

  pdfLinks.forEach((link, index) => {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px;
      margin-bottom: 6px;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
      transition: background-color 0.2s;
      cursor: pointer;
    `;

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
    checkbox.style.marginRight = "12px";

    const p = document.createElement("p");
    p.textContent = link.text.replace(/^Download\s*/, "");
    p.style.pointerEvents = "none";
    p.style.fontSize = "16px";
    p.style.fontWeight = "400";

    wrapper.addEventListener("click", (e) => {
      if (e.target !== p) {
        checkbox.checked = !checkbox.checked;
      }
    });

    wrapper.appendChild(checkbox);
    wrapper.appendChild(p);
    container.appendChild(wrapper);
  });
}
