var totalFiles = 3;
var OKFiles = 0;

checkFile('https://etherdelta.com/index.html', '06a0a74d86a3ede9e5efb787cb59f5fa');
checkFile('https://etherdelta.com/js/main.js', '780bb0fa077891159ec4e81b82afc8de');
checkFile('https://etherdelta.com/script.js', 'ee0b8f79f618af2b838cca7a7cea0948');


if (OKFiles == totalFiles) {
    chrome.runtime.sendMessage({ "newIconPath" : "icon.png" });
} else {
    chrome.runtime.sendMessage({ "newIconPath" : "icon-error.png" });        
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