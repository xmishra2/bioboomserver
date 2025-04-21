
# BioBoom Backend

This is the backend API server for the BioBoom multiplayer educational game.

## How to Use

- Make sure Node.js is installed.
- Run `npm install` to install dependencies.
- Start the server with `node server.js`.

## Deployment

You can deploy this backend using GitHub on [Render](https://render.com), Vercel, or any Node-compatible platform.

## Notes

- CORS is configured to accept requests from: `https://bioboomserver.netlify.app`
- Authentication endpoint: `/auth`
- Game logic: scenario setting, submissions, and ESG scoring included.
