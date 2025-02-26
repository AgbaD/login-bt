from telethon import TelegramClient

# Remember to use your own values from my.telegram.org!
api_id = 25772720
api_hash = 'dc9f42174c086ecfacb314aa300a77f3'
client = TelegramClient('anon', api_id, api_hash)

async def main():
    me = await client.get_me()
    print(me.stringify())

    # When you print something, you see a representation of it.
    # You can access all attributes of Telegram objects with
    # the dot operator. For example, to get the username:
    username = me.username
    print(username)
    print(me.phone)

    # You can print all the dialogs/conversations that you are part of:
    async for dialog in client.iter_dialogs():
        print(dialog.name, 'has ID', dialog.id)

    # You can send messages to yourself...
    await client.send_message('me', 'Hello, myself!')
    # ...or even to any username
    await client.send_message('blankgodd', 'Testing Telethon!')

    # You can, of course, use markdown in your messages:
    message = await client.send_message(
        'me',
        'This message has **bold**, `code`, __italics__ and '
        'a [nice website](https://example.com)!',
        link_preview=False
    )

    # You can reply to messages directly if you have a message object
    await message.reply('Cool!')

    # You can print the message history of any chat:
    async for message in client.iter_messages('me'):
        print(message.id, message.text)


with client:
    client.loop.run_until_complete(main())