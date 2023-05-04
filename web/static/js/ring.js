function fetchData() {
    // create XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // set XMLHttpRequest object
    xhr.open('GET', 'http://localhost:7000/ring/ringupdate', true);

    // set response type to json
    xhr.responseType = 'json';

    // send request
    xhr.send();

    // handle response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // success response returned from server
                var data = (xhr.response);
                var i=0
                for (i=0;i<data.length;i++){
                    var html=''
                    if (data[i]==0){
                        html=`
                            <!-- Feature -->
                            <section>
                                <!-- 有人按鈴 -->
                                    <a>&nbsp;</a><br><br>
                                <div class="tablestyle3">第 ${i+1} 桌</div><br>
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
                    else{
                        html=`
                            <!-- Feature -->
                            <section>
                                <!-- 沒人按鈴 -->
                                    <a class="warning-text" data-toggle="modal" data-target=".bs-example-modal-sm">
                                        <span class="glyphicon glyphicon-bell" aria-hidden="true"></span>
                                    </a><br><br>
                                <div class="tablestyle3">第 ${i+1} 桌</div><br>
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
                // var element = document.getElementById(`table0`);
                //     // element.outerHTML = html;  
                // element.innerHTML = data
 
            } else {
                // response returned with non-success status
                console.log('request failed');
            }
        }
    };
}

// set interval to call api every 3 seconds
setInterval(fetchData, 1000);