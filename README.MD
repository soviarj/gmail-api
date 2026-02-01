## Setup & Usage

### Step 1: Environment setup

1. Install dotenv:
npm install dotenv

2. Create a `.env` file based on `.env.example`

3. Fill in your Google OAuth credentials:
GMAIL_CLIENT_ID=your_client_id_here
GMAIL_CLIENT_SECRET=your_client_secret_here

If you don’t have a Google Cloud (Cliend ID and Client secret) project yet:
- Create a new project in Google Cloud Console
- Enable Gmail API
- Create an OAuth 2.0 Client ID (Application type: Web)
- Add scope: https://www.googleapis.com/auth/gmail.send
- Copy your Client ID and Client secret from that project
---

### Step 2: Obtain OAuth authorization code

1. Open the following URL in your browser  
Replace `<CLIENT_ID>` with your actual `GMAIL_CLIENT_ID`:

https://accounts.google.com/o/oauth2/v2/auth?client_id=<CLIENT_ID>&redirect_uri=http://localhost&response_type=code&scope=https://www.googleapis.com/auth/gmail.send&access_type=offline&prompt=consent

2. Sign in with your Google account
3. Grant all requested permissions (follow the instructions)
4. You will be redirected to a URL like:
http://localhost/?code=4/0ASc3g...

5. Copy everything after `code=`
6. Paste it into your `.env` file:
GMAIL_AUTH_CODE=4/0ASc3g...

---

### Step 3: Optional configuration (This step can be skipped)

- Update the email body in `emailBody.txt`
- Set the email recipient in `emailHelper.ts`:
const emailRecipient = 'example@mail.com';

---

### Step 4: Run the test

npx playwright test gmail-api.spec.ts

---

### Notes

- The logout step revokes the access token
- For every new test run, Step 2 must be repeated
- A new OAuth authorization code is required each time
