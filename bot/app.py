import os
from slack_bolt import App
import asyncio
from prisma import Prisma
import logging
from datetime import datetime, timezone

logging.basicConfig(level=logging.DEBUG)

app = App(
    signing_secret=os.environ.get("SLACK_SIGNING_SECRET")
)


async def update_active_users():
    try:
        prisma = Prisma()
        await prisma.connect()
        active_battles = await prisma.battle.find_many(
            where={
                'duration': 0,
            }, 
            include={
                'user': True,
                'boss': True,
                'project': True
            }
        )
        now = datetime.now(timezone.utc)
        inactive_users = list(set([(battle.user.providerAccountId, battle.boss.name, battle.project.name) for battle in active_battles if (not battle.user.blacklisted and (now - battle.createdAt).seconds > 18000)]))
        for user in inactive_users:
            open_convo_inactive_user(user)
        await prisma.disconnect()
        return inactive_users
    except Exception as e:
        print(e)
        return e


def open_convo_inactive_user(info):
    channel = app.client.conversations_open(users=info[0])
    app.client.chat_postMessage(channel=channel['channel']['id'], username="RPG Messenger", markdown_text=f'''
>Hey, you. You're finally awake. 
>You were trying to fight **{info[1]}** with **{info[2]}**, right? 
>Walked right into that ambush, same as us.

*Translation: You've been in a battle for more than **five hours!***
*If you're done working on your project, this is a reminder to make sure you [finish or cancel it](https://rpg.hackclub.com/fight)*.

**Happy hacking!**

**If your session is bugged or you can't finish it for any reason, reach out to @phthallo**
                                ''')

async def main():
    while True:
        asyncio.create_task(update_active_users())
        await asyncio.sleep(7200)

if __name__ == "__main__":
    asyncio.run(main())
    app.start(port=int(os.environ.get("PORT", 3001)))

