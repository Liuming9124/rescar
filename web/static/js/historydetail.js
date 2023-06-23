function updateDisplayRange(startDate, startTime, endDate, endTime, displayRange) {
    const startValue = startDate.value;
    const startTimeValue = startTime.value;
    const endValue = endDate.value;
    const endTimeValue = endTime.value;
  
    displayRange.textContent = `目前顯示時間範圍：${startValue} ${startTimeValue} ~ ${endValue} ${endTimeValue}`;
  }
  
  const form = document.getElementById('serarchOrderBtn');
  const startDate = document.getElementById('startDate');
  const startTime = document.getElementById('dataset1');
  const endDate = document.getElementById('endDate');
  const endTime = document.getElementById('dataset2');
  const displayRange = document.getElementById('display-range');
  
  form.addEventListener('submit', function(event) {
    updateDisplayRange(startDate, startTime, endDate, endTime, displayRange);
    
  });
function historydetail(oid) {
    // 在這裡執行您的代碼，根據ID區分不同的元素
    // JavaScript
    const requestData = { id: oid };

    fetch('/history/historyCartSearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(response => {
            // 這裡是您對返回數據的處理邏輯
            var data = response
            // alert(` data: ${JSON.stringify(data)}`)  // 印出回傳的data
            const total = data.reduce((accumulator, currentValue) => {
                return accumulator + Number(currentValue.price);
            }, 0);

            var cartdetail = ''
            for (var i = 0; i < data.length; i++) {
                cartdetail += `
                <tr>
                <td>${i + 1}</td>
                <td>${data[i].name}</td>
                <td>${data[i].amt}</td>
                <td>${data[i].price}</td>
                <td>${data[i].amt*data[i].price}</td>
                </tr>
                `
            }
            var html =
                `
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <form>
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 class="modal-title itemname" id="myModalLabel">訂單明細 ${oid}</h4>
                                <p>訂單日期：</p>
                            </div>
                            <div class="modal-body">
                                <table class="table table-striped text-center">
                                    <tr>
                                        <td>項次</td>
                                        <td>品名</td>
                                        <td>數量</td>
                                        <td>單價</td>
                                        <td>金額</td>
                                    </tr>
                                    ${cartdetail}
                                    <tr>
                                        <td colspan="4">訂單金額總計</td>
                                        <td style="color: crimson;font-size: 18px">${total}</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default">編輯訂單</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal">關閉</button>
                            </div>
                        </form>
                </div><!--modal-content end-->
            `

            // update html content
            var element = document.getElementById(`Modalrecord`);
            // element.outerHTML = html;  
            element.innerHTML = html
        });

}

