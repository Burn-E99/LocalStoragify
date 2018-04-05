# LocalStoragify.JS
Takes JS, CSS, and HMTL files (and theoretically any text based file) and saves it to the browser's localStorage for near instantaneous loads

## Description
This very small JS project allows the user to specify a list of files to preload into the web browser's localStorage for near instantaneous loads of the webpage.  Load time is huge when your application requires multiple large frameworks and libraries (such as Angular, Bootstrap, and jQuery), and is even more important on mobile devices when connection sometimes can be spotty at best.  This small single file called LocalStoragify.JS will allow the user to visit your site once and recieve the entire website in one large pull for the advantage of every future load being nearly instantaneous.

## Limitations
LocalStoragify.JS requires some files to be downloaded on each load.  These are:
- `LocalStoragify_V###.JS` - This file theoretically could be saved to the device, but if it is saved into LocalStorage, there would be no efficient way to get it back out.  Web browsers usually will cache this, but it is not 100% reliable.  This file is minified greatly to be less than 5kB.
- `_config.js` - This file cannot be saved to the device, as this carries the version number of the web application.  This file can be renamed and moved to anywhere on your server, but must contain a global variable called `window.version`.
- `index.html` - This is the index of your website.  It has to be pulled from an online source.
