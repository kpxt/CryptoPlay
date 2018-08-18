$(document).ready(function () {
    // get top 5 currencies for test build, will increase to higher amounts later
    var top5QueryURL = "https://min-api.cryptocompare.com/data/top/totalvol?limit=20&tsym=USD&extraParams=CryptoPlay"

    // two asynchronous calls are made, values are appended once both calls are complete
    // second call is dependent on symbol values returned by the first call
    var loggedIn = JSON.parse(sessionStorage.getItem("loggedIn"));
    if (loggedIn) {
        $("#userBalance").html("&#8353;10,000");
    } else {
        $("#userBalance").append("<a href='signup.html'>Login/Register</a>");
    };

    $.ajax({
        // get top 5 coins
        url: top5QueryURL,
        method: "GET"
    }).then(function (topCoinsResponse) {
        var priceParams = Object.keys(topCoinsResponse.Data).map(n => topCoinsResponse.Data[n].CoinInfo.Internal).join();

        var priceQueryURL = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + priceParams + "&tsyms=USD";

        // second AJAX call
        $.ajax({
            url: priceQueryURL,
            method: "GET"
        }).then(function (pricesResponse) {
            var pricesObj = pricesResponse.DISPLAY;
            for (var i = 0; i <= Object.keys(pricesObj).length - 1; i++) {

                var coinObjTopCoins = topCoinsResponse.Data[i];
                var coinObjPrices = pricesObj[Object.keys(pricesObj)[i]];
                var coinName = coinObjTopCoins.CoinInfo.Name;
                var row = $("<tr>").addClass("coinRow").attr("id", coinName);

                // adding accordion functionality
                row.attr("data-toggle", "collapse").attr("data-target", "#" + coinName + "-info").attr("aria-expanded", "false").attr("aria-controls", coinName + "-info");

                var icon = "http://www.cryptocompare.com" + coinObjTopCoins.CoinInfo.ImageUrl;

                // Int elements under '#' column
                var colNum = $("<td>").addClass("num").attr("index", i).text(i + 1);

                // Coin symbol under 'Symbol' column
                var colCoinSymbol = $("<td>").addClass("coinSymbol").attr("index", i).html("<img src=\"" + icon + "\" width=\"35\">");

                // Coin names under 'Name' column
                var colCoinName = $("<td>").addClass("coinName").attr("index", i).text(coinObjTopCoins.CoinInfo.FullName);

                // Market Cap under 'Market Cap' column
                var colMarketCap = $("<td>").addClass("marketCap").attr("index", i).text(coinObjPrices.USD.MKTCAP);

                // Price value under 'Price' column
                var colPrice = $("<td>").addClass("price").attr("index", i).text(coinObjPrices.USD.PRICE);

                // Supply amount under 'Available Supply' column
                var colSupply = $("<td>").addClass("availableSupply").attr("index", i).text(Math.round(coinObjTopCoins.ConversionInfo.Supply));

                // Raw value of 24 hour change, used to conditionally evaluate style of column
                var pcnt24val = coinObjPrices.USD.CHANGEPCT24HOUR
                // 24 hour change value under '%24hr' column
                var col24hrChange = $("<td>").addClass("pcnt24hr").attr("index", i).text(pcnt24val + "%");

                // This is the dummy 'more' info row
                var moreInfoRow = $("<tr>").addClass("collapse moreInfoRow").attr("id", coinName + "-info");
                moreInfoRow.append($("<td>").attr("colspan", "7").html("Hidden Info"));

                row.append(colNum).append(colCoinSymbol).append(colCoinName).append(colMarketCap).append(colPrice).append(colSupply).append(col24hrChange);
                $("#topcoins").append(row);
                $("#topcoins").append(moreInfoRow);

                // Coloration of percent change
                if (parseInt(pcnt24val) > 0) {
                    col24hrChange.css("color", "#00ce30");
                } else if (!(pcnt24val == 0)) {
                    col24hrChange.css("color", "#e20000");
                };
            };
        });
    });
});