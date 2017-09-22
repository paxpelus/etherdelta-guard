const express = require('express')
const app = express()
var request = require('sync-request');
var md5 = require('md5');
var fs = require('fs');

var urls = [
    'https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/index.html',
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
    if(req.query.key == "KEY") { // Need to replace with agreed key

        var md5 = new Array();

        for ( var i = 0 ; i < urls.length ; i++) {
            md5.push({
                url: urls[i].replace('https://raw.githubusercontent.com/etherdelta/etherdelta.github.io/master/', 'https://etherdelta.com/'),
                md5: checkFile(urls[i])});
        }
    
        fs.writeFile("../hashes.js", "var hashes = " + JSON.stringify(md5), function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 

        res.send(md5)
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