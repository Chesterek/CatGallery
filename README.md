Cat Gallery
https://cat-gallery.chesterkowo.pl/

Application displays a gallery of cat images fetched from an external API (https://thecatapi.com/).

Gallery is displayed in a grid layout of max 3 images per row on desktop and 1 image per row on mobile.
Clicking on an image opens a modal with additional information about the cat.
Modal window allows the user to navigate between images.
Application is keyboard accessible and responsive.


Due to its simplicity application does not implement global state management; however, images are cached using react-tanstack-query to avoid unnecessary API calls.
Gallery implements infinite scrolling to load more images as the user scrolls down. Default initial number of loaded images is 30, which guarantees quick loading time and good user experience.

Tech stack:
typescript,
React,
react-tanstack-query,
react-photo-album,
radix-ui/react-dialog
vite,
vitest
