import datetime
import json

# 讀取檔案並將每行轉換為字串陣列
with open("./web/logs.txt", "r", encoding="utf-8") as file1, open("./hardware/logs.txt", "r", encoding="utf-8") as file2:
    logs = file1.readlines() + file2.readlines()

# 將每行字串轉換為時間和 JSON 物件
log_objects = []
for log in logs:
    timestamp_str, json_str = log.split("]", 1)
    timestamp_str = timestamp_str[1:]  # 移除開頭的 "["
    timestamp = datetime.datetime.strptime(timestamp_str, "%a %b %d %Y %H:%M:%S GMT%z (%Z)")
    log_objects.append((timestamp, json.loads(json_str)))

# 根據時間對 JSON 物件排序並依序列印
log_objects.sort(key=lambda x: x[0])
for log_object in log_objects:
    print(log_object[0].strftime("%Y-%m-%d %H:%M:%S"), log_object[1])