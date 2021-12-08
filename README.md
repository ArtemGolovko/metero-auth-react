# metero-auth-react

> Metero auth api for React JS.

[![NPM](https://img.shields.io/npm/v/metero-auth-react.svg)](https://www.npmjs.com/package/auth-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save metero-auth-react
```

## Documentation

### MeteroAuth
React component. Use to authorize user with Metero authorize api (OAuth2 Authorization code grant with PKCE challenge).

#### Props

- **clientId** - *string* - Your client id.
- **clientSecret** - *string* - Your client secret.
- **redirectURI** - *string* - Url where server will redirect after user accepted authorization.
- **scope** - *string* - List of scopes separated by space your app wants to access.
- **onSuccess** - *function* - Get called when auth data is received. This function is responsible for saving auth data (accessToken, refreshToken, etc.).

  ##### Parameters
  - **authData** - *object*
    - **accessToken** - *string* - Access token (see how oauth works).
    - **accessTokenExpiresAt** - *Date* - Date until which access token is valid.
    - **idToken** - *string* - This token contains information about logged user (see how OIDC works).
    - **refreshToken** - *string* - This token to update access token when it expired.
- **onFail** - *function* - Get called when something went wrong.

  ##### Parameters
  - **error** - *Error* - Contains information about error.
- **width** - *number* - Optional parameter. Represents width of popup window.
- **height** - *number* - Optional parameter. Represents height of popup window.

#### Example
```jsx
const onSuccess = authData => {
  // e.g. Save authData
}

const onFail = error => {
  // e.g. Show error for user
}

return (
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
)
```

### refreshAuth
Function. Use to get new access token when it got expired (OAuth2 Refresh token grant).
#### Parameters
- **options** - *object*
  - **refreshToken** - *string* - Refresh token from authData. This token to update access token when it expired.
  - **clientId** - *string* - Your client id.
  - **clientSecret** - *string* - Your client secret.
  - **scope** - *string* - List of scopes separated by space your app wants to access.
#### Return value - *Promise*
  In case of success you will get **authData** *object*, other way an *Error*.
#### Example
```js
refreshAuth({
  refreshToken: refreshToken,
  clientId: clientId,
  clientSecret: clientSecret,
  scope: scope
})
  .then(authData => {
    // e.g. Save authData
  })
  .catch(error => {
    // e.g. Show error for user
  })
```
### decodeIdToken
Function. Use to get information about logger user from id token.
#### Parameters
- **idToken** - *string* - Id token tou want decode.
#### Return value - *object*
Basically id token is just jwt token. This function will return it payload, but it won't include iss, aud, iat and exp fields. And 'sub' field will be renamed to 'iri'.
#### Example
```js
const userInfo = decodeIdToken(idToken);
// userInfo = {
//   iri: '//api.metero.pp.ua/users/11',
//   id: 11,
//   username: 'example_user',
//   name: 'Example User',
//   email: 'example.user@example.com'
// }
```

## License

MIT © [ArtemGolovko](https://github.com/ArtemGolovko)
