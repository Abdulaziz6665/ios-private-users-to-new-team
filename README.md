# Title

- Migration "sign in with apple" private accounts to new team

## Extra links

- [medium.com](https://medium.com/@hell-io/a-great-migration-transfer-your-ios-app-without-losing-firebase-users-91252c431acf)

- [developer.apple.com](https://developer.apple.com/documentation/sign_in_with_apple/transferring-your-apps-and-users-to-another-team)

### Follow the steps

1. `npx ts-node src/index.ts step1`

   - Get all private accounts from firebase

2. `npx ts-node src/index.ts step2`

   - Get transform id from apple using firebase user.providerData.uid

3. `npx ts-node src/index.ts step3`

   - Get new private email from apple using transform id

4. `npx ts-node src/index.ts step4`

   - Update old private email to new private email
