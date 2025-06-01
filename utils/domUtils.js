import { getCourseTitle } from "./storage.js";

export function renderPdfList(container, pdfLinks, highlight = "") {
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
    checkbox.style.pointerEvents = "none";

    const p = document.createElement("span");
    p.textContent = link.text.replace(/^Download\s*/, "");
    p.style.pointerEvents = "none";
    p.style.fontSize = "16px";
    p.style.fontWeight = "400";
    p.style.overflowWrap = "break-word";
    p.style.wordBreak = "break-word";
    p.style.whiteSpace = "normal";

    if (highlight) {
      const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
      p.innerHTML = link.text.replace(/^Download\s*/, "").replace(regex, '<mark>$1</mark>');
    } else {
      p.textContent = link.text.replace(/^Download\s*/, "");
    }


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
  container.innerHTML = "";

  const allWrapper = document.createElement("div");

  const all = document.createElement("p");
  all.textContent = "All";
  all.dataset.index = "all";
  all.dataset.checked = "true";
  all.className = "filter-button";
  all.style.userSelect = "none";

  allWrapper.appendChild(all);
  container.appendChild(allWrapper);

  suffixSet.forEach((suffix, index) => {
    const wrapper = document.createElement("div");

    const filter = document.createElement("p");
    filter.textContent = suffix;
    filter.dataset.index = index;
    filter.dataset.checked = "false";
    filter.className = "filter-button";
    filter.style.userSelect = "none";

    wrapper.appendChild(filter);
    container.appendChild(wrapper);
  });
}

export function renderResultsContent(courseTitle) {
  const resultsLength = getResultsContent();
  const formattedCourseTitle = courseTitle.replace(/_/g, " ");
  const resultsContent = document.getElementById("results-content");
  resultsContent.innerHTML = `Showing <strong>${resultsLength}</strong> result(s) for <strong>${formattedCourseTitle}</strong>`;
}

export function getResultsContent() {
  const visibleFlexItems = Array.from(document.querySelectorAll(".file-item"))
    .filter(item => getComputedStyle(item).display === "flex");
  return visibleFlexItems.length;
}

function getActiveFilters() {
  const allButton = document.querySelector('.filter-button[data-index="all"]');
  if (allButton.dataset.checked === "true") {
    return null; // means show all
  }
  return Array.from(document.querySelectorAll(".filter-button"))
    .filter(btn => btn.dataset.checked === "true" && btn.dataset.index !== "all")
    .map(btn => btn.textContent);
}

async function updateFilteredAndSearchedList(container, pdfLinks, searchQuery) {
  const courseTitle = await getCourseTitle();
  const activeFilters = getActiveFilters();

  let filteredLinks = pdfLinks;

  // Apply filters if any
  if (activeFilters) {
    filteredLinks = filteredLinks.filter(link => activeFilters.includes(link.suffix));
  }

  // Apply search filter if any
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredLinks = filteredLinks.filter(link => link.text.toLowerCase().includes(lowerQuery));
  }

  renderPdfList(container, filteredLinks, searchQuery);
  renderResultsContent(courseTitle);
}

export async function addFiltersToDom(container, pdfLinks) {
  const filterButtons = document.querySelectorAll(".filter-button");
  const allButton = document.querySelector('.filter-button[data-index="all"]');

  filterButtons.forEach(filterButton => {
    // Set initial styles for checked filters
    if (filterButton.dataset.checked === "true") {
      filterButton.style.backgroundColor = "#ff4e41";
    } else {
      filterButton.style.backgroundColor = "#fcc6c2";
    }

    filterButton.addEventListener("click", async () => {
      const isAll = filterButton.dataset.index === "all";

      if (isAll) {
        const newState = filterButton.dataset.checked === "false";
        filterButton.dataset.checked = newState ? "true" : "false";
        filterButton.style.backgroundColor = newState ? "#ff4e41" : "#fcc6c2";

        // Uncheck all other filters
        filterButtons.forEach(btn => {
          if (btn.dataset.index !== "all") {
            btn.dataset.checked = "false";
            btn.style.backgroundColor = "#fcc6c2";
          }
        });
      } else {
        // Toggle current filter
        if (filterButton.dataset.checked === "false") {
          filterButton.dataset.checked = "true";
          filterButton.style.backgroundColor = "#ff4e41";
        } else {
          filterButton.dataset.checked = "false";
          filterButton.style.backgroundColor = "#fcc6c2";
        }
        // Uncheck 'All'
        allButton.dataset.checked = "false";
        allButton.style.backgroundColor = "#fcc6c2";
      }

      const searchInput = document.querySelector("#search-input");
      await updateFilteredAndSearchedList(container, pdfLinks, searchInput.value.trim());
    });
  });
}

// Add search input event listener
export function addSearchBarLogic(container, pdfLinks) {
  const searchInput = document.querySelector("#search-input");

  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    await updateFilteredAndSearchedList(container, pdfLinks, query);
    const html = document.querySelector("html");
    html.scrollTo({ top: 0, behavior: "smooth" });
  });
}




