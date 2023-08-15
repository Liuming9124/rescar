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
        "status": "0",
        "loc":[3,1],
        "err":0,
        "battery":55,
        "stop": 0
    }
    return json_data
