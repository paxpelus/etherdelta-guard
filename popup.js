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

  var totalFiles = hashes.length;
  var OKFiles = 0;
  
  document.addEventListener('DOMContentLoaded', () => {    

    getCurrentTabUrl((url) => {
      //Check if it is etherdelta instance
      OKFiles = 0;

      if (url.substr(0,22) == 'https://etherdelta.com') {
        document.getElementById('filematching').innerText = OKFiles + '/' + totalFiles;
        document.getElementById('noetherdelta').style.display = 'none';
        document.getElementById('etherdelta').style.display = 'block';
        
        setTimeout(function(){ 

          for (var i = 0 ; i < hashes.length ; i++) {
            checkFile(hashes[i].url, hashes[i].md5);
          }         
          
         }, 500);
        
      } else {
        document.getElementById('noetherdelta').style.display = 'block';
        document.getElementById('etherdelta').style.display = 'none';
      }
    });
  });

  function checkFile (url, hash) {
    var req = new XMLHttpRequest();
    
    req.open('GET', url, true);
    req.send(null);

    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // Action to be performed when the document is read;
          if (hash != md5(req.responseText)) {
              document.getElementById("fileList").innerHTML += "<li>" + url.substr(23) + " <span class='red'>FAIL</span></li>";
          } else {
              document.getElementById("fileList").innerHTML += "<li>" + url.substr(23) + " <span class='green'>OK</span></li>";
              OKFiles++;
              document.getElementById('filematching').innerText = OKFiles + '/' + totalFiles;
              if (OKFiles == totalFiles) {
                document.getElementById('filematching').className = 'green';
              }
          } 
        } else if (this.readyState == 4 && this.status != 200) {
          document.getElementById("fileList").innerHTML += "<li>" + url.substr(23) + " <span class='red'>" + this.status + "</span></li>";
        }
    };
  }