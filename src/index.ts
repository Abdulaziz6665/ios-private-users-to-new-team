import { config } from 'dotenv'
import path from 'node:path'
config({ path: path.join(process.cwd(), '../.env') })

import { getFbPrivateEmails, updateFbPrivateEmails } from './api/fb-private-email'
import { getTransferSub } from './helper/transfer-sub'
import { getNewPrivateEmails } from './helper/new-private-email'

async function followTheSteps() {
  const command = process.argv[2]
  if (!command) throw Error('Command not found')

  const obj: Record<string, () => Promise<void>> = {
    step1: getFbPrivateEmails,
    step2: getTransferSub,
    step3: getNewPrivateEmails,
    step4: updateFbPrivateEmails,
  }

  const func = obj[command]

  if (typeof obj[command] === 'function') await func()
  else throw Error('Follow the [step1, step2, step3, step4]')
}

followTheSteps()
