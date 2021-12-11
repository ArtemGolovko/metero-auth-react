# metero-auth-react

> Metero auth api for React JS.

[![NPM](https://img.shields.io/npm/v/metero-auth-react.svg)](https://www.npmjs.com/package/auth-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save metero-auth-react
```

## Documentation
### MeteroAuth
```jsx
const onSuccess = authData => {
  // e.g. Save authData
}

const onFail = error => {
  // e.g. Show error for user
}

return (
  <MeteroAuth
    clientId="test"
    clientSecret="123"
    redirectURI="http://localhost:3000/"
    scope="USER_WRITE POST_CREATE POST_WRITE POST_DELETE"
    onSuccess={onSuccess}
    onFail={onFail}
    width="500"
    height="500"
  >
    <button>Login</button>
  </MeteroAuth>
)
```
This code will display a normal button with text 'login'. But when user will click this button, it will create popup window. In this popup window will be metero login page. After user will login it will redirect to consent page. In consent user may accept or cancel authorization. When user will accept the authorization. It will redirect to **redirectURI** with code. Then with this code it will make a post request to token endpoint to fetch access token. Basically it's realization of OAuth2 Authorization code grant with PKCE challenge flow.

---
**clientId** - *string* - Your client id.

**clientSecret** - *string* - Your client secret.

**redirectURI** - *string* - Url where server will redirect after user accepted authorization.

**scope** - *string* - List of scopes separated by space your app wants to access.

**onSuccess** - *function* - It will execute when access token will receive. **authData** contains **accessToken**, **refreshToken**, use it whit refreshAuth function to generate new access token, **accessTokenExpiresAt** - date until which access token is valid and **idToken**, contains information about logged user (from ODIC).

**onFail** - *function* - It will execute when something went wrong. **error** is *AxiosError* or *CSRFError* (both aren't exported).

**width** - *number* - Optional parameter. Represents width of popup window.

**height** - *number* - Optional parameter. Represents height of popup window.

### refreshAuth
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
It will make a post request to fetch new access token. Basically it's of OAuth2 Refresh token grant flow.

---

**refreshToken** - *string* - Refresh token from **authData**.

**clientId** - *string* - Your client id.

**clientSecret** - *string* - Your client secret.

**scope** - *string* - List of scopes separated by space your app wants to access.

As you might have guessed it will return Promise. In case of success you will get **authData**. In case of failure you will get *AxiosError*.

### decodeIdToken
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
Use to get information about logger user from id token.

---

**idToken** - *string* - Id token tou want decode.

Basically id token is just jwt token. This function will return it payload, but it won't include iss, aud, iat and exp fields. And 'sub' field will be renamed to 'iri'.

### *AxiosError*

Basically it is normal javascript Error. But it extended with *originalError* filed. That contains error from axios.

### *CSRFError*

Basically it is normal javascript Error. But it extended with **expectedToken** and **actualToken**. **expectedToken** contains csrf token you should get and **actualToken** contains csrf token you got.

## License

MIT © [ArtemGolovko](https://github.com/ArtemGolovko)
