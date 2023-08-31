from fastapi import FastAPI, Request,HTTPException
import json


app = FastAPI()


@app.get("/")
async def run():
    return('{"key":"value"}')
    
@app.post("/robotRun")
async def robot_run(request: Request):
    try:
        req_json = await request.json()
        print(req_json)
        # Process the JSON data here
        return {"response": "success"}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")

@app.post("/mapSet")
async def robot_run(request: Request):
    try:
        req_json = await request.json()
        print(req_json)
        # Process the JSON data here
        return {"response": "success"}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")

@app.get("/robotStatus")
async def robotstatus():
    json_data =  {
        "status": "Ready", #Moving
        "current_position":[1,1], #null
        "next_position":[2,1], #null
        "battery":"59.3%",
        "sr04_active": 1, #0
        "next_stop":[2,1] #null
    }
    return json_data
