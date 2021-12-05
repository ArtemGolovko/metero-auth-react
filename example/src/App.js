import React, { useState } from 'react'

import { MeteroAuth, decodeIdToken, refreshAuth } from 'metero-auth-react'

const redirectURI = 'http://localhost:3000/'
const clientId = '[YOUR CLIENT ID]'
const clientSecret = '[YOUR CLIENT SECRET]'
const scope = 'USER_WRITE POST_CREATE POST_WRITE POST_DELETE'

const App = () => {
  const [auth, setAuth] = useState(
    localStorage.getItem('auth') !== null
      ? JSON.parse(localStorage.getItem('auth'))
      : null
  )
  const onSuccess = (authData) => {
    // Just keep in mind that authData.accessTokenExpiresAt is instance of Data
    localStorage.setItem('auth', JSON.stringify(authData))
    setAuth(authData)
  }

  const onFail = (error) => {
    alert(error.message)
  }

  const refresh = () => {
    refreshAuth({
      refreshToken: auth.refreshToken,
      clientId: clientId,
      clientSecret: clientSecret,
      scope: scope
    })
      .then(onSuccess)
      .catch(onFail)
  }

  return (
    <>
      {auth === null && (
        <MeteroAuth
          clientId={clientId}
          clientSecret={clientSecret}
          redirectURI={redirectURI}
          scope={scope}
          onSuccess={onSuccess}
          onFail={onFail}
        >
          <button>Login</button>
        </MeteroAuth>
      )}

      {auth !== null && (
        <div>
          {decodeIdToken(auth.idToken).username}
          <button onClick={refresh}>Renew Auth</button>
        </div>
      )}
    </>
  )
}

export default App
