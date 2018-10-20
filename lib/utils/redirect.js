const debug = require("debug")("eoh:helper")

/**
 *
 * @param {string} redirectURL
 * @param {Electron.WebContents} webContents
 */
const awaitRedirect = (redirectURL, webContents) => {

  if (!redirectURL || !webContents) {
    return Promise.reject(new Error("Invalid parameter"))
  }

  /**
   * @param {string} url
   */
  const isRedirectURL = url => {
    return url.startsWith(redirectURL)
  }

  return new Promise(resolve => {

    const testDidNavigate = (event, url) => {
      debug("on did-navigate:", url)
      if (isRedirectURL(url)) {
        off()
        resolve(url)
      }
    }

    const testDidGetRedirectRequest = (event, oldUrl, newUrl) => {
      debug("on did-get-redirect-request:", newUrl)
      if (isRedirectURL(newUrl)) {
        off()
        resolve(newUrl)
      }
    }

    const off = () => {
      webContents.removeListener("did-navigate", testDidNavigate)
      webContents.removeListener("did-get-redirect-request", testDidGetRedirectRequest)
    }

    webContents.on("did-navigate", testDidNavigate)
    webContents.on("did-get-redirect-request", testDidGetRedirectRequest)
  })
}

module.exports = {
  awaitRedirect
}
