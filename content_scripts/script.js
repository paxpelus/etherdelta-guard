var totalFiles = hashes.length;
var OKFiles = 0;

for (var i = 0 ; i < hashes.length ; i++) {
    checkFile(hashes[i].url, hashes[i].md5);
}

if (OKFiles == totalFiles) {
    chrome.runtime.sendMessage({ "newIconPath" : "icons/icon.png" });
} else {
    chrome.runtime.sendMessage({ "newIconPath" : "icons/icon-error.png" });
}

function checkFile (url, hash) {
    var req = new XMLHttpRequest();
    
    req.open('GET', url, false);
    req.send(null);    
    if(req.status == 200) {
        if (hash == md5(req.responseText)) {
            OKFiles++;
        }
    }
}