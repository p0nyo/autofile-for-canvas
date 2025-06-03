## ![big-autofile-canvas](https://github.com/user-attachments/assets/5727c306-4db7-4f49-8c2e-3482ea08039c)
Google Chrome extension that allows you to select and batch download attachments from the modules page on Canvas.

Can find the link to the extension on the Chrome Web Store [here](https://chromewebstore.google.com/detail/autofile-for-canvas/jpnplafacbflagpapekkggknnecoijog?authuser=0&hl=en)

## implementation
- content script parses and fetches downloadable attachments from canvas modules page
- downloadable attachments are stored in google local storage
- popup script fetches attachments from the local storage and displays them on the popup
- download button:
  - iterates through all checkboxes and grabs all downloadable urls
  - converts urls to blobs
  - package all url blobs into a zip file and downloads
  
