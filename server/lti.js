const { Provider } = require('ltijs');

// Initialize LTI provider with configuration from environment variables.
const lti = new Provider(
  // Encryption key for cookies and state
  process.env.LTI_ENCRYPTION_KEY || 'DEV_SECRET_KEY',
  {
    // ltijs requires a persistent store; using MongoDB URL or memory
    url: process.env.LTI_DATABASE_URL || 'mongodb://localhost:27017/ltidb'
  },
  {
    appUrl: '/lti/launch',
    loginUrl: '/lti/login',
    keysetUrl: '/lti/keys',
    cookies: { secure: false, sameSite: 'None' }
  }
);

// Register platform configuration from environment variables if present
(async () => {
  try {
    const platformUrl = process.env.LTI_PLATFORM_URL;
    if (platformUrl) {
      await lti.registerPlatform({
        url: platformUrl,
        name: process.env.LTI_PLATFORM_NAME || 'LMS',
        clientId: process.env.LTI_CLIENT_ID || 'client-id',
        authenticationEndpoint: process.env.LTI_AUTH_LOGIN_URL || `${platformUrl}/login`,
        accesstokenEndpoint: process.env.LTI_AUTH_TOKEN_URL || `${platformUrl}/token`,
        authorizationServer: process.env.LTI_AUTH_SERVER || `${platformUrl}/auth`,
        keysetUrl: process.env.LTI_KEYSET_URL || `${platformUrl}/jwks`,
        authConfig: { method: 'JWK_SET', key: process.env.LTI_PUBLIC_KEY },
        deploymentId: process.env.LTI_DEPLOYMENT_ID || 'deployment-id'
      });
    }

    // Deploy provider (creates necessary routes)
    await lti.deploy();
  } catch (err) {
    console.error('Failed to initialise LTI provider', err);
  }
})();

// On every valid launch issue a cookie that can be used by the app
lti.onConnect((token, req, res) => {
  res.cookie('lti_token', token, { httpOnly: true, sameSite: 'None', secure: false });
  return res.send('LTI launch successful');
});

module.exports = lti;
