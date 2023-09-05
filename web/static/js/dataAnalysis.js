function geturls() {
    fetch(`/dataanalysis/getUrlCounts`, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "data": "replace this" })
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
function getSales() {
    fetch(`/dataanalysis/getRevenueSales`, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "data": "replace this" })
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
function getObjectSales() {
    fetch(`/dataanalysis/getObjectSales`, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "data": "replace this" })
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

geturls();