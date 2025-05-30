## AutoFile for Canvas
Google Chrome extension that allows you to select and batch download attachments from the modules page on Canvas.

## implementation
- content script parses and fetches downloadable attachments from canvas modules page
- downloadable attachments are stored in google local storage
- popup script fetches attachments from the local storage and displays them on the popup
- download button:
  - iterates through all checkboxes and grabs all downloadable urls
  - converts urls to blobs
  - package all url blobs into a zip file and downloads
  
