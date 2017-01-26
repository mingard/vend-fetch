'use strict'

const helpers = require('./lib/helpers')
const RDBWrapper = require('reasondb-wrapper')
const path = require('path')
const _ = require('underscore')

const VendFetch = function (options) {

  let domain = `https://${options.domain_prefix}.vendhq.com`
  this.db = new RDBWrapper({
    root:  './db',
    key: '@key',
    clear: true,
    active: true,
    redis: {enabled: false, port: 6379, host: '127.0.0.1', detect_buffers: true},
    async: true
    // store: RDBWrapper.JSONBlockStore
  })
  
  // Fetch all data
  console.log(`Fetching ${Object.keys(helpers).length} collections`)
  this.fetch({options, domain}).then(() => {
    console.log("Fetch complete. Applying webhooks...")
    // Create missing webhooks
    // Call refetch on webhook change
    // Must map webhooks to Helper classes
    // Get existing webhooks
     // let webhooks = new helpers.WebHooks({options, domain}).list.then(() => {

     // })
  })


}
//{ min: 1189682288, max: 2629108979 }

VendFetch.prototype.fetch = function (config) {

  let queue = _.map(helpers, (helper) => {
      return new helper(config).list.then( records => {
        return this.db.use(helper).post(records.data || records).then((response) => {
          console.log(`${response.length} ${helper.name} inserted`)
        })
      })
  })
  return Promise.all(queue)
}

module.exports = function (options) {
  return new VendFetch(options)
}

module.exports.VendFetch = VendFetch

