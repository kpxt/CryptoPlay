$(document).ready(function () {
    // get top 5 currencies for test build, will increase to higher amounts later
    var top5QueryURL = "https://min-api.cryptocompare.com/data/top/totalvol?limit=5&tsym=USD&extraParams=CryptoPlay"

    // two asynchronous calls are made, values are appended once both calls are complete
    // second call is dependent on symbol values returned by the first call

    $.ajax({
        // get top 5 coins
        url: top5QueryURL,
        method: "GET"
    }).then(function (topCoinsResponse) {
        var priceParams = "";
        console.log(topCoinsResponse);
        for (var i = 0; i <= 4; i++) {

            var coinObj = topCoinsResponse.Data[i];
            var symbol = coinObj.CoinInfo.Name;
            var row = "<tr>";
            var rowNum = $("<td>").addClass("num").attr("index", i).text(i + 1); // Int elements under '#' column
            var rowCoinName = $("<td>").addClass("coinName").attr("index", i).text(coinObj.CoinInfo.FullName); // Coin names under 'Name' column
            var rowMarketCap = $("<td>").addClass("marketCap").attr("index", i); // Market Cap under 'Market Cap' column, no value given until price AJAX call is made
            var rowPrice = $("<td>").addClass("price").attr("index", i); // Price value under 'Price' column, no value given until price AJAX call is made
            var rowSupply = $("<td>").addClass("availableSupply").attr("index", i).text(coinObj.ConversionInfo.Supply); // Supply amount under 'Available Supply' column
            var row24hrChange = $("<td>").addClass("%24hr").attr("index", i); // 24 hour change value under '%24hr' column, no value given until price AJAX call is made

            priceParams += symbol + ",";

        };
        // second AJAX call
    });
});