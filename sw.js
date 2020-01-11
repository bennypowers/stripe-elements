/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "iframe.html",
    "revision": "1d1d203c29f0c467940af134708abd1a"
  },
  {
    "url": "index.html",
    "revision": "a26cd4fb2ec9e032248d2bc0ef7c314f"
  },
  {
    "url": "inline-entry.0-5a323027.js",
    "revision": "3a82c8595cb9626f63455ab705eb4045"
  },
  {
    "url": "legacy/inline-entry.0-e7e73452.js",
    "revision": "1acc2189e85d725ae0976fdc99bda260"
  },
  {
    "url": "legacy/preview-f881de51.js",
    "revision": "b7427bea0e4ff33b19d02645177aef3b"
  },
  {
    "url": "legacy/stripe-elements.stories-4c6aadc2.js",
    "revision": "3c99c5140c0acd829e0655b829eebbdf"
  },
  {
    "url": "polyfills/core-js.32405a1a59519d0ca918cb9c6e134164.js",
    "revision": "169d8688dcb50bc3c902336886976c46"
  },
  {
    "url": "polyfills/custom-elements-es5-adapter.84b300ee818dce8b351c7cc7c100bcf7.js",
    "revision": "cff507bc95ad1d6bf1a415cc9c8852b0"
  },
  {
    "url": "polyfills/dynamic-import.b745cfc9384367cc18b42bbef2bbdcd9.js",
    "revision": "ed55766050be285197b8f511eacedb62"
  },
  {
    "url": "polyfills/fetch.191258a74d74243758f52065f3d0962a.js",
    "revision": "fcdc4efda1fe1b52f814e36273ff745d"
  },
  {
    "url": "polyfills/regenerator-runtime.92d44da139046113cb3739b173605787.js",
    "revision": "3aa324bcf8f59cd0eebf46796948aafa"
  },
  {
    "url": "polyfills/systemjs.6dfbfd8f2c3e558918ed74d133a6757a.js",
    "revision": "683aabfb9b006607885b83e45e9a1768"
  },
  {
    "url": "polyfills/webcomponents.dae9f79d9d6992b6582e204c3dd953d3.js",
    "revision": "fe4a22f36087db029cd3f476a1935410"
  },
  {
    "url": "preview-638358d2.js",
    "revision": "899cf43bf3ad030f1a35af2afb276a42"
  },
  {
    "url": "stripe-elements.stories-9890c3d3.js",
    "revision": "70f59e7cc6e093884a0eb6631b082bbe"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
