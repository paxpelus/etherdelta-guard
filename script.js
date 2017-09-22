var totalFiles = 29;
var OKFiles = 0;

checkFile('https://etherdelta.com/index.html', '06a0a74d86a3ede9e5efb787cb59f5fa');
checkFile('https://etherdelta.com/js/main.js', '780bb0fa077891159ec4e81b82afc8de');
checkFile('https://etherdelta.com/script.js', 'ee0b8f79f618af2b838cca7a7cea0948');
checkFile('https://etherdelta.com/config/main.json', 'c546d1d4df4d2d302be4bad4757161a5');
checkFile('https://etherdelta.com/templates/addresses.ejs', '82dbd67b7f0cefa6925514034a275d0d');
checkFile('https://etherdelta.com/templates/balance.ejs', 'bef3d6e372744ee6d12367bd3d7f7994');
checkFile('https://etherdelta.com/templates/balanceHeader.ejs', 'c9fea469efffbf23ce8bff27a3ef2c5a');
checkFile('https://etherdelta.com/templates/basesDropdown.ejs', 'ce9759231b175a73557e5f835f4f9e8a');
checkFile('https://etherdelta.com/templates/buy.ejs', 'ddee04ce68853cdc6a3bad9c60fc333d');
checkFile('https://etherdelta.com/templates/connectionDescription.ejs', 'edd4b4af2e0f23b454940fa08fb4ffa3');
checkFile('https://etherdelta.com/templates/depositForm.ejs', 'e50e6f24ce9d896f4fd8aba683ec5991');
checkFile('https://etherdelta.com/templates/helpDropdown.ejs', '412ca7ee49902f9e68baf4793fc670af');
checkFile('https://etherdelta.com/templates/languages.ejs', 'b4c36db4a505641896520f19897dc865');
checkFile('https://etherdelta.com/templates/loading.ejs', 'af124419ca8461851210ed59856da1d4');
checkFile('https://etherdelta.com/templates/myFunds.ejs', '774faa00ff8addaf8e5a7ba245cb1400');
checkFile('https://etherdelta.com/templates/myOrders.ejs', '311f563fbb87e2cf638a46ba0fd342d0');
checkFile('https://etherdelta.com/templates/myTrades.ejs', '517fc14116eb48b7c47c6745d68b5383');
checkFile('https://etherdelta.com/templates/orderBook.ejs', '53785dc97fdf7901fef76b0a0cda244b');
checkFile('https://etherdelta.com/templates/sell.ejs', '978311e2202dce593a2e82e3d61b0de5');
checkFile('https://etherdelta.com/templates/tokenGuide.ejs', '0932ce56a78ec971e7fcb639004a2b30');
checkFile('https://etherdelta.com/templates/tokenGuidesDropdown.ejs', '112de113c9fea0a6e6a425aa22ef8d02');
checkFile('https://etherdelta.com/templates/tokensDropdown.ejs', '7131076a23a8d44b23550af0c607f374');
checkFile('https://etherdelta.com/templates/trades.ejs', '770b8a00d1a1cffc4e1bb758dfec8a9f');
checkFile('https://etherdelta.com/templates/trades_list.ejs', '6efe92de31e53474507d1774eafc137b');
checkFile('https://etherdelta.com/templates/trades_nav.ejs', '061f24f6af792e99500275927fa2345e');
checkFile('https://etherdelta.com/templates/trades_progress.ejs', '73d55d9cf9b34860dd8245e3eaf209bb');
checkFile('https://etherdelta.com/templates/transferForm.ejs', '2c7e05dac58794b214907e3834b1bc19');
checkFile('https://etherdelta.com/templates/volume.ejs', '867a59a6ed2a350bb921082b38a55a57');
checkFile('https://etherdelta.com/templates/withdrawForm.ejs', '622448c87d914d9abfbade96175336c3');


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