'use strict'

const _ = require('underscore')
const moment = require('moment')
const fetch = require('node-fetch')
const querystring = require('querystring')

const Auth = function (options, domain) {
  if (_.isUndefined(options) || _.isUndefined(domain)) {
    console.log("Missing parameters in Auth")
    return
  }
  this.options = options
  this.domain = domain
}

Auth.prototype.checkToken = function () {
  // Check existing token
}

Auth.prototype.getToken = function () {
  if (!this.token || this.hasTokenExpired(this.token.expires)) {
    return this.refreshToken()
  } else {
    return Promise.resolve(this.token)
  }
}

Auth.prototype.refreshToken = function () {
  let tokenUri = `${this.domain}/api/1.0/token`

  return fetch(tokenUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify({
      refresh_token : this.options.refresh_token,
      client_id : this.options.client_id,
      client_secret : this.options.client_secret,
      grant_type : 'refresh_token'
    })
  }).then(response => {
    return response.json().then(token => {
      this.token = token
      return token
    })
  })  
}

/**
 * Has Token Expired
 * @param expiresAt - time unit from Vend is in unix epoch format
 * @returns {*} true if the the token will be considered as expired in 2 mins from now
 */
Auth.prototype.hasTokenExpired = function (expiresAt) {
  return (moment.unix(expiresAt).isBefore(moment().add(2, 'minutes')))
}

module.exports = function (options, domain) {
  return new Auth(options, domain)
}

module.exports.Auth = Auth