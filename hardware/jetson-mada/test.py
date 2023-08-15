import datetime

now = datetime.datetime.now(tz=datetime.timezone(datetime.timedelta(hours=8)))
print(now)                # 2021-10-19 14:25:46.962975+08:00
print(now.date())         # 2021-10-19
print(now.time())         # 14:25:46.962975
print(now.tzname())       # UTC+08:00
print(now.weekday())      # 1
print(now.isoweekday())   # 2
print(now.isocalendar())  # (2021, 42, 2)
print(now.isoformat())    # 2021-10-19 14:25:46.962975+08:00
print(now.ctime())        # Tue Oct 19 14:48:38 2021
print(now.strftime('%Y/%m/%d %H:%M:%S'))  # 2021/10/19 14:48:38

time = '[%s GMT+0800 (台北標準時間)]' % now.strftime('%a %b %d %Y %H:%M:%S')
print(time)
