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
    "revision": "2e69db816d31e1efca7adcfa49c03bdd"
  },
  {
    "url": "index.html",
    "revision": "efdf29fe428ee015b348135ce56025b9"
  },
  {
    "url": "inline-entry.0-261f884d.js",
    "revision": "a329018f4515f4a472668a13ab5f58a2"
  },
  {
    "url": "legacy/inline-entry.0-a378f5db.js",
    "revision": "1425446642345a6bf5ae1b7a1e9f2843"
  },
  {
    "url": "legacy/lit-html-1abeb046.js",
    "revision": "e634339c9aa38567a118f63da8635445"
  },
  {
    "url": "legacy/manager-c120ccba.js",
    "revision": "21386c84d35be3c72bc999d0c55378af"
  },
  {
    "url": "legacy/storybook-28dfd69d.js",
    "revision": "0f2a42fd713de756a701407b81bad202"
  },
  {
    "url": "legacy/storybook-d172e98d.js",
    "revision": "1796a5792854b054c109aef9500810bc"
  },
  {
    "url": "lit-html-25c8d8c9.js",
    "revision": "97930922c6ab42f8d63a49cb1a32e9e3"
  },
  {
    "url": "manager-e0ad63bf.js",
    "revision": "b207f5aa7275928430724e15f5bb4491"
  },
  {
    "url": "polyfills/core-js.577a5602a7262d6256830802d4aaab43.js",
    "revision": "ccf205728fe514f8276191669b5ea48d"
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
    "url": "polyfills/webcomponents.d406f4685fdfb412c61f23b3ae18f2dc.js",
    "revision": "b1db7cb76380495a55ff4f65a9648f0e"
  },
  {
    "url": "storybook-7a0db953.js",
    "revision": "8ee41d61944e2eabc6c485ffd1f059d9"
  },
  {
    "url": "storybook-b7018926.js",
    "revision": "a4dd4d1689bc8ab82c0bf8e17aab881e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
