function uploadItem(count) {
    // 獲取表單元素
    var form = document.getElementById("uploadItem");
    // 獲取表單中所有輸入元素
    var inputs = $('#uploadItem').serializeArray();
    // 獲取表單文件輸入元素
    var fileInput = form.querySelectorAll('input[type="file"]');


    // 初始化計數器
    var counter = 0;

    // 定義一個處理回應的函數
    function handleResponse(index) {
        return function () {
            if (this.status >= 200 && this.status < 400) {
                // 請求成功，處理回應數據
                console.log('send success', index);
            } else {
                // 請求失敗，處理錯誤信息
                console.error('send Error:', this.statusText);
            }
            // 每當一個請求完成時，計數器加 1
            counter++;
            // 如果所有請求都已完成，則輸出結果
            if (counter === count) {
                console.log('All requests have been sent.');
            }
        };
    }



    // 將所有輸入元素添加到 FormData 對象中
    for (var i = 0; i < count; i++) {
        // 創建一個 FormData 對象
        var formData = new FormData();
        formData.append('name', inputs[0 + i * 4].value);
        formData.append('type', inputs[1 + i * 4].value);
        formData.append('description', inputs[2 + i * 4].value);
        formData.append('price', inputs[3 + i * 4].value);
        // 將文件添加到 FormData 對象中
        formData.append('image', fileInput[i].files[0]);

        console.log(formData)
        // 發送 POST 請求到後端
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload/uploadItem");

        // 設置處理回應的函數
        xhr.onload = handleResponse(i);
        xhr.onerror = handleResponse(i);

        xhr.send(formData);
    }
    alert("上傳成功")
}
function toggleButton(button) {
    button.parentNode.classList.toggle("selected");
  }

 function addNewname() {
    var newItem = prompt("輸入想新增的種類:");
    if (newItem) {
      var buttonGroup = document.querySelector(".button-group");
      var addButton = document.getElementById("addButton");

      var newButton = document.createElement("div");
      newButton.className = "button";
      newButton.innerHTML = "<a href='#' onclick='toggleButton(this)'>" + newItem + "</a>";

      buttonGroup.insertBefore(newButton, addButton);
    }
  }
