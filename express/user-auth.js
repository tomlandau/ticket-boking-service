const requestify = require('requestify');
const baseUrl = require('../config/user-service');

/**
 * Middleware for handling user authentication based on a cookie
 */
module.exports = (cookieName, options) => (req, res, next) => {
  /**
   * Reports unauthorized and breaks middleware chain with error
   */
  const userNotFound = () => {
    if (options.allowAnonymous) return next();
    res.unauthorized('user is not logged-in');
    next(new Error('user not authorized'));
  }

  const userNotAuthorized = () => {
    res.unauthorized('user not authorized to perform this action');
    next(new Error('user not authorized'));
  }

  const hasRole = (role, user) => user.roles.includes(role);

  const validateRoles = (user) => {
    if (!options.roles) return;
    let authorized = false;
    options.roles.forEach(role => { if (user.roles.includes(role) && !authorized) authorized = true; });
    if (!authorized) userNotAuthorized();
  };

  if (!req.cookies.cocyclesSession) { userNotFound(); return; };

  const getCookiesJson = () => {
    const cookiesJson = { cookies: {} };
    cookiesJson.cookies[cookieName] = req.cookies[cookieName];
    return cookiesJson;
  }
  
  return requestify.get(`${baseUrl}/user`, getCookiesJson())
  .then(res => {
    const user = res.getBody().payload;
    validateRoles(user);
    req.user = user;
    req.user.hasRole = role => hasRole(role, user);
    req.user.isAdmin = role => hasRole('admin', user);
    next();
  })
  .fail(userNotFound);
};