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
    "revision": "b67c3ed817017ae99d5bebd7b724d5b0"
  },
  {
    "url": "index.html",
    "revision": "a26cd4fb2ec9e032248d2bc0ef7c314f"
  },
  {
    "url": "inline-entry.0-e7392862.js",
    "revision": "6754cd8a350fc6df8900885ef0759630"
  },
  {
    "url": "legacy/inline-entry.0-5ae66c1c.js",
    "revision": "2112976da9470c756ea782fc09bb7711"
  },
  {
    "url": "legacy/preview-83ce9d8b.js",
    "revision": "04c36fbeaed5694b45faa525b0130940"
  },
  {
    "url": "legacy/stripe-elements.stories-a2ac025e.js",
    "revision": "8ae5d71682471e2ef91235c27feea632"
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
    "url": "preview-e9bb6201.js",
    "revision": "019727a6f2d6cd1a4703a95a972a017b"
  },
  {
    "url": "stripe-elements.stories-2f10cce2.js",
    "revision": "9c07e0831334023ed31cf2761b9fdac9"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
