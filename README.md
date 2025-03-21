# rpg

RPG ([rpg.hackclub.com](https://rpg.hackclub.com)) is a gamified YSWS where you defeat bosses and earn treasure by spending time on personal projects. 

Earn a physical trading card + stickers of the bosses you helped defeat, plus bonus loot 👀 for all adventurers.

## Development
This project uses Next.js, React, TailwindCSS, and Prisma, as well as Auth.js.

1. Clone the repository.
    ```
    git clone https://github.com/phthallo/rpg && cd rpg
    ```

2. Install dependencies. ([install bun](https://bun.sh/docs/installation))
    ```
    bun install 
    ```

3. Configure a [Prisma Postgres database](https://www.prisma.io/). Make note of the connection URL you are given.

4. Configure a [Slack app](https://api.slack.com/apps) for use with authentication (the 'Sign in with Slack feature). Paste  the provided [manifest.json](/manifest.json) file when prompted to replicate the default settings.

    Under **OAuth & Permissions**, change the Redirect URL to a public url where you can access this project from. Don't have one? Follow the steps [here](https://github.com/hackclub/dos-journey/blob/main/contributing/CONTRIBUTING.md#slack-contributions).

5. With the values of `DATABASE_URL`, `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET` obtained from steps 3 and 4, fill out the `.env.example` file as `.env`. Set the `AUTH_URL` to the Redirect URL used in configuring Step 4. Set `AUTH_SECRET` to a randomly generated string.

6. Seed the database.
   ```
   bun prisma db seed
   ```

7. Start the development server, as well your Ngrok instance and visit your Ngrok URL[^1] in the browser.
   ```
   bun run dev
   ```

## Docker
1. Clone the repository.
    ```
    git clone https://github.com/phthallo/rpg 
    ```

2. Build and start the container.
    ```
    docker compose up -d --build web
    ```

## To do:
- [ ] resolve eslint errors
- [ ] known issue: if user kills a boss, the modal closes automatically and disables scroll
- [x] if a user kills a boss and people are in a session, they will not be able to stop their session
- [ ] admin panel does not refresh reviewed session status automatically
- [ ] add hackatime v2 project integration (for rpg v2)