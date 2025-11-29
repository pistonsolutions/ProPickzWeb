---
description: Deploy the application to Vercel
---
1. Login to Vercel
   Run the following command to log in to your Vercel account. You will be asked to select a login method (Email, GitHub, etc.).
   ```bash
   npx vercel login
   ```

2. Deploy the Project
   Run the following command to deploy the project. You will be asked a series of questions to configure the project. You can mostly accept the defaults (Y, Enter, Enter...).
   ```bash
   npx vercel
   ```

3. Production Deployment (Optional)
   If you want to deploy to production (not a preview URL), run:
   ```bash
   npx vercel --prod
   ```
