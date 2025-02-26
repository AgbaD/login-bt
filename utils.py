from telethon import TelegramClient
import json
import asyncio

# Load configuration
with open('config.json', 'r') as f:
    config = json.load(f)

async def login_to_account(client, phone_number):
    await client.connect()
    if not await client.is_user_authorized():
        phone_code_hash = await client.send_code_request(phone_number)
        code = input(f'Enter the code for {phone_number}: ')
        await client.sign_in(phone_number, code, phone_code_hash=phone_code_hash)

def initialize_account(phone_number):
    account_arr = [account for account in config['accounts'] if account['phone_number'] == phone_number]
    if (len(account_arr) < 1):
        print('Account not found.')
        return None
    account = account_arr[0]
    session_name = f"session_{account['phone_number']}"
    client = TelegramClient(session_name, account['api_id'], account['api_hash'])
    # await login_to_account(client, account['phone_number'])
    return client

async def send_message(client, phone_number, recipient, message):
    if client:
        await client.send_message(recipient, message)
        print(f'Message sent from {phone_number} to {recipient}')
    else:
        print('Account not found.')

p_number = input('Enter login number: ')
client = initialize_account(p_number)

# Main function to run the script
async def main():
    await login_to_account(client, p_number)
    while True:
        action = input("Enter action (send_message/exit): ")
        if action == "send_message":
            phone_number = input("Enter the phone number of the account to use: ")
            recipient = input("Enter the recipient username or phone number: ")
            message = input("Enter the message: ")
            await send_message(client, phone_number, recipient, message)
        elif action == "exit":
            break
        else:
            print("Invalid action. Please try again.")

    await client.disconnect()

# Run the script
# loop = asyncio.get_event_loop()
# loop.run_until_complete(main())


with client:
    client.loop.run_until_complete(main())