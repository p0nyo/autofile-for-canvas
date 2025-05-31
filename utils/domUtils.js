export function renderPdfList(container, pdfLinks) {
  container.innerHTML = "";

  pdfLinks.forEach((link, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "file-item";
    wrapper.dataset.suffix = link.suffix;

    wrapper.addEventListener("mouseenter", () => {
      wrapper.style.backgroundColor = "#e4e4e4";
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

export function renderPdfFilters(container, suffixSet) {
  const divWrapper = document.createElement("div");
  divWrapper.style.display = "flex";
  divWrapper.style.flex = "row";
  divWrapper.style.gap = "6px";
  const allWrapper = document.createElement("div");

  const all = document.createElement("p");
  all.textContent = "All";
  all.dataset.index = "all";
  all.dataset.checked = "true";
  all.className = "filter-button";
  all.style.userSelect = "none";

  allWrapper.appendChild(all);
  divWrapper.appendChild(allWrapper);

  suffixSet.forEach((suffix, index) => {
    console.log(index, suffix);
    const wrapper = document.createElement("div");

    const filter = document.createElement("p");
    filter.textContent = suffix;
    filter.dataset.index = index;
    filter.dataset.checked = "false";
    filter.className = "filter-button";
    filter.style.userSelect = "none";

    wrapper.appendChild(filter);
    divWrapper.appendChild(wrapper);
  });
  container.insertBefore(divWrapper, container.lastElementChild);
}

export function renderResultsLength(textContent) {
  const resultsLength = document.getElementById("results-length");
  resultsLength.textContent = `Showing ${textContent} result(s)`;
}

export function getResultsLength() {
  const visibleFlexItems = Array.from(document.querySelectorAll(".file-item"))
    .filter(item => getComputedStyle(item).display === "flex");
  return visibleFlexItems.length;
}

export function addFiltersToDom() {
  const filterButtons = document.querySelectorAll(".filter-button");
  const allButton = document.querySelector('.filter-button[data-index="all"]');

  function updateVisibleFiles() {
    const isAllChecked = allButton.dataset.checked === "true";
    const fileItems = document.querySelectorAll(".file-item");

    if (isAllChecked) {
      fileItems.forEach(item => {
        item.style.display = "flex";
      });
    } else {
      const activeFilters = Array.from(document.querySelectorAll(".filter-button"))
        .filter(btn => btn.dataset.checked === "true" && btn.dataset.index !== "all")
        .map(btn => btn.textContent);

      fileItems.forEach(item => {
        const suffix = item.dataset.suffix;
        if (activeFilters.includes(suffix)) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    }
  }

  for (const filterButton of filterButtons) {
    if (filterButton.dataset.checked === "true") {
      filterButton.style.backgroundColor = "#ff4e41";
    }
    filterButton.addEventListener("click", () => {
      const isAll = filterButton.dataset.index === "all";

      if (isAll) {
        const newState = filterButton.dataset.checked === "false";

        filterButton.dataset.checked = newState ? "true" : "false";
        filterButton.style.backgroundColor = newState ? "#ff4e41" : "#fcc6c2";

        [...filterButtons].forEach(btn => {
          if (btn.dataset.index !== "all") {
            btn.dataset.checked = "false";
            btn.style.backgroundColor = "#fcc6c2";
          }
        });
      } else {
        if (filterButton.dataset.checked === "false") {
          filterButton.dataset.checked = "true";
          filterButton.style.backgroundColor = "#ff4e41";
        } else {
          filterButton.dataset.checked = "false";
          filterButton.style.backgroundColor = "#fcc6c2";
        }

        allButton.dataset.checked = "false";
        allButton.style.backgroundColor = "#fcc6c2";
      }
      updateVisibleFiles();
      renderResultsLength(getResultsLength());
    });

  }
}

