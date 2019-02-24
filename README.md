# Steps to deploy at Firebase hosting:

- If it is your first access, it will be necessary following these steps:

1. npm install -g firebase-tools
2. firebase login
3. firebase init (You should type build for the default folder build).

### Steps to normal deploy at Firebase:

1. Change to PROD or DEV (This one is the default) the following files:<br />
   1.1. RequestUtil.js (change the variable SERVER_HOST to the desired endpoint) <br />
   1.2. firebase.js (change the flag isDevMode) <br />
2. After the changes above, make a new build. Run at terminal -> "npm run build"
3. When the build finish, execute the comand: firebase deploy -P <flavor> (dev or prod)

#### Remember: Never commit these files, only if the changes is the final one.
