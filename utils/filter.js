export function filterBySuffix(pdfLinks) {
    const suffixSet = new Set();
    for (const pdfLink of pdfLinks) {
        const filename = pdfLink.filename;
        const suffix = filename.match(/(\.[^.]+)$/)[1];
        pdfLink.suffix = suffix;
        suffixSet.add(suffix);
    }
    return { pdfLinks, suffixSet }
}