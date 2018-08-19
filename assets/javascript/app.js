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

        // create parameters for the second AJAX call based on the values returned by the first
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
                var row = $("<tr>").addClass("coinRow clickable").attr("id", coinName).attr("chart-loaded", "false");

                // adding accordion functionality
                row.attr("data-toggle", "collapse").attr("data-target", "#" + coinName + "-info").attr("aria-expanded", "false").attr("aria-controls", coinName + "-info").attr("role", "button");

                var icon = "http://www.cryptocompare.com" + coinObjTopCoins.CoinInfo.ImageUrl;

                // Int elements under '#' column
                var colNum = $("<td>").addClass("num").attr("index", i).text(i + 1);

                // Coin symbol under 'Symbol' column
                var colCoinSymbol = $("<td>").addClass("coinSymbol").attr("index", i).html("<img src='" + icon + "' width=\"35\">");

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

                // This is the dummy 'more info' row
                var moreInfoRow = $("<tr>").addClass("moreInfoRow collapse").attr("id", coinName + "-info").attr("aria-labelledby", coinName).attr("data-parent", "#topCoinsTable");
                var moreInfoTd = $("<td>").attr("colspan", "7");
                moreInfoRow.append(moreInfoTd);

                row.append(colNum).append(colCoinSymbol).append(colCoinName).append(colMarketCap).append(colPrice).append(colSupply).append(col24hrChange);
                $("#topcoins").append(row);
                $("#topcoins").append(moreInfoRow);

                // Coloration of percent change
                if (parseInt(pcnt24val) > 0) {
                    col24hrChange.css("color", "#00ce30");
                } else if (!(pcnt24val == 0)) {
                    col24hrChange.css("color", "#e20000");
                };
                canvasWrapper = $("<div>").addClass("canvasWrapper");
                canvasWrapper.append($("<canvas>").attr("width", "500").attr("height", "250").attr("id", coinName + "-chart"));
                moreInfoTd.append(canvasWrapper);
                // adding click handler to row
                row.on("click", function () {
                    // if this row's chart was not already loaded...
                    if (!(JSON.parse($(this).attr("chart-loaded")))) {
                        // let the program know that this row's chart is now loaded
                        $(this).attr("chart-loaded", "true");

                        // get the ID of this row
                        var thisCoin = $(this).attr("id");

                        // get context of corresponding canvas
                        var ctx = document.getElementById(thisCoin + "-chart").getContext("2d");
                        console.log(ctx)
                        // create the query for the new AJAX call
                        var historyQueryURL = "https://min-api.cryptocompare.com/data/histoday?fsym=" + thisCoin + "&tsym=USD&limit=30";

                        $.ajax({
                            url: historyQueryURL,
                            method: "GET"
                        }).then(function (historyResponse) {
                            var responseArray = historyResponse.Data;
                            console.log(responseArray);

                            // create data object to be read by Chart.js and rendered
                            var chartData = {
                                labels: [],
                                datasets: [{
                                        label: "Daily Low",
                                        data: [],
                                        backgroundColor: [
                                            "rgba(23, 162, 184, 1)"
                                        ],
                                        borderColor: [
                                            "rgba(52, 58, 64, 1)" // black
                                        ],
                                        pointBackgroundColor: "rgba(140, 0, 0)",
                                        borderWidth: 1
                                    },
                                    {
                                        label: "Closing Price at 00:00 GMT",
                                        data: [],
                                        backgroundColor: [
                                            "rgba(255, 255, 255, 1)"
                                        ],
                                        borderColor: [
                                            "rgba(23, 162, 184, 1)"
                                        ],
                                        pointBackgroundColor: "rgba(255, 0, 0, 1)",
                                        borderWidth: 1
                                    },
                                    {
                                        label: "Daily High",
                                        data: [],
                                        backgroundColor: [
                                            "rgba(52, 58, 64, 1)"

                                        ],
                                        borderColor: [
                                            "rgba(255, 255, 255, 1)" // white
                                        ],
                                        pointBackgroundColor: "rgba(255, 160, 160, 1)",
                                        borderWidth: 1
                                    }]
                            };

                            // for the data returned from the AJAX response, modify the chartData variable in order to be rendered correctly by Chart.js
                            for (var j = 0; j <= responseArray.length - 1; j++) {
                                chartData.labels.push(moment.unix(responseArray[j].time).format("MM/DD/YY"));

                                // Add Closing Price
                                chartData.datasets[1].data.push(responseArray[j].close);

                                // Add Daily High
                                chartData.datasets[2].data.push(responseArray[j].high);

                                // Add Daily Low
                                chartData.datasets[0].data.push(responseArray[j].low);
                            };

                            var chart = new Chart(ctx, {
                                type: 'line',
                                data: chartData,
                                options: {
                                    elements: {
                                        point: {
                                            radius: 0,
                                            hitRadius: 10,
                                            hoverRadius: 5
                                        }
                                    },
                                    scales: {
                                        yAxes: [{
                                            ticks: {
                                                // include a currency sign in the ticks
                                                callback: function (value, index, values) {
                                                    return "₡" + value;
                                                }
                                            }
                                        }]
                                    }
                                }
                            });

                            console.log(chartData);
                        });
                    };
                });
            };
        });
    });
    // Initial AJAX calls and table creation complete

});