import asyncio
import websockets

async def connect_to_websocket():
    async with websockets.connect('ws://localhost:8080') as websocket:
        # Event handler for incoming messages
        async for message in websocket:
            print(f"Received message: {message}")

            # Send a response message back to the server
            response = f"Received: {message}"
            await websocket.send(response)

# Start the WebSocket client
asyncio.get_event_loop().run_until_complete(connect_to_websocket())
