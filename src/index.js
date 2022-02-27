import React from 'react'
import PropTypes from 'prop-types'
import pkceChallenge from './pkce-challenge'
import OauthPopup from 'react-oauth-popup'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

const crypto = require('crypto-browserify')

const authorizationURL = 'https://accounts.metero.pp.ua/authorize'
const tokenURL = 'https://accounts.metero.pp.ua/token'

function CSRFError(expectedToken, actualToken) {
  Error.call(this, expectedToken, actualToken)
  this.name = 'CSRFError'

  this.expectedToken = expectedToken
  this.actualToken = actualToken
  this.message = 'Invalid csrf'

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, CSRFError)
  } else {
    this.stack = new Error().stack
  }
}

CSRFError.prototype = Object.create(Error.prototype)

function AxiosError(message, originalError) {
  Error.call(this, message, originalError)
  this.name = 'AxiosError'

  this.originalError = originalError
  this.message = message

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, AxiosError)
  } else {
    this.stack = new Error().stack
  }
}

AxiosError.prototype = Object.create(Error.prototype)

const prepareAuthData = (rawData) => {
  const accessTokenExpiresAt = new Date()
  accessTokenExpiresAt.setSeconds(
    accessTokenExpiresAt.setSeconds() + rawData.expires_in
  )

  return {
    accessToken: rawData.access_token,
    accessTokenExpiresAt: accessTokenExpiresAt,
    idToken: rawData.id_token,
    refreshToken: rawData.refresh_token
  }
}

function MeteroAuth({
  clientId,
  clientSecret,
  redirectURI,
  scope,
  onSuccess,
  onFail,
  width = 500,
  height = 500,
  children
}) {
  const csrf = crypto.randomBytes(32).toString('hex')
  const challenge = pkceChallenge()

  const queryParameters = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectURI,
    scope: scope,
    state: csrf,
    code_challenge: challenge.code_challenge,
    code_challenge_method: 'S256'
  })

  const onCode = (code, params) => {
    if (!params.has('state') || csrf !== params.get('state')) {
      onFail(new CSRFError(csrf, params.get('state')))
      return
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectURI,
      code: code,
      code_verifier: challenge.code_verifier
    })

    axios
      .post(tokenURL, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((resp) => {
        onSuccess(prepareAuthData(resp.data))
      })
      .catch((error) => {
        onFail(new AxiosError('Failed to fetch access token', error))
      })
  }

  const onClose = () => {}

  return (
    <OauthPopup
      url={authorizationURL + '?' + queryParameters.toString()}
      onCode={onCode}
      onClose={onClose}
      width={width}
      height={height}
    >
      {children}
    </OauthPopup>
  )
}
MeteroAuth.propTypes = {
  clientId: PropTypes.string,
  clientSecret: PropTypes.string,
  redirectURI: PropTypes.string,
  scope: PropTypes.string,
  onSuccess: PropTypes.func,
  onFail: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number
}

function decodeIdToken(idToken) {
  const payload = jwt_decode(idToken)
  delete payload.iss
  delete payload.aud
  delete payload.iat
  delete payload.exp
  payload.iri = payload.sub
  delete payload.sub
  return payload
}

function refreshAuth({ refreshToken, clientId, clientSecret, scope }) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      scope: scope
    })

    axios
      .post(tokenURL, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text'
      })
      .then((resp) => {
        resolve(prepareAuthData(resp.data))
      })
      .catch((error) => {
        reject(new AxiosError('Failed to refresh auth', error))
      })
  })
}

export { MeteroAuth, decodeIdToken, refreshAuth }
