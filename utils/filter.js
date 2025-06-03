
export function filterBySuffix(pdfLinks) {
    const suffixSet = new Set();
    for (const pdfLink of pdfLinks) {
        try {
            const filename = pdfLink.filename;
            const suffix = filename.match(/(\.[^.]+)$/)[1];
            pdfLink.suffix = suffix;
            suffixSet.add(suffix);
        } catch (e) {
            console.error("Error extracting suffix:", e);
        }
    }
    return { pdfLinks, suffixSet }
}

