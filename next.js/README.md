# Developer Notes

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Running local Next.js service

**This should be run from within the `next.js` directory.**

### Setup
Create a `.env.local` file:

```
RAGSTACK_API_ENDPOINT=http://localhost:8090
```

This should reference the port that your development FastAPI port is running on. 

### Run Service

Start the Next.js server:

```bash
npm run dev
```

The Next.js service will start on port 3000:

```
> next.js@0.1.0 dev
> next dev

   ▲ Next.js 14.1.3
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 3s
```

You can confirm this is working by navigating to [http://localhost:3000/test-setup](http://localhost:3000/test-setup) and validating per the top-level README.md.
