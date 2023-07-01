import asyncio
import websockets
import time

async def connect_to_websocket():
    async with websockets.connect('ws://localhost:7000') as websocket:
        # Event handler for incoming messages
        i = 1
        async for message in websocket:
            i+=1
            print(f"Received message: {message}")
            time.sleep(3)

            # Send a response message back to the server
            response = f"Received: {message} : {i}"
            await websocket.send(response)

# Start the WebSocket client
asyncio.get_event_loop().run_until_complete(connect_to_websocket())
