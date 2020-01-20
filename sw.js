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
    "revision": "d07d7c88bb0abe27651d2f2f89a9e984"
  },
  {
    "url": "index.html",
    "revision": "fc29a281b95c188081dee5499c11a46a"
  },
  {
    "url": "inline-entry.0-29a1e976.js",
    "revision": "24874847852672bab7faeaf7df6735f6"
  },
  {
    "url": "legacy/inline-entry.0-cc76c19e.js",
    "revision": "075ccd1d84f493ebca959af290e6feef"
  },
  {
    "url": "legacy/preview-69c36aae.js",
    "revision": "d95cec8e2068c3ecf730544f48453a6d"
  },
  {
    "url": "legacy/stripe-elements.stories-982b4f7d.js",
    "revision": "5cbe1bac36bb0616bbd595a4e292e8da"
  },
  {
    "url": "polyfills/core-js.5e6caafde24250a9349bba4d345eb7be.js",
    "revision": "bb2d2cd8e5d81f17f35ab35b6a645462"
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
    "url": "preview-ea46fbaf.js",
    "revision": "0ff32fe29fd5a60a91e64bb776e69038"
  },
  {
    "url": "stripe-elements.stories-761a87f7.js",
    "revision": "b4d249cb5b1506d7259c2e534501823f"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
