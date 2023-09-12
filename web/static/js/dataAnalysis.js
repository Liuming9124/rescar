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
    var dataG={};
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



getSales(sttime, endtime, "day")
    .then(data => {
        console.log(data); // 處理返回的數據
        show = data
        const dataArray2 = Object.entries(show);
        console.log('ary',dataArray2);
        var thisData2 = '';
        for (var i=0 ; i <  dataArray2.length; i++) {
            thisData2+= `<tr>
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
        //console.log('obj',dataG);

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
        console.log('newwwwwwwG',dataG);
        
    })
    .catch(error => {
        console.error(error); // 處理錯誤
    });
getFormatMenu()
    .then(data => {
        console.log(data); // 處理返回的數據
        show = data
        dataG= data;
        //console.log('dataG',dataG);

    })
    .catch(error => {
        console.error(error); // 處理錯誤
    });