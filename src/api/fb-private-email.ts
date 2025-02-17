import fs from 'node:fs'
import path from 'node:path'
import admin from '../config/firebase'
import newData from '../json/new_private_emails.json'

export type FirebaseUser = {
  uid: string
  email?: string
  providerData: {
    uid: string
    email: string
  }
}

const privateUsers: FirebaseUser[] = []

async function listPrivateUsers(nextPageToken?: string) {
  // List batch of users, 1000 at a time.
  const listUsers = await admin.auth().listUsers(1000, nextPageToken)

  for (const user of listUsers.users) {
    for (const provider of user.providerData) {
      if (provider.providerId !== 'apple.com') continue
      if (!provider?.email?.includes('privaterelay')) continue

      privateUsers.push({
        uid: user.uid,
        email: user.email,
        providerData: { uid: provider.uid, email: provider.email },
      })
    }
  }

  if (listUsers.pageToken) {
    // List next batch of users.
    await listPrivateUsers(listUsers.pageToken)
  }
}

export async function updateFbPrivateEmails() {
  const auth = admin.auth()

  const privateEmails = newData.map((data) => {
    return auth.updateUser(data.fb_user_uid, { email: data.newData.email })
  })

  const reqFunctions = await Promise.all(privateEmails)

  const modData = reqFunctions.map((data) => {
    return { uid: data.uid, email: data.email }
  })

  const filePath = path.join(process.cwd(), '../json/last_result.json')
  fs.writeFileSync(filePath, JSON.stringify(modData))
}

export async function getFbPrivateEmails() {
  await listPrivateUsers()

  const filePath = path.join(process.cwd(), '../json/private_clients.json')
  fs.writeFileSync(filePath, JSON.stringify(privateUsers))
}
