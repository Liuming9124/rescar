//定義全域日期變數
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const monthlast = today.getMonth();
const day = today.getDate().toString();
const daylast = (today.getDate() - 1).toString();
const currentMonth = `${year}-${month}`;
const lastMonth = `${year}-${monthlast}`;
const currentDate = `${year}-${month}-${day}`;
const lasttDate = `${year}-${month}-${daylast}`;
const Dateint = today.getDate()
console.log(currentDate);
var dataG = {};
// 注意: timeInterval只能有以下幾種值: day, month, season, year
const sttime = "2023-06-29";
const endtime = "2023-10-29";
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
        console.log(data); // 處理返回的數據
        show = data
        const dataArray2 = Object.entries(show);
        // console.log('格子1',dataArray2);
        const currentDateData = dataArray2.find(item => item[0] === currentDate);
        const lasttDateData = dataArray2.find(item => item[0] === lasttDate);

        const currentMonthRevenue = currentDateData ? currentDateData[1] : 0;
        const lastMonthRevenue = lasttDateData ? lasttDateData[1] : 0;

        const trendArrow = currentMonthRevenue >= lastMonthRevenue ? '↑' : '↓';

        const html = `
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
        console.log(data); // 處理返回的數據
        show = data
        const dataArray1 = Object.entries(show);
        //console.log('格子2',dataArray1,currentDate,lasttDate);
        var thisData1 = '';
        var thisData11 = '';
        var temp = dataArray1.findIndex(item => item[0] === currentDate);
        var temp2 = dataArray1.findIndex(item => item[0] === lasttDate);

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
            <span class="trend-arrow">?</span>
        `;

        var element = document.getElementById('cusCountDay');
        element.innerHTML = html;
    })
    .catch(error => {
        console.error(error); // 處理錯誤
    });

//格子3&5
getSales(sttime, endtime, "month")
    .then(data => {
        console.log(data); // 處理返回的數據
        show = data
        const dataArray1 = Object.entries(show);
        //console.log('格子3',dataArray1);
        const currentMonthData = dataArray1.find(item => item[0] === currentMonth);
        const lastMonthData = dataArray1.find(item => item[0] === lastMonth);

        const currentMonthRevenue = currentMonthData ? currentMonthData[1] : 0;
        const lastMonthRevenue = lastMonthData ? lastMonthData[1] : 0;

        const trendArrow = currentMonthRevenue >= lastMonthRevenue ? '↑' : '↓';
        const avg = (currentMonthRevenue / Dateint).toFixed(2);
        const html = `
        <h4>本月營業額</h4>
        <p>NT$${currentMonthRevenue} 元</p>
        <span class="trend-arrow">${trendArrow}</span>
    `;
        const html1 = `
    <h4>本月平均日營業額</h4>
    <p>NT$${avg} 元</p>
    `;

        const element = document.getElementById('monthEarn');
        element.innerHTML = html;
        const element1 = document.getElementById('monthEarnavg');
        element1.innerHTML = html1;
    })
    .catch(error => {
        console.error(error); // 處理錯誤
    });

//格子4
geturls(sttime, endtime, "month")
    .then(data => {
        console.log(data); // 處理返回的數據
        show = data
        const dataArray1 = Object.entries(show);
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


getObjectSales(sttime, endtime, "month")
    .then(data => {
        console.log(data); // 處理返回的數據
        show = data
        const dataArray = Object.entries(show);
        const dataArray1 = Object.entries(dataG);
        console.log('obj', dataG);

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
        // document.getElementById('test').innerHTML = JSON.stringify(dataG);
    })
    .catch(error => {
        console.error(error); // 處理錯誤
    });
getFormatMenu()
    .then(data => {
        console.log(data); // 處理返回的數據
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
            console.log(data); // 處理返回的數據
            show = data
            const dataArray2 = Object.entries(show);
            dataArray2.sort(function (a, b) {
                var dateA = new Date(a[0]);
                var dateB = new Date(b[0]);
                return dateA - dateB;
            });
            console.log('ary', dataArray2);
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
            var labels = [];
            var data1 = [];

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

            lineChart = new Chart(document.getElementById('lineChart'), {
                type: 'line',
                data: lineData,
                options: {}
            });
        

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
    for (const nameId in dataG[selectedValue]) {
        const nameData = dataG[selectedValue][nameId];
        const nameName = nameData["name"];
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

function handleButtonClick1(event) {
    event.preventDefault(); // 防止表單提交
    const typeSelect = document.getElementById("type1");
    const timeIntervalSelect = document.getElementById("timeInterval1");
    const selectedValues2Div = document.getElementById("selectedValues1");
    // 獲取所選擇的值
    const selectedType = typeSelect.value;
    const selectedTimeInterval = timeIntervalSelect.value;

    // 在選擇的值的 <div> 元素中顯示它
    selectedValues2Div.textContent = `選擇的種類是：${selectedType}, 選擇的區間是：${selectedTimeInterval}`;
    //piechart
    async function processData() {
        try {
            var data = await getFormatMenu();
            var labels = [];
            var data1 = [];
            var backgroundColor = ['#FF5733', '#ff8c00', '#FFD700', '#4CAF50', '#3498DB', '#9B59B6', '#FF1493', '#00CED1', '#FF4500', '#8B008B', '#00FF7F', '#4169E1', '#FF00FF', '#00FF00', '#FFA500', '#1E90FF', '#FFC0CB', '#7FFF00', '#FF69B4', '#00BFFF'];
            for (var key in dataG["壽司"]) {
                var item = dataG["壽司"][key];
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
            console.log('labels', labels);
            console.log('data1', data1);
            var pieChart = new Chart(document.getElementById('pieChart'), {
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
        } catch (error) {
            console.error(error);
        }
    }
    
    processData();
}

// 獲取按鈕元素並添加點擊事件監聽器
const searchButton0 = document.getElementById("search0");
searchButton0.addEventListener("click", handleButtonClick1);


//單項商品銷售分析

function handleButtonClick2(event) {
    event.preventDefault(); // 防止表單提交
    const typeSelect = document.getElementById("type2");
    const timeIntervalSelect = document.getElementById("timeInterval2");
    const selectedType = typeSelect.value;
    const selectedTimeInterval = timeIntervalSelect.value;
    // 使用 setTimeout 延遲執行獲取 productSelect 的值
    setTimeout(() => {
        const productSelect = document.getElementById("product2");
        const selectedValues2Div = document.getElementById("selectedValues2");
        const selectedProduct = productSelect.value;
        

        // 在選擇的值的 <div> 元素中顯示它
        selectedValues2Div.textContent = `選擇的種類是：${selectedType}, 選擇的商品是：${selectedProduct}, 選擇的區間是：${selectedTimeInterval}`;
        getObjectSales(sttime, endtime, selectedTimeInterval)
        .then(data => {
            console.log(data); // 處理返回的數據
            show = data
            const dataArray3 = Object.entries(show);
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
            const salesData = {
                labels: labels,
                datasets: [{
                    label: selectedProduct,
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', // 長條的背景顏色
                    borderColor: 'rgba(54, 162, 235, 1)', // 長條的邊框顏色
                    borderWidth: 1 // 邊框寬度
                }]
            };

            const chartConfig = {
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

            const ctx = document.getElementById('salesChart').getContext('2d');
            new Chart(ctx, chartConfig);


        })
        .catch(error => {
            console.error(error); // 處理錯誤
        });
    }, 0);
   
       
}

// 獲取按鈕元素並添加點擊事件監聽器
const searchButton1 = document.getElementById("search1");
searchButton1.addEventListener("click", handleButtonClick2);


