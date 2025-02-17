import axios from 'axios'
import { generateSecret } from './generate-secret'

export async function getAccessToken() {
  const { clientId, clientSecret } = generateSecret()

  const query = {
    grant_type: 'client_credentials',
    scope: 'user.migration',
    client_id: clientId,
    client_secret: clientSecret,
  }

  const response = await axios.post(
    'https://appleid.apple.com/auth/token',
    new URLSearchParams(query).toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  )

  const accessToken = `${response.data['token_type']} ${response.data['access_token']}`
  return { accessToken, clientId, clientSecret }
}
