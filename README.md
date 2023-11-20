# Encrypt/Decrypt Service using ExpressJS

How to run this project locally
1. Clone this project
2. Add private key and public key you want to use (with name `dheeto_s9_private.asc` and `gac_public.asc`)
3. Enter a command `npm run dev`
4. Or build a docker image using Dockerfile provided

```bash
git clone https://github.com/dheerapat/encrypt_decrypt_service_express.git service
cd service
npm run dev
# or
docker build -t encService .
docker run -d -p 12080:12080 encService
```
