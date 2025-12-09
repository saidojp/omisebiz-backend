# Deploying omisebiz-backend to Heroku

This guide outlines the steps to deploy the `omisebiz-backend` application to Heroku.

## Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed and logged in.
- A Cloudflare R2 bucket for file storage.
- A strict Node.js version is defined in `package.json` (currently `22.x`).

## Configuration Files

The project includes the necessary configuration for Heroku:

- **`Procfile`**: Defines the `web` process to start the server and a `release` phase to run Prisma migrations automatically on deployment.
- **`package.json`**: Specifies the `engines` field to ensure Heroku uses the correct Node.js version.

## Environment Variables

You must set the following environment variables in your Heroku app settings (**Settings** > **Config Vars**).

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for your PostgreSQL database. | `postgres://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key used for signing JSON Web Tokens. | `super_secret_random_string` |
| `CORS_ORIGINS` | Comma-separated list of allowed origins. Use `*` for all. | `https://your-frontend.vercel.app,http://localhost:3000` |
| `R2_ACCOUNT_ID` | Cloudflare R2 Account ID. | `your_r2_account_id` |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 Access Key ID. | `your_r2_access_key_id` |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 Secret Access Key. | `your_r2_secret_access_key` |
| `R2_BUCKET_NAME` | Name of your R2 bucket. | `omisebiz-assets` |
| `R2_PUBLIC_URL` | Public URL for accessing files in your bucket. | `https://pub-xxxxxxxx.r2.dev` |

### Setting Environment Variables via CLI

You can also set these variables using the Heroku CLI:

```bash
heroku config:set JWT_SECRET=your_secure_random_secret -a your-app-name
heroku config:set CORS_ORIGINS=https://your-frontend-domain.com -a your-app-name
# ... and so on for R2 credentials
```

## Deployment Steps

1.  **Create a Heroku App:**
    ```bash
    heroku create omisebiz-backend
    ```

2.  **Add PostgreSQL Database:**
    ```bash
    heroku addons:create heroku-postgresql:mini
    ```
    *Note: This automatically sets the `DATABASE_URL` environment variable.*

3.  **Set Environment Variables:**
    Configure all variables listed in the table above.

4.  **Deploy:**
    ```bash
    git push heroku main
    ```

5.  **Verify:**
    The `release` phase will automatically run `npx prisma migrate deploy`. Check the logs to ensure everything started correctly:
    ```bash
    heroku logs --tail
    ```
