// 注意: timeInterval只能有以下幾種值: day, month, season, year
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

geturls("2023-06-29", "2023-10-29", "month")
    .then(data => {
        console.log(data); // 处理返回的数据
        show = data
    })
    .catch(error => {
        console.error(error); // 处理错误
    });
getSales("2023-06-29", "2023-10-29", "month")
    .then(data => {
        console.log(data); // 处理返回的数据
        show = data
    })
    .catch(error => {
        console.error(error); // 处理错误
    });
getObjectSales("2023-06-29", "2023-10-29", "month")
    .then(data => {
        console.log(data); // 处理返回的数据
        show = data
    })
    .catch(error => {
        console.error(error); // 处理错误
    });
getFormatMenu()
    .then(data => {
        console.log(data); // 处理返回的数据
        show = data
    })
    .catch(error => {
        console.error(error); // 处理错误
    });