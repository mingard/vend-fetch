'use strict'

/* TO-DO
- Add pagination with `?after={data.version.max} and queue before response
*/

const Auth = require('./auth')
const fetch = require('node-fetch')

class Helper {

  constructor (config) {
    this.config = config
  }

  connect ({options, domain}) {
    return new Auth(options, domain).getToken().then((token) => {
      this.token = token
    })
  }

  request ({uri, method}) {
    // console.log(`Token response ${JSON.stringify(this.token, null, 2)}`)
    return fetch(uri, {
      method: method,
      headers: {
        'Authorization': `${this.token.token_type} ${this.token.access_token}`
      }
    }).then(response => {
      return response.json().then(resp => {
        // console.log(resp)
        return resp
      })
    }).catch((err) => {
      return {err: err}
      // Handle error
    })
  }

  get list () {
    return this.connect(this.config).then(() => {
      return this.request({
        uri: this.URI
      }, 'GET')
    })
  }
}

class WebHooks extends Helper {
  constructor (config) {
    super(config)
    this.URI = `${this.config.domain}/api/webhooks`
  }
}

class Products extends Helper {
  constructor (config) {
    super(config)
    this.URI = `${this.config.domain}/api/2.0/products`
  }
  get webhooks () {
    return ['product.update']
  }
}

class ProductTypes extends Helper {
  constructor (config) {
    super(config)
    this.URI = `${this.config.domain}/api/2.0/product_types`
  }
}

class Consignments extends Helper {
  constructor (config) {
    super(config)
    this.URI = `${this.config.domain}/api/2.0/consignments`
  }
}

class Suppliers extends Helper {
  constructor (config) {
    super(config)
    this.URI = `${this.config.domain}/api/2.0/suppliers`
  }
}

class Registers extends Helper {
  constructor (config) {
    super(config)
    this.URI = `${this.config.domain}/api/2.0/registers`
  }
}

class RegisterSales extends Helper {
  constructor (config) {
    super(config)
    this.URI = `${this.config.domain}/api/2.0/registers`
  }
}

class Outlets extends Helper {
  constructor (config) {
    super(config)
    this.URI = `${this.config.domain}/api/2.0/outlets`
  }
}

class Customers extends Helper {
  constructor (config) {
    super(config)
    this.URI = `${this.config.domain}/api/2.0/customers`
  }
}

class Brands extends Helper {
  constructor (config) {
    super(config)
    this.URI = `${this.config.domain}/api/2.0/brands`
  }
}

module.exports = {
  WebHooks: WebHooks,
  Products: Products,
  ProductTypes: ProductTypes,
  Consignments: Consignments,
  Suppliers: Suppliers,
  Registers: Registers,
  RegisterSales: RegisterSales,
  Outlets: Outlets,
  Customers: Customers,
  Brands: Brands
}