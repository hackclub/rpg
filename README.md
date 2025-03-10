# rpg

RPG ([rpg.hackclub.com](https://rpg.hackclub.com)) is a gamified YSWS where you defeat bosses and earn treasure by spending time on personal projects. 

Earn a physical trading card + stickers of the bosses you helped defeat, plus bonus loot 👀 for all adventurers.

## Development
This project uses Next.js, React, TailwindCSS, and Prisma, as well as Auth.js.

1. Clone the repository.
    ```
    git clone https://github.com/phthallo/rpg && cd rpg
    ```

2. Install dependencies.
    ```
    bun install 
    ```

3. Configure a [Prisma Postgres database](https://www.prisma.io/).

4. Configure a Slack app for use with authentication, with the `users:read` and `users:read.email` scopes.

5. With the values of `DATABASE_URL`, `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET` obtained from steps 3 and 4, fill out the `.env` file. Set the `AUTH_URL` to the Redirect URL used in configuring Step 4.

6. Seed the database.
   ```
   bunx prisma db seed
   ```

7. Start the development server, as well your Ngrok instance and visit your Ngrok URL[^1] in the browser.
   ```
   bun run dev
   ```

[^1]: Necessary for testing auth

## Docker
1. Clone the repository.
    ```
    git clone https://github.com/phthallo/rpg 
    ```

3. Build and start the container.
    ```
    docker compose up -d --build web
    ```

## To do:
- [ ] resolve eslint errors