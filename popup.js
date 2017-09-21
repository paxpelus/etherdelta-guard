// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
      active: true,
      currentWindow: true
    };
  
    chrome.tabs.query(queryInfo, (tabs) => {
      // chrome.tabs.query invokes the callback with a list of tabs that match the
      // query. When the popup is opened, there is certainly a window and at least
      // one tab, so we can safely assume that |tabs| is a non-empty array.
      // A window can only have one active tab at a time, so the array consists of
      // exactly one tab.
      var tab = tabs[0];
  
      // A tab is a plain object that provides information about the tab.
      // See https://developer.chrome.com/extensions/tabs#type-Tab
      var url = tab.url;
  
      // tab.url is only available if the "activeTab" permission is declared.
      // If you want to see the URL of other tabs (e.g. after removing active:true
      // from |queryInfo|), then the "tabs" permission is required to see their
      // "url" properties.
      console.assert(typeof url == 'string', 'tab.url should be a string');
  
      callback(url);
    });
  
    // Most methods of the Chrome extension APIs are asynchronous. This means that
    // you CANNOT do something like this:
    //
    // var url;
    // chrome.tabs.query(queryInfo, (tabs) => {
    //   url = tabs[0].url;
    // });
    // alert(url); // Shows "undefined", because chrome.tabs.query is async.
  }

  var totalFiles = 3;
  var OKFiles = 0;
  
  document.addEventListener('DOMContentLoaded', () => {    

    getCurrentTabUrl((url) => {
      //Check if it is etherdelta instance
      OKFiles = 0;

      if (url.substr(0,22) == 'https://etherdelta.com') {
        document.getElementById('noetherdelta').style.display = 'none';
        document.getElementById('etherdelta').style.display = 'block';
        
        checkFile('https://etherdelta.com/index.html', '06a0a74d86a3ede9e5efb787cb59f5fa', 'file-index-html');
        checkFile('https://etherdelta.com/js/main.js', '780bb0fa077891159ec4e81b82afc8de', 'file-main-js');
        checkFile('https://etherdelta.com/script.js', 'ee0b8f79f618af2b838cca7a7cea0948', 'file-script-js');

        document.getElementById('filematching').innerText = OKFiles + '/' + totalFiles;
        if (OKFiles < totalFiles) {
            document.getElementById('filematching').className = 'red';
        }
      } else {
        document.getElementById('noetherdelta').style.display = 'block';
        document.getElementById('etherdelta').style.display = 'none';
      }
    });
  });

  function checkFile (url, hash, container) {
    var req = new XMLHttpRequest();
    
    req.open('GET', url, false);
    req.send(null);    
    if(req.status == 200) {
        if (hash != md5(req.responseText)) {
            document.getElementById(container).className = 'red';
            document.getElementById(container).innerHTML = 'FAIL';
        } else {
            document.getElementById(container).className = 'green';
            document.getElementById(container).innerHTML = 'OK';
            OKFiles++;
        } 
    }
  }