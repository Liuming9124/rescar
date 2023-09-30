fetchData();
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
                                    <a class="warning-text-ring" data-toggle="modal" data-target="Modalring"
                                         " onclick="uncall(${i + 1})">
                                         <a class=" warning-text-ring" data-toggle="modal" data-target=".bs-example-modal-sm"  onclick="uncall(${i + 1})">
                                        <!-- 沒人按鈴 -->
                                        <a>
                                            &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                                        </a>
                                    </a>
                        `
                }
                else {
                    html = `
                        <!-- Feature -->
                            <!-- 有人按鈴 -->
                            <a class=" warning-text-ring" data-toggle="modal" data-target=".bs-example-modal-sm"  onclick="uncall(${i + 1})">
                            <span class="glyphicon glyphicon-bell" aria-hidden="true"></span>
                        </a><br>
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
            var html = '';
            var element = document.getElementById(`test`);
                    
            for (i = 0; i < data.length; i++) {
                JSON.stringify(data)
                console.log(data);  //onclick=robotRun('${data[i].orderid}','${data[i].table}')
                html += `
                <div style="text-align: center;">
                    <button class="robot-box"type="robot-box-${data[i].orderid}"  name="robot-box-${data[i].orderid}" id="robot-box-${data[i].orderid}" onclick="toggleColor(this)">
                        <span>
                            內用${data[i].table}桌<br>
                            訂單編號<br>${data[i].orderid}
                        </span>
                    </button>
                </div>&nbsp&nbsp&nbsp&nbsp
                        
                `
            }
            element.innerHTML = html;
            var html1 = '';
            var a = {};
            for (var i = 0; i < data.length; i++) {
                var tableValue = data[i].table.trim();
                if (tableValue !== '') {
                    a[tableValue] = 1; // Assign 1 to the table as a key in the object
                }
            }
            for (var i = 1; i <= 6; i++) {
                if(a[i] == 1){
                    html1 = `
                        <a href="#">
                            <h5>
                            <div href="#" class="warning-text" data-toggle="modal"data-target="#Modalrecord" style="width: 110px;">尚有未送餐</div>
                            </h5>
                        </a>
                `;
                }
                else{
                    html1 = `
                        <a href="#">
                            <h5>
                                <div href="#" data-toggle="modal"data-target="#Modalrecord" style="width: 110px;">訂單皆已送餐</div>
                            </h5>
                        </a>    
                `;
                }
                var element1 = document.getElementById(`tabledetail${i-1}`); // Replace "your-target-element" with the actual ID of the container where you want to display the generated HTML
                element1.innerHTML = html1;
            }
        })
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
        .then(response => {
            console.log(response);
            if (response.status == 200) {
                alert('成功下達指令')
            }else{
                alert('下達指令失敗')
            }
            
        })
        .catch(error => {
            console.error('Error occurred:', error);
            // Handle any errors that occurred during the fetch
        });
}
function robotStatus(){
    try{
        fetch(`/robot/robotStatus`, {
            method: 'Get',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                document.getElementById('robotStatus').innerHTML= JSON.stringify(data);
            })
            .catch(error => {
                console.log('Error occurred:', error);
                document.getElementById('robotStatus').innerHTML= '機器人離線中';
                // Handle any errors that occurred during the fetch
            });
    }catch(e){
        alert(e);
    }
}
function toggleColor(button) {
    const currentColor = button.style.backgroundColor;
    const defaultColor = 'rgb(255, 255, 255)';

    if (currentColor === defaultColor || currentColor === '') {
      button.style.backgroundColor = "#fcb9b1";
      button.style.color = "#fff";
    } else {
      button.style.backgroundColor = defaultColor;
      button.style.color = "#ed786a";
    }
  }
// var socket = new WebSocket('ws://' + window.location.hostname + ':7000');

// // Event handler for WebSocket messages
// socket.onmessage = function (event) {
//     var messagesDiv = document.getElementById('test');
//     messagesDiv.innerHTML += '<p>' + event.data + '</p>';
// };


// set interval to call api every 1 seconds
setInterval(fetchData, 1000);
setInterval(robotStatus, 500);