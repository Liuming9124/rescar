// 注意: timeInterval只能有以下幾種值: day, month, season, year
function geturls(stime, etime, timeInterval) {
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
            console.log(data);
        })
        .catch(error => {
            console.error('Error occurred:', error);
            // Handle any errors that occurred during the fetch
        });
}
function getSales(stime, etime, timeInterval) {
    fetch(`/dataanalysis/getRevenueSales`, {
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
            console.log(data);
        })
        .catch(error => {
            console.error('Error occurred:', error);
            // Handle any errors that occurred during the fetch
        });
}
function getObjectSales(stime, etime, timeInterval) {
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
            console.log(data);
        })
        .catch(error => {
            console.error('Error occurred:', error);
            // Handle any errors that occurred during the fetch
        });
}
function getFormatMenu() {
    fetch(`/dataanalysis/getFormatMenu`, {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error occurred:', error);
            // Handle any errors that occurred during the fetch
        });
}

getSales("2023-06-29", "2023-10-29", "month");