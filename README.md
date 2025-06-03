# AutoFile for Canvas
A Google Chrome extension that helps you quickly preview and download PDF files from your Canvas modules pages. It scans the modules page for PDF links, displays them in a popup, and allows you to select and download them as a ZIP file.

Link to the Chrome Web Store listing [here](https://chromewebstore.google.com/detail/autofile-for-canvas/jpnplafacbflagpapekkggknnecoijog?authuser=0&hl=en)

## 🎨 Features

- Automatically detects all PDF links on the Canvas Modules page.
- Preview PDFs before downloading using an in-popup viewer.
- Filter PDFs by type (e.g., `.pdf`, `.docx`, etc.).
- Search PDFs by filename.
- Download selected files as a ZIP.
- Clean and responsive popup UI.


## 🔧 Local Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the extension's folder.
5. The extension icon should now appear in your toolbar!

## 🚀 Usage

1. Navigate to your Canvas course's **Modules** page.
2. Click the **Canvas PDF Collector** icon in your Chrome toolbar.
3. The extension will scan the page and display all downloadable files.
4. Use the **search bar** or **filter buttons** to refine the list.
5. Select the files you want and click **Download as ZIP**.

> ⚠️ You must be logged in to your Canvas account for the extension to work properly.

## 🛠 Development

If you're making changes, here's the file structure overview:
```
autofile-for-canvas/
│
├── popup.html # Main popup UI
├── popup.js # Popup logic
├── index.js # Content script that runs automatically on Canvas module pages
├── manifest.json # Chrome extension config
├── css/ # Styling for popup UI
├── icons/ # Extension icon assets
├── fonts/ # fonts for popup UI
├── lib/ # locally downloaded packages
├── public/ # images for popup UI
└── utils/ # Helper functions for the popup logic
```

## 📦 Release History
**v1.1.1 (2025-06-04)**

- Fixed major bug preventing users from downloading the correct file/s under filtered conditions

**v1.1.0 (2025-06-04)**

- Added search and filtering functionality
- Improved popup UX/UI and scroll behavior

**v1.0.0 (2025-05-30)**

- Initial release

## 🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

  
