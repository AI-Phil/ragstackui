# Developer Notes

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Running local Next.js service

**This should be run from within the `next.js` directory.**

### Setup
Create a `.env.development` file:

bash:
```bash
cp ../.env .env.development
echo "RAGSTACK_API_ENDPOINT=http://localhost:8001" >> .env.development
```

PowerShell:
```powershell
Copy-Item ../.env -Destination .env.development
Add-Content -Path .env.development -Value "RAGSTACK_API_ENDPOINT=http://localhost:8001" -Encoding UTF8
```

This will connect to the FastAPI development service that is running either within the Docker container, or on a local `uvicorn` service.

### Run Service

Start the Next.js server:

```bash
npm run dev -- -p 3001
```

The Next.js service will start on port 3001:

```
> next.js@0.1.0 dev
> next dev

   ▲ Next.js 14.1.3
   - Local:        http://localhost:3001
   - Environments: .env.development

 ✓ Ready in 3s
```

### Testing Service

You can confirm this is working by navigating to [http://localhost:3001/test-setup](http://localhost:3001/test-setup) and validating per the top-level README.md.

## Running Individual Docker Container

The Next.js service is bundled into a container which is itself bundled into a `docker-compose.yaml` in the project root directory. 
If you need to make changes to the Next.js `Dockerfile`, this section is for you.

**Run these commands within the `next.js` directory.**

### Environment File

The project `.env` file will be used, as this container will run within the same network as is referenced by the Docker Compose configuration.

If you wish to use the FastAPI development container, you'll need to create/adjust `.env.development`.

To reference the `fastapi-dev` container from the `next_js` container:
```
RAGSTACK_API_ENDPOINT=http://fastapi-dev:8000
```

or, if you want to reference a local `uvicorn` instance from within the `next_js` container:
```
RAGSTACK_API_ENDPOINT=http://host.docker.internal:8001
```

### Build Container

```bash
docker build -t ragstackui-next_js-dev:latest .
```

Note this is a `production` Node.js build, as it is assumed you are testing the final deployment works, and are using the 
local Next.js service to do your local development and testing!

### Start Container

You've two ways 

Assuming the local Next.js service (above) is not running, you can start the containers as follows. 

To connect to the non-development FastAPI service:

```bash
docker run --name next_js-dev --net ragstack-net -p 3001:3000 --env-file ../.env -d ragstackui-next_js-dev:latest
```

To connect to the development FastAPI service, having adjusted `.env.development` apporpriately:

```bash
docker run --name next_js-dev --net ragstack-net -p 3001:3000 --env-file ../.env --env-file ./.env.development -d ragstackui-next_js-dev:latest
```

### Testing Service

You can confirm this is working by navigating to [http://localhost:3001/test-setup](http://localhost:3001/test-setup) and validating per the top-level README.md.
