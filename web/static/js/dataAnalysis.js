//定義全域日期變數
var today = new Date();
var year = today.getFullYear();
var month = today.getMonth() + 1;
var monthlast = today.getMonth();
var day = today.getDate().toString();
var daylast = (today.getDate() - 1).toString();
var currentMonth = `${year}-${month}`;
var lastMonth = `${year}-${monthlast}`;
var currentDate = `${year}-${month}-${day}`;
var lasttDate = `${year}-${month}-${daylast}`;
var Dateint = today.getDate()
console.log(currentDate);
var dataG = {};
// 注意: timeInterval只能有以下幾種值: day, month, season, year
var sttime = "2023-06-29";
var endtime = "2023-10-29";
function geturls(stime, etime, timeInterval) {
    return new Promise((resolve, reject) => {
        fetch(`/dataanalysis/getUrlCounts`, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ "stime": "2023-06-29", "etime": "2023-10-29", "timeInterval": "month" })
            body: JSON.stringify({ "stime": stime, "etime": etime, "timeInterval": timeInterval })
        })
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}
function getSales(stime, etime, timeInterval) {
    return new Promise((resolve, reject) => {
        fetch(`/dataanalysis/getRevenueSales`, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "stime": stime, "etime": etime, "timeInterval": timeInterval })
        })
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                console.error('Error occurred:', error);
                reject(error);
            });
    });
}
function getObjectSales(stime, etime, timeInterval) {
    return new Promise((resolve, reject) => {
        fetch(`/dataanalysis/getObjectSales`, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ "stime": "2023-06-29", "etime": "2023-10-29", "timeInterval": "month" })
            body: JSON.stringify({ "stime": stime, "etime": etime, "timeInterval": timeInterval })
        })
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}
function getFormatMenu() {
    return new Promise((resolve, reject) => {
        fetch(`/dataanalysis/getFormatMenu`, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}
//格子1
getSales(sttime, endtime, "day")
    .then(data => {
       // console.log(data); // 處理返回的數據
        show = data
        var dataArray2 = Object.entries(show);
        // console.log('格子1',dataArray2);
        var currentDateData = dataArray2.find(item => item[0] === currentDate);
        var lasttDateData = dataArray2.find(item => item[0] === lasttDate);

        var currentMonthRevenue = currentDateData ? currentDateData[1] : 0;
        var lastMonthRevenue = lasttDateData ? lasttDateData[1] : 0;

        var trendArrow;
        if (currentMonthRevenue > lastMonthRevenue) {
            trendArrow = '↑';
        } else if (currentMonthRevenue < lastMonthRevenue) {
            trendArrow = '↓';
        } else {
            trendArrow = '-';
        }
        
        var html = `
            <h4>本日營業額</h4>
            <p>NT$${currentMonthRevenue} 元</p>
            <span class="trend-arrow">${trendArrow}</span>
        `;

        var element = document.getElementById('todyEarn')
        element.innerHTML = html;
    })
    .catch(error => {
        console.error(error); // 處理錯誤
    });
//格子2
geturls(sttime, endtime, "day")
    .then(data => {
        //console.log(data); // 處理返回的數據
        show = data
        var dataArray1 = Object.entries(show);
        //console.log('格子2',dataArray1,currentDate,lasttDate);
        var thisData1 = '';
        var thisData11 = '';
        var temp = dataArray1.findIndex(item => item[0] === currentDate);
        var temp2 = dataArray1.findIndex(item => item[0] === lasttDate);
        var trendArrow;    
        //console.log('temp',temp2);
        if (temp2 !== -1) {
            if (dataArray1[temp][1] > dataArray1[temp2][1]) {
                trendArrow = '↑';
           } else if (dataArray1[temp][1] < dataArray1[temp2][1]) {
                trendArrow = '↓';
            } else {
               trendArrow = '-';
            }
        } else {
            trendArrow = '-'; // or any other default value indicating not applicable
        } 
        if (temp !== -1) {
            thisData1 += `<p>${dataArray1[temp][1]} 桌</p>`;
        }
        else {
            thisData1 += `<p>0桌</p>`;
        }

        //thisData11 += `<span class="trend-arrow">${dataArray1[temp][1] >= dataArray1[temp2][1] ? '↑' : '↓'}</span>`;

        var html = `
            <h4>本日累積來客桌次</h4>
            ${thisData1}
            <span class="trend-arrow">${trendArrow}</span>
            `;

        var element = document.getElementById('cusCountDay');
        element.innerHTML = html;
    })
    .catch(error => {
        console.error(error); // 處理錯誤
    });

//格子3&4
getSales(sttime, endtime, "month")
    .then(data => {
        //console.log(data); // 處理返回的數據
        show = data
        var dataArray1 = Object.entries(show);
        //console.log('格子3',dataArray1);
        var currentMonthData = dataArray1.find(item => item[0] === currentMonth);
        var lastMonthData = dataArray1.find(item => item[0] === lastMonth);

        var currentMonthRevenue = currentMonthData ? currentMonthData[1] : 0;
        var lastMonthRevenue = lastMonthData ? lastMonthData[1] : 0;

        var trendArrow = currentMonthRevenue >= lastMonthRevenue ? '↑' : '↓';
        var avg = (currentMonthRevenue / Dateint).toFixed(2);
        var html = `
        <h4>本月營業額</h4>
        <p>NT$${currentMonthRevenue} 元</p>
        <span class="trend-arrow">${trendArrow}</span>
    `;
        var html1 = `
    <h4>本月平均日營業額</h4>
    <p>NT$${avg} 元</p>
    `;

        var element = document.getElementById('monthEarn');
        element.innerHTML = html;
        var element1 = document.getElementById('monthEarnavg');
        element1.innerHTML = html1;
    })
    .catch(error => {
        console.error(error); // 處理錯誤
    });

//格子5
geturls(sttime, endtime, "month")
    .then(data => {
       // console.log(data); // 處理返回的數據
        show = data
        var dataArray1 = Object.entries(show);
        //console.log('格子3',dataArray1);
        var thisData1 = '';
        var thisData11 = '';
        var temp = dataArray1.findIndex(item => item[0] === currentMonth);
        var temp2 = dataArray1.findIndex(item => item[0] === lastMonth);

        if (temp !== -1) {
            thisData1 += `<p>${dataArray1[temp][1]} 桌</p>`;
        }

        thisData11 += `<span class="trend-arrow">${dataArray1[temp][1] >= dataArray1[temp2][1] ? '↑' : '↓'}</span>`;

        var html = `
            <h4>本月累積來客桌次</h4>
            ${thisData1}
            ${thisData11}
        `;

        var element = document.getElementById('cusCount');
        element.innerHTML = html;
    })
    .catch(error => {
        console.error(error); // 處理錯誤
    });


getFormatMenu()
    .then(data => {
        //console.log(data); // 處理返回的數據
        show = data
        dataG = data;
        //console.log('dataG',dataG);

    })
    .catch(error => {
        console.error(error); // 處理錯誤
    });




function getSalesValue() {
    // 獲取<select>元素
    var selectElement = document.getElementById("timeIntervalSales");

    // 獲取所選選項的值
    var selectedValue = selectElement.value;

    // 將所選值顯示在<div>中
    //var selectedValueDiv = document.getElementById("selectedValue");
    //selectedValueDiv.innerHTML = "所選值為：" + selectedValue;
    
    getSales(sttime, endtime, selectedValue)
        .then(data => {
            //console.log(data); // 處理返回的數據
            show = data
            var dataArray2 = Object.entries(show);
            dataArray2.sort(function (a, b) {
                var dateA = new Date(a[0]);
                var dateB = new Date(b[0]);
                return dateA - dateB;
            });
           // console.log('ary', dataArray2);
            var thisData2 = '';
            for (var i = 0; i < dataArray2.length; i++) {
                thisData2 += `<tr>
                                <td>${dataArray2[i][0]}</td>
                                <td>${dataArray2[i][1]}</td>
                            </tr> 
                            `
            }
            var html = `
                    <table class="revenue-table">
                        <caption>店家營收</caption>
                                <tr>
                                    <th>日期</th>
                                    <th>總營收</th>
                                </tr>
                                ${thisData2}  
                    </table>
                        
                    `
            var element = document.getElementById('revenueForm')
            element.innerHTML = html;
            // Line Chart Data
           
            
            // Function to create or update the chart
            function createOrUpdateChart() {
                var canvas = document.getElementById('lineChart'); // Get the canvas element
                
                // Check if a chart instance already exists and destroy it
                var existingChart = Chart.getChart(canvas);
                if (existingChart) {
                    console.log("Existing Chart Instance:", existingChart);
                    existingChart.destroy();
                    console.log("Chart Destroyed");
                }
                var labels = [];
                var data1 = [];
                var lineChart = null;
                
                var canvas = document.getElementById('lineChart'); // Get the canvas element
                for (var i = 0; i < dataArray2.length; i++) {
                    labels.push(dataArray2[i][0]);
                    data1.push(dataArray2[i][1]);
                }
            
                var lineData = {
                    labels: labels,
                    datasets: [{
                        label: 'Sales',
                        data: data1,
                        borderColor: '#FF6384',
                        fill: false
                    }]
                };
            
                // Check if a chart instance already exists and destroy it
                
                
                
                // Create a new Chart instance
                lineChart = new Chart(canvas, {
                    type: 'line',
                    data: lineData,
                    options: {},
                    // Add this line to set a unique ID for the chart
                    id: 'lineChartInstance'
                });
                
            }
            
            // Call the function to create or update the chart
            createOrUpdateChart();
            

        })
        .catch(error => {
            console.error(error); // 處理錯誤
        });
}
function getType() {
    // 獲取<select>元素
    var selectElement = document.getElementById("type2");

    // 獲取所選選項的值
    var selectedValue = selectElement.value;
    var thisData2 = '';
    for (var nameId in dataG[selectedValue]) {
        var nameData = dataG[selectedValue][nameId];
        var nameName = nameData["name"];
        //console.log('nameName',nameName);
        thisData2 += `
                    <option value="${nameName}">${nameName}</option>
                     `
      }
    // 將所選值顯示在<div>中
    var html = `
                <select class="type_choose" name="c2" id="product2">
                     <option disabled selected>**請選擇商品**</option>
                     ${thisData2}
                </select>
			    `
        var element = document.getElementById('productchoose')
        element.innerHTML = html;
}

//各類商品銷售分析
async function processData(Interval, selectedType) {
    try {
        var data = await getObjectSales(sttime, endtime, Interval);
        var labels = [];
        var data1 = [];
        var backgroundColor = ['#FF5733', '#ff8c00', '#FFD700', '#4CAF50', '#3498DB', '#9B59B6', '#FF1493', '#00CED1', '#FF4500', '#8B008B', '#00FF7F', '#4169E1', '#FF00FF', '#00FF00', '#FFA500', '#1E90FF', '#FFC0CB', '#7FFF00', '#FF69B4', '#00BFFF'];

        for (var key in dataG[selectedType]) {
            var item = dataG[selectedType][key];
            labels.push(item["name"]);
            data1.push(item["count"]);
        }

        var pieData = {
            labels: labels,
            datasets: [{
                data: data1,
                backgroundColor: backgroundColor.slice(0, labels.length)
            }]
        };

        // Get the canvas element by ID
        var canvas = document.getElementById('pieChart');

        // Check if there's an existing chart on the canvas
        if (canvas.chart) {
            canvas.chart.destroy(); // Destroy the existing chart
        }

        var pieChart = new Chart(canvas, {
            type: 'pie',
            data: pieData,
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                var label = context.label || '';
                                var value = context.raw || '';
                                return label + ': ' + value;
                            }
                        }
                    }
                }
            }
        });

        // Store the chart instance on the canvas element
        canvas.chart = pieChart;

    } catch (error) {
        console.error(error);
    }
}
function handleButtonClick1(event) {
    event.preventDefault(); // 防止表單提交
    var typeSelect = document.getElementById("type1");
    var timeIntervalSelect = document.getElementById("timeInterval1");
    var selectedValues2Div = document.getElementById("selectedValues1");
    // 獲取所選擇的值
    var selectedType = typeSelect.value;
    var selectedTimeInterval = timeIntervalSelect.value;
    //console.log(`Selected Type: ${selectedType}`);
    // 在選擇的值的 <div> 元素中顯示它
   // selectedValues2Div.textContent = `選擇的種類是：${selectedType}, 選擇的區間是：${selectedTimeInterval}`;

    
    getObjectSales(sttime, endtime, selectedTimeInterval)
        .then(data => {
            //console.log(data); // 處理返回的數據
            show = data
            var dataArray = Object.entries(show);
            var dataArray1 = Object.entries(dataG);
           // console.log('obj', dataG);

            // 創建一個空的二維數組
            var twoDimensionalArray = [];

            // 遍歷每個月份的數據
            for (var month in show) {
                if (show.hasOwnProperty(month)) {
                    // 創建一個空的子數組來存放每個月份的數據
                    var monthData = [];
                    // 遍歷每個食物項目和數量
                    for (var item in show[month]) {
                        if (show[month].hasOwnProperty(item)) {
                            // 將食物項目和數量作為一個數組添加到子數組中
                            monthData.push([item, show[month][item]]);
                        }
                    }
                    // 將每個月份的數據子數組添加到二維數組中
                    twoDimensionalArray.push([month, monthData]);
                }
            }
            // 打印整理後的二維數組
            for (var i = 0; i < twoDimensionalArray.length; i++) {
                var date = twoDimensionalArray[i][0];
                var items = twoDimensionalArray[i][1];
                for (var j = 0; j < items.length; j++) {
                    var itemName = items[j][0];
                    var itemCount = items[j][1];
                    for (var category in dataG) {
                        for (var itemID in dataG[category]) {
                            if (dataG[category][itemID].name === itemName) {
                                dataG[category][itemID].count += itemCount;
                            }
                        }
                    }
                }
            }
            console.log('newwwwwwwG', dataG);
            return dataG;

        })
        .then(dataG => {    // 加一個then確保上面的操作完成後再執行下面的操作
            processData(selectedTimeInterval,selectedType);
        })
        .catch(error => {
            console.error(error); // 處理錯誤
        });
    //piechart
    
    
}

// 獲取按鈕元素並添加點擊事件監聽器
var searchButton0 = document.getElementById("search0");
searchButton0.addEventListener("click", handleButtonClick1);


//單項商品銷售分析

function handleButtonClick2(event) {
    event.preventDefault(); // 防止表單提交
    var typeSelect = document.getElementById("type2");
    var timeIntervalSelect = document.getElementById("timeInterval2");
    var selectedType = typeSelect.value;
    var selectedTimeInterval = timeIntervalSelect.value;
    // 使用 setTimeout 延遲執行獲取 productSelect 的值
    setTimeout(() => {
        var productSelect = document.getElementById("product2");
        var selectedValues2Div = document.getElementById("selectedValues2");
        var selectedProduct = productSelect.value;
        

        // 在選擇的值的 <div> 元素中顯示它
        //selectedValues2Div.textContent = `選擇的種類是：${selectedType}, 選擇的商品是：${selectedProduct}, 選擇的區間是：${selectedTimeInterval}`;
        getObjectSales(sttime, endtime, selectedTimeInterval)
        .then(data => {
            console.log(data); // 處理返回的數據
            show = data
            var dataArray3 = Object.entries(show);
            dataArray3.sort(function (a, b) {
                var dateA = new Date(a[0]);
                var dateB = new Date(b[0]);
                return dateA - dateB;
            });
            console.log('ary', dataArray3);

            //BAR CHART
            var labels = [];
            var data = [];

            for (var i = 0; i < dataArray3.length; i++) {
                var date = dataArray3[i][0];
                var sales = dataArray3[i][1][selectedProduct];
                labels.push(date);
                data.push(sales);
            }
            //setTimeout(() => {})
            var salesData = {
                labels: labels,
                datasets: [{
                    label: selectedProduct,
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', // 長條的背景顏色
                    borderColor: 'rgba(54, 162, 235, 1)', // 長條的邊框顏色
                    borderWidth: 1 // 邊框寬度
                }]
            };

            var chartConfig = {
                type: 'bar',
                data: salesData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true // y 軸從 0 開始
                        }
                    }
                }
            };

            var ctx = document.getElementById('salesChart').getContext('2d');
            if (window.myBarChart) {
                window.myBarChart.destroy();
            }
            window.myBarChart = new Chart(ctx, chartConfig);


        })
        .catch(error => {
            console.error(error); // 處理錯誤
        });
    }, 0);
   
       
}

// 獲取按鈕元素並添加點擊事件監聽器
var searchButton1 = document.getElementById("search1");
searchButton1.addEventListener("click", handleButtonClick2);



document.addEventListener("DOMContentLoaded", function() {
    // 在頁面載入完成後執行
    getSalesValue();
});


  