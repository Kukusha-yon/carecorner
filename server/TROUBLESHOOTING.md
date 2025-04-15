# Troubleshooting Guide for Vercel Deployment

## Common Issues and Solutions

### 1. 500 Internal Server Error

If you're seeing a 500 Internal Server Error when deploying to Vercel, here are some common causes and solutions:

#### Missing Environment Variables

The most common cause of 500 errors is missing environment variables. Make sure you've set up all the required environment variables in your Vercel project settings:

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add all the variables from `.env.example`

#### MongoDB Connection Issues

If your application can't connect to MongoDB, it will crash. Make sure:

1. Your MongoDB URI is correct
2. Your MongoDB instance is accessible from Vercel's servers
3. You're using the correct MongoDB connection string format

#### Memory or Timeout Issues

Vercel has limits on function execution time and memory. If your application is hitting these limits:

1. Check the `vercel.json` file and adjust the `memory` and `maxDuration` settings
2. Optimize your code to use less memory and complete faster

### 2. How to Debug Vercel Deployments

#### Check Deployment Logs

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Deployments"
4. Click on the latest deployment
5. Click on "Functions" to see serverless function logs

#### Test Your API Locally

Before deploying, test your API locally to make sure it works:

```bash
cd server
npm run dev
```

#### Use the Test Endpoint

We've added a simple test endpoint at `/api/test`. Try accessing this endpoint to see if your API is working:

```
https://your-vercel-url.vercel.app/api/test
```

### 3. Deployment Checklist

Before deploying to Vercel, make sure:

1. All environment variables are set up in Vercel
2. Your MongoDB instance is accessible
3. Your code is optimized for serverless deployment
4. You've tested your API locally

## Getting Help

If you're still having issues after trying these solutions:

1. Check the Vercel documentation: https://vercel.com/docs
2. Look for error messages in your deployment logs
3. Try deploying a minimal version of your API to isolate the issue 