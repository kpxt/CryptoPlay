$( document ).ready(function () {// get top 5 currencies for test build, will increase to higher amounts later
    var top5QueryURL = "https://min-api.cryptocompare.com/data/top/totalvol?limit=5&tsym=USD&extraParams=CryptoPlay"

    // return the top 5 coin symbols from the above ajax call, insert them into an array and call the below function to create a new query
    // Let's store those symbols in the variable 'coins'

    $.ajax({
        url: top5QueryURL,
        method: "GET"
    }).then(function (topCoinsResponse) {
        console.log(topCoinsResponse);
        var params = "";
        for (var i = 0; i <= 4; i++) {
            params += topCoinsResponse.Data[i].CoinInfo.Internal + ",";
        };
        var streamQueryURL = "https://min-api.cryptocompare.com/data/subsWatchlist?fsyms=" + params + "&tsym=USD&extraParams=CryptoPlay"
        $.ajax({
            url: streamQueryURL,
            method: "GET"
        }).then(function (streamResponse) {
            console.log(streamResponse);
        });
    });
});