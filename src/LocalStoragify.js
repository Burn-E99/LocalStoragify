/*
	This file is going to be the only file needed, as this will load and read every file into LocalStorage.

	Version number will be gotten from a separate location on the server (/js/_config.min.js), and if version number does not match the saved version number,
	the entire localStorage will be dumped and a reload will be forced.

	When pulled out of here, the HTML will be saved as window.files.html.[filename], so that any HTML page can be rendered immediately.
	Scripts will be injected it into a <script id="loadedJS"></script> tag.
	CSS will be injected it into a <style id="loadedCSS"></style> tag.
*/

// Files To Load
var ftl = [
	{
		name: "name to access by (remove spaces)",
		type: "type (html, js, css)",
		path: "path relative to application's index.html"
	}
],
// Short reference name for the length
ftll = ftl.length,
// Flag to determine if the application should reload after files are downloaded
rl = false,
// Current index
i = 0,
// JS index (for script tag)
jsi = 0,
// CSS index (for style tag)
cssi = 0,
// Loop starter function
lA = function(x) {
    // call itself
    lF(x[i],function(){
        // set x to next item
        i++;
        // any more items in array?
        if(i < x.length) {
			// run with next item
         	lA(x);
        } else {
			// else call the done function
			done();
		}
    }); 
};
window.files = {
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
	console.log("My Version: " + localStorage.getItem("appVersion"));
	console.log("Remote Version: " + window.appVersion);
	if(localStorage.getItem("appVersion") != window.appVersion) {
		localStorage.clear();
	}

	// start 'loop'
	lA(ftl);
}

// loop function, o is object, c is callback
function lF(o,c) {
	if(localStorage.getItem("appVersion") != window.appVersion) {
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
			window.files.html[o.name] = localStorage.getItem(o.type + "-_-" + o.name);
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
	
	if(rl){
		localStorage.setItem("appVersion", window.appVersion);
		window.location.reload(false);
	}
}
