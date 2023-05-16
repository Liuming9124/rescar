import asyncio
import websockets

async def handler(websocket, path):
    async for message in websocket:
        print(f"received message from Node.js: {message}")
        response = f"Python received message: {message}"
        await websocket.send(response)

start_server = websockets.serve(handler, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()