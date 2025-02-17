import axios from 'axios'
import fs from 'node:fs'
import path from 'node:path'
import data from '../json/transfer_sub.json'
import { getAccessToken } from './access-token'
import { SavedTransferData } from './transfer-sub'

type SavedNewPrivateEmailData = {
  fb_user_uid: string
  old_fb_user_email: string
  newData: NewPrivateEmail
}

type NewPrivateEmail = {
  is_private_email: boolean
  email: string
  sub: string
}

type NewPrivateEmailReqData = {
  clientId: string
  clientSecret: string
  accessToken: string
  transfer: SavedTransferData
}

export async function getNewPrivateEmails() {
  try {
    const { accessToken, clientId, clientSecret } = await getAccessToken()

    const reqFunctions = data.map((transfer) => {
      return sendRequest({ accessToken, clientId, clientSecret, transfer })
    })

    const results = await Promise.all(reqFunctions)
    const filePath = path.join(process.cwd(), '../json/new_private_emails.json')

    fs.writeFileSync(filePath, JSON.stringify(results))
  } catch (error) {
    console.log('getNewPrivateEmails', error)
  }
}

async function sendRequest(incData: NewPrivateEmailReqData): Promise<SavedNewPrivateEmailData> {
  const url = 'https://appleid.apple.com/auth/usermigrationinfo'

  const payload = new URLSearchParams({
    transfer_sub: incData.transfer.transfer_sub,
    client_id: incData.clientId,
    client_secret: incData.clientSecret,
  }).toString()

  const headers = {
    Authorization: incData.accessToken,
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const response = await axios.post<NewPrivateEmail>(url, payload, { headers })

  return {
    fb_user_uid: incData.transfer.fb_user_uid,
    old_fb_user_email: incData.transfer.fb_user_email,
    newData: response.data,
  }
}
