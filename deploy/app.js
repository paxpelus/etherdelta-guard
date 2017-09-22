require('dotenv').config()
const express = require('express')
const app = express()
var request = require('sync-request');
var md5 = require('md5');
var fs = require('fs');
var fs2 = require('q-io/fs');
var EasyZip = require('easy-zip').EasyZip;
var WebstoreApi = require('chrome-store-api').Webstore;
var TokenManager = require('chrome-store-api').TokenManager;
var FileStorage = require('chrome-store-api').FileStorage;

var code = process.env.CODE;
var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

var storage = new FileStorage('data.json');

var tokenManager = new TokenManager(code, clientId, clientSecret, storage);
var api = new WebstoreApi(tokenManager);



var urls = [
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/index_com.html',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/js/main.js',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/script.js',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/config/main.json',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/addresses.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/balance.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/balanceHeader.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/basesDropdown.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/buy.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/connectionDescription.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/depositForm.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/helpDropdown.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/languages.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/loading.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/myFunds.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/myOrders.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/myTrades.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/orderBook.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/sell.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/tokenGuide.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/tokenGuidesDropdown.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/tokensDropdown.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/trades.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/trades_list.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/trades_nav.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/trades_progress.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/transferForm.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/volume.ejs',
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/templates/withdrawForm.ejs'
]

app.get('/', function (req, res) {
    if(req.query.key == process.env.SECRET_KEY) {

        var md5 = new Array();

        for ( var i = 0 ; i < urls.length ; i++) {
            md5.push({
                url: urls[i].replace('https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/', 'https://etherdelta.com/').replace('index_com.html', 'index.html'),
                md5: checkFile(urls[i])});
        }

        //Create hashes.js file with appropriate md5 hashes
        fs.writeFile("../hashes.js", "var hashes = " + JSON.stringify(md5), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The hashes file was updated!");

            //Update version in manifest file
            fs.readFile('../manifest.json', function read(err, data) {
                if (err) throw err;

                var manifest = JSON.parse(data);

                var version = manifest.version.split(".");
                manifest.version = version[0] + '.' + version[1] + '.' + (parseInt(version[2]) + 1)

                fs.writeFile("../manifest.json", JSON.stringify(manifest), function(err) {
                    if(err) return console.log(err);
                    console.log("Manifest was saved");

                    //Update github
                    var exec = require('child_process').exec;
                    function puts(error, stdout, stderr) { console.log(stdout) }
                    exec("git add ../hashes.js", puts);
                    exec("git add ../manifest.json", puts);
                    exec("git commit -m 'Version update'", puts);
                    exec("git push", puts);

                    // Create the zip file for uploading to chrome store
                    var zip = new EasyZip();
                    //batch add files
                    var files = [
                    	{source : '../background/background.js',target:'background/background.js'},
                    	{source : '../content_scripts/script.js',target:'content_scripts/script.js'},
                    	{source : '../icons/icon-error.png',target:'icons/icon-error.png'},
                    	{source : '../icons/icon-inactive.png',target:'icons/icon-inactive.png'},
                    	{source : '../icons/icon.png',target:'icons/icon.png'},
                    	{source : '../libraries/md5.js',target:'libraries/md5.js'},
                    	{source : '../hashes.js',target:'hashes.js'},
                    	{source : '../manifest.json',target:'manifest.json'},
                    	{source : '../popup.js',target:'popup.js'},
                    	{source : '../popup.html',target:'popup.html'},
                    	{source : '../README.md',target:'README.md'}
                    ];

                    zip.batchAdd(files,function(){
                    	zip.writeToFile('extension.zip');
                    });

                    fs2.read('extension.zip', 'b')
                      .then(function (blob) {
                          return api.update(process.env.EXTENSION_ID, blob);
                      })
                      .then(function (data) {
                          console.log(data); // item info

                          api.publish(process.env.EXTENSION_ID, 'trusted')
                           .then(function (data) {
                              console.log("The app is published!");
                              res.send(md5)
                           })
                           .catch(function (err) {
                              console.log(err);
                           });
                      })
                      .catch(function (err) {
                          console.log(err.response.itemError);
                          res.send("Error updating chrome store")
                      });
                });
            });
        });
    } else {
        res.send("Unauthorized")
    }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function checkFile (url) {
    var res = request('GET', url);
    return md5(res.getBody());
}