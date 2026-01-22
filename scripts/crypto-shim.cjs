const crypto = require('node:crypto');

if (!crypto.getRandomValues && crypto.webcrypto?.getRandomValues) {
  crypto.getRandomValues = crypto.webcrypto.getRandomValues.bind(crypto.webcrypto);
}

