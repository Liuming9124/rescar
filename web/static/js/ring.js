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
                            <section>
                                <!-- 沒人按鈴 -->
                                <a class=" warning-text-ring" data-toggle="modal" data-target=".bs-example-modal-sm">&nbsp;</a><br>
                                <div class="tablestyle3">第 ${i + 1} 桌</div><br>
                                    <a href="#"><h5>
                                        <!-- if (i%2==0){  -->
                                            <div class=" warning-text" href="#" data-toggle="modal" data-target="#Modalrecord">尚有未送餐</div>  	<!-- Modal2 -->
                                        <!--  }	 -->	
                                        <!--if (i%2==1){ -->
                                            訂單皆已送餐
                                        <!-- } -->
                                    </h5></a><br>
                                    <button type="button" class="btn">送餐</button></button>     
                            </section>
                        `
                    }
                    else {
                        html = `
                            <!-- Feature -->
                            <section>
                                <!-- 有人按鈴 -->
                                    <a class=" warning-text-ring" data-toggle="modal" data-target=".bs-example-modal-sm"  onclick="uncall(${i + 1})">
                                        <span class="glyphicon glyphicon-bell" aria-hidden="true"></span>
                                    </a><br>
                                <div class="tablestyle3">第 ${i + 1} 桌</div><br>
                                    <a href="#"><h5>
                                        <!-- if (i%2==0){  -->
                                            <div class=" warning-text" href="#" data-toggle="modal" data-target="#Modalrecord">尚有未送餐</div>  	<!-- Modal2 -->
                                        <!--  }	 -->	
                                        <!--if (i%2==1){ -->
                                            訂單皆已送餐
                                        <!-- } -->
                                    </h5></a><br>
                                    <button type="button" class="btn">送餐</button></button>     
                            </section>
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
}
var socket = new WebSocket('ws://' + window.location.hostname + ':7000');

// Event handler for WebSocket messages
socket.onmessage = function (event) {
    var messagesDiv = document.getElementById('test');
    messagesDiv.innerHTML += '<p>' + event.data + '</p>';
};


// set interval to call api every 1 seconds
setInterval(fetchData, 1000);