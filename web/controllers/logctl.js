const fs = require('fs');

const logController = {
    userlog: (req, res) => {
        try {
            var logs = req.body;

            // 要寫入的logs字串，這裡要有現在時間，事件，使用者，動作，狀態
            var logs = "["+ new Date() +"]" + JSON.stringify(logs)+"\n";
            // var logs = "test\n"
            // 檔案路徑
            const filePath = './logs.txt';
            // 使用fs.appendFile將logs寫入到檔案中
            fs.appendFile(filePath, logs, (err) => {
                if (err) throw err;
                console.log('Logs have been written to the file.');
                console.log(logs)
                res.send(200)
            });
        }catch(e){
            console.log(e)
        }
    }
}

module.exports = logController
