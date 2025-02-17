import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export function generateSecret() {
  const bundle_id = env.APP_STORE_BUNDLE_ID
  const kid = env.APP_STORE_KEY_ID
  const team_id = env.APP_STORE_TEAM_ID
  const private_key = env.APP_STORE_PRIVATE_KEY

  const header = {
    alg: 'ES256',
    kid,
  }

  const payload = {
    iss: team_id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Expires in 1 day
    aud: 'https://appleid.apple.com',
    sub: bundle_id,
  }

  const clientSecret = jwt.sign(payload, private_key, {
    algorithm: 'ES256',
    header: header,
  })

  return { clientId: bundle_id, clientSecret }
}
