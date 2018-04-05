/*
	This file is going to be the only file needed, as this will load and read every file into LocalStorage.

	Version number will be gotten from a separate location on the server (/js/_config.min.js), and if version number does not match the saved version number,
	the entire localStorage will be dumped and a reload will be forced.

	When pulled out of here, the HTML will be saved as window.ff.[filename], so that any HTML page can be rendered immediately.
	Scripts will be saved as window.js.[filename], so that JS can inject it into a <script id="loadedJS"></script> tag.
	CSS will be saved as window.css.[filename], so that JS can inject it into a <style id="loadedCSS"></style> tag.
*/

// Files To Load
var ftl = [
	// HTML
	{
		name: "name",
		type: "type",
		path: "path"
	}
],
ftll = ftl.length,
rl = false,
i = 0,
jsi = 0,
cssi = 0,
lA = function(x) {
    // call itself
    lF(x[i],function(){
        // set x to next item
        i++;
        // any more items in array?
        if(i < x.length) {
         	lA(x);   
        } else {
			done();
		}
    }); 
};
window.ff = {
	"html": {}
};

var b = new XMLHttpRequest();
b.open('GET', "js/_config.js");
b.setRequestHeader("Cache-Control", "max-age=0");
b.onreadystatechange = function() {
	if(b.readyState === XMLHttpRequest.DONE && b.status === 200) {
		document.getElementById("js"+jsi).text = b.responseText;
		checkVersion();
	} else if(b.status === 404) {
		alert("CONFIG MISSING!!! Try a refresh, if issue persists, check internet connection and then finally contact us.");
	}
}
b.send();

function checkVersion() {
	console.log("My Version: " + localStorage.getItem("firesVersion"));
	console.log("Remote Version: " + window.firesVersion);
	if(localStorage.getItem("firesVersion") != window.firesVersion) {
		localStorage.clear();
	}

	// start 'loop'
	lA(ftl);
}

// loop function, o is object, c is callback
function lF(o,c) {
	if(localStorage.getItem("firesVersion") != window.firesVersion) {
		var b = new XMLHttpRequest();
		b.open('GET', o.path);
		b.setRequestHeader("Cache-Control", "max-age=0");
		b.onreadystatechange = function() {
			if(b.readyState === XMLHttpRequest.DONE && b.status === 200) {
				localStorage.setItem(o.type + "-_-" + o.name, b.responseText);
				rl = true;
				c();
			} else if(b.status === 404) {
				console.log("Missing item:",b);
				c();
			}
		}
		b.send();
	} else {
		if(o.type == "html") {
			window.ff.html[o.name] = localStorage.getItem(o.type + "-_-" + o.name);
		} else if(o.type == "js") {
			var n = document.createElement("script");
			n.text = localStorage.getItem(o.type + "-_-" + o.name);
			n.id = "js" + (jsi+1);
			n.type = "text/javascript";
			n.name = o.name;
			document.getElementById("js"+jsi).parentNode.insertBefore(n, document.getElementById("js"+jsi).nextSibling);
			jsi++;
		} else if(o.type == "css") {
			var n = document.createElement("style");
			n.innerHTML = localStorage.getItem(o.type + "-_-" + o.name);
			n.id = "css" + (cssi+1);
			n.type = "text/css";
			n.name = o.name;
			document.getElementById("css"+cssi).parentNode.insertBefore(n, document.getElementById("css"+cssi).nextSibling);
			cssi++;
		}
		c();
	}
}

function done() {
	// Download the Images if needed
	if(localStorage.getItem("LIS") && (localStorage.getItem("LIS_Year") == window.baseYear) && (localStorage.getItem("LIS_Version") == window.LISVersion)) {
		if(rl){
			localStorage.setItem("firesVersion", window.firesVersion);
			window.location.reload(false);
		}
	} else {
		var b = new XMLHttpRequest();
		b.open('GET', "i/images.js");
		b.setRequestHeader("Cache-Control", "max-age=0");
		b.onreadystatechange = function() {
			if(b.readyState === XMLHttpRequest.DONE && b.status === 200) {
				var n = document.createElement("script");
				n.text = b.responseText;
				n.id = "js" + (jsi+1);
				n.type = "text/javascript";
				document.getElementById("js"+jsi).parentNode.insertBefore(n, document.getElementById("js"+jsi).nextSibling);
				jsi++;

				var d = window.LISImages;
				localStorage.setItem('LIS_FIRES', d[0]);
				localStorage.setItem('LIS_fa-book', d[1]);
				localStorage.setItem('LIS_fa-desktop', d[2]);
				localStorage.setItem('LIS_fa-eye', d[3]);
				localStorage.setItem('LIS_fa-list-ol', d[4]);
				localStorage.setItem('LIS_fa-lock', d[5]);
				localStorage.setItem('LIS_fa-object-group', d[6]);
				localStorage.setItem('LIS_fa-sort-numeric-asc', d[7]);
				localStorage.setItem('LIS_field', d[8]);
				localStorage.setItem('LIS_shirt', d[9]);
				localStorage.setItem('LIS_404', d[10]);
				localStorage.setItem('LIS', true);
				localStorage.setItem('LIS_Version', window.LISVersion);
				localStorage.setItem('LIS_Year', window.baseYear);

				// Set local version
				localStorage.setItem("firesVersion", window.firesVersion);
				window.location.reload(false);
			} else if(b.status === 404) {
				console.log("Missing item:",b);
				c();
			}
		}
		b.send();
	}
}
