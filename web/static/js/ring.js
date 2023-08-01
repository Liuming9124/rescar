function fetchData() {
    fetch('/ring/ringupdate')
        .then(response => response.json())
        .then(data => {
            // modify html content 
            for (i = 0; i < data.length; i++) {
                var html = ''
                if (data[i] == 0) {
                    html = `
                                <!-- Feature -->
                                <div  id="table<%=i%>" style="width: 45px; " >
                                    <a class="warning-text-ring" data-toggle="modal" data-target="Modalring"
                                         " onclick="uncall(${i + 1})">
                                        <!-- 沒人按鈴 -->
                                        <a>
                                            &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                                        </a>
                                    </a>
                                </div>
                        `
                }
                else {
                    html = `
                        <!-- Feature -->
                        <div  id="table<%=i%>" style="width: 45px; " >
                            <!-- 有人按鈴 -->
                            <a class=" warning-text-ring" data-toggle="modal" data-target=".bs-example-modal-sm"  onclick="uncall(${i + 1})">
                                    <span class="glyphicon glyphicon-bell"aria-hidden="true"  ></span>
                            </a>
                        </div>
                        `

                }

                // update html content
                var element = document.getElementById(`table${i}`);
                // element.outerHTML = html;  
                element.innerHTML = html
            }
        })
        .catch(error => {
            console.error('Request failed: ', error);
        });
    // fetch orders to deliver
    fetch('/robot/orderGet')
    .then(response => response.json())
    .then(data => {
        // modify html content 
        var html = ''
        for (i = 0; i < data.length; i++) {
            JSON.stringify(data)
            html = `
                <div class="flex">
                <div class="tablestyle3" style="width:110px; ">第 ${data[i].table} 桌:訂單${data[i].orderid}號</div>
                    <a href="#"><h5>
                        <div class=" warning-text" href="#" data-toggle="modal" data-target="#Modalrecord">等待送餐中</div>
                    </h5></a>
                    <button type="button" class="btn" onclick=robotRun('${data[i].orderid}','${data[i].table}') >送餐</button></button>
                </div>
            `
        }
         // update html content
         var element = document.getElementById(`tabledetail${data[i].table}`);
         // element.outerHTML = html;  
         element.innerHTML = html
     })
    .catch(error => {
        console.error('OrderGet failed: ', error);
    });
}
// this function and change the order status called robot to run
function robotRun(oid, table) {
    console.log(oid, table);
    fetch(`/robot/robotRun`, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oid: oid, table: table })
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

// var socket = new WebSocket('ws://' + window.location.hostname + ':7000');

// // Event handler for WebSocket messages
// socket.onmessage = function (event) {
//     var messagesDiv = document.getElementById('test');
//     messagesDiv.innerHTML += '<p>' + event.data + '</p>';
// };


// set interval to call api every 1 seconds
setInterval(fetchData, 1000);