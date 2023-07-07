import asyncio
import time
import websockets
import json

async def connect_to_websocket():
    while True:
        try:
            async with websockets.connect('ws://localhost:7000') as websocket:
                time.sleep(3)
                # Send a message to the server when the WebSocket connection is established
                await websocket.send("WebSocket connection established")

                # Send some data to the server
                data = {'name': 'Alice', 'age': 30}
                await websocket.send(json.dumps(data))

                # Event handler for incoming messages
                async for message in websocket:
                    time.sleep(3)
                    print(f"Received message: {message}")

                    # Send a response message back to the server
                    response = f"{message}"
                    await websocket.send(response)
        except websockets.ConnectionClosedError:
            # Handle the connection closed error and attempt to reconnect
            print("Connection closed. Reconnecting...")
            await asyncio.sleep(5)  # Wait for 5 seconds before reconnecting
        except Exception as e:
            print(f"An error occurred: {e}")
            break  # Break out of the while loop if an error occurs

# Start the WebSocket client
asyncio.get_event_loop().run_until_complete(connect_to_websocket())
