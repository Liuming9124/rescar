from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def run():
    return('{"key":"value"}')
@app.post("/robotRun")
async def root():
    print('root called')
    return {"message": "Hello World"}
