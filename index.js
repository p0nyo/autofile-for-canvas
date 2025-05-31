const FETCH_LIMIT = 30;
const SELECTOR_MODULE_LINKS = 'a.ig-title.title.item_link';

async function getCourseName() {
    const courseTitleDiv = document.querySelector('a.mobile-header-title > div:first-of-type');
    const unformattedCourseTitle = courseTitleDiv.textContent.trim();
    const courseTitle = unformattedCourseTitle.replace(/\s+/g, "_");
    
    return courseTitle;
}

async function getModuleItemLinks() {
    const anchors = document.querySelectorAll(SELECTOR_MODULE_LINKS);
    
    const moduleItems = Array.from(anchors).map((a) => ({
        url: new URL(a.getAttribute('href'), window.location.origin).toString(),
        text: a.textContent.trim()
    }));

    return moduleItems;
}

async function fetchModulePagesWithLimit(urls, limit = 5) {
    const results = [];
    let index = 0;

    async function worker() {
        while (index < urls.length) {
        const currentIndex = index++;
        const url = urls[currentIndex];

        try {
            const res = await fetch(url, { credentials: "include" });
            const text = await res.text();
            results[currentIndex] = { url, html: text };
        } catch (err) {
            console.error(`Error fetching ${url}:`, err);
            results[currentIndex] = null;
        }
        }
    }

    const workers = Array.from({ length: limit }, () => worker());
    await Promise.all(workers);

    return results.filter(Boolean);
}

function extractPdfLinkFromHTML(html, baseUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let anchor = doc.querySelector('a[download]');

    if (!anchor) {
        anchor = Array.from(doc.querySelectorAll("a")).find((a) => 
            a.href.endsWith(".pdf")
        );
    }

    if (anchor) {
        const href = anchor.getAttribute("href");
        const pdfUrl = new URL(href, baseUrl).toString();
        const filename = anchor.textContent.trim().replace(/^Download\s+/i, "");

        return { pdfUrl, filename };
    }

    return null;
}

async function initialise() {
    const courseTitle = await getCourseName();
    const moduleItems = await getModuleItemLinks();
    console.log("Module Items:", moduleItems);

    const modulePages = await fetchModulePagesWithLimit(
        moduleItems.map(item => item.url),
        FETCH_LIMIT
    );

    const pdfLinks = modulePages
        .map(({ html, url }, index) => {
        const result = extractPdfLinkFromHTML(html, url);
        if (!result) return null;

        const { pdfUrl, filename } = result;
        if (!pdfUrl || !filename) return null;

        const text = moduleItems[index].text;
        return { text, url: pdfUrl, filename };
        })
        .filter(link => link !== null);

    console.log("Found PDF Links:", pdfLinks);
    console.log("Found Course Title:" + courseTitle);
    chrome.storage.local.clear(() => {
        chrome.storage.local.set({ courseTitle, pdfLinks });
    })
}

window.addEventListener("load", () => {
    initialise();
});
