import axios from 'axios'
import fs from 'node:fs'
import path from 'node:path'
import data from '../json/private_clients.json'
import { env } from '../config/env'
import { getAccessToken } from './access-token'
import { FirebaseUser } from '../api/fb-private-email'

type TransferReqData = {
  newTeamId: string
  clientId: string
  clientSecret: string
  accessToken: string
  fbUser: FirebaseUser
}

export type SavedTransferData = {
  fb_user_uid: string
  fb_user_email: string
  transfer_sub: string
}

export async function getTransferSub() {
  try {
    const newTeamId = env.APP_STORE_NEW_TEAM_ID

    const { accessToken, clientId, clientSecret } = await getAccessToken()

    const reqFunctions = data.map((fbUser) => {
      return sendRequest({ accessToken, clientId, clientSecret, fbUser, newTeamId })
    })

    const results = await Promise.all(reqFunctions)
    const filePath = path.join(process.cwd(), '../json/transfer_sub.json')

    fs.writeFileSync(filePath, JSON.stringify(results))
  } catch (error) {
    console.log('getTransferSub', error)
  }
}

async function sendRequest(incData: TransferReqData): Promise<SavedTransferData> {
  const url = 'https://appleid.apple.com/auth/usermigrationinfo'
  const sub = incData.fbUser.providerData.uid

  const payload = new URLSearchParams({
    sub,
    target: incData.newTeamId,
    client_id: incData.clientId,
    client_secret: incData.clientSecret,
  }).toString()

  const headers = {
    Authorization: incData.accessToken,
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const response = await axios.post<{ transfer_sub: string }>(url, payload, { headers })

  return {
    fb_user_uid: incData.fbUser.uid,
    fb_user_email: incData.fbUser.providerData.email,
    transfer_sub: response.data.transfer_sub,
  }
}
