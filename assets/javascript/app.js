$(document).ready(function () {
    // get top 5 currencies for test build, will increase to higher amounts later
    var top5QueryURL = "https://min-api.cryptocompare.com/data/top/totalvol?limit=20&tsym=USD&extraParams=CryptoPlay"

    // two asynchronous calls are made, values are appended once both calls are complete
    // second call is dependent on symbol values returned by the first call

    $.ajax({
        // get top 5 coins
        url: top5QueryURL,
        method: "GET"
    }).then(function (topCoinsResponse) {
        var priceParams = "";

        for (var i = 0; i <= 19; i++) {

            var coinObj = topCoinsResponse.Data[i];
            var symbol = coinObj.CoinInfo.Name;
            var icon = "http://www.cryptocompare.com" + coinObj.CoinInfo.ImageUrl;
            console.log(coinObj);
            var row = $("<tr>");
            // Int elements under '#' column
            var colNum = $("<td>").addClass("num").attr("index", i).text(i + 1);
            // Coin symbol under 'Symbol' column
            var colCoinSymbol = $("<td>").addClass("coinSymbol").attr("index", i).html("<img src=\"" + icon + "\" width=\"35\">");
            // Coin names under 'Name' column
            var colCoinName = $("<td>").addClass("coinName").attr("index", i).text(coinObj.CoinInfo.FullName);
            // Market Cap under 'Market Cap' column, no value given until price AJAX call is made
            var colMarketCap = $("<td>").addClass("marketCap").attr("index", i);
            // Price value under 'Price' column, no value given until price AJAX call is made
            var colPrice = $("<td>").addClass("price").attr("index", i).text("");
            // Supply amount under 'Available Supply' column
            var colSupply = $("<td>").addClass("availableSupply").attr("index", i).text(Math.round(coinObj.ConversionInfo.Supply));
            // 24 hour change value under '%24hr' column, no value given until price AJAX call is made
            var col24hrChange = $("<td>").addClass("pcnt24hr").attr("index", i).text("");
            priceParams += symbol + ",";

            row.append(colNum).append(colCoinSymbol).append(colCoinName).append(colMarketCap).append(colPrice).append(colSupply).append(col24hrChange);
            $("#topcoins").append(row);
        };
        console.log(priceParams);
        var priceQueryURL = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + priceParams + "&tsyms=USD";
        // second AJAX call
        $.ajax({
            url: priceQueryURL,
            method: "GET"
        }).then(function (pricesResponse) {
            var pricesObj = pricesResponse.DISPLAY;
            for (var j = 0; j <= Object.keys(pricesObj).length - 1; j++) {
                var coinIteration = pricesObj[Object.keys(pricesObj)[j]];
                var pcnt24val = coinIteration.USD.CHANGEPCT24HOUR
                $(".marketCap[index='" + j + "']").text(coinIteration.USD.MKTCAP);
                $(".price[index='" + j + "']").text(coinIteration.USD.PRICE);
                var pcnt24elem = $(".pcnt24hr[index='" + j + "']").text(pcnt24val + "%");
                if (parseInt(pcnt24val) > 0) {
                    pcnt24elem.css("color", "#00ce30");
                } else {
                    pcnt24elem.css("color", "#e20000");
                }
            };
        });
    });
});