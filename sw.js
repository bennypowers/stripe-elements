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
    "url": "angular.stories-0152895f.js",
    "revision": "017b9e8c347734add38f33d3663788d5"
  },
  {
    "url": "codesandbox-button-15b79192.js",
    "revision": "a384a87c4f3e8d5adc3dd0fed186d0c0"
  },
  {
    "url": "iframe.html",
    "revision": "c30bc90b56d734ed2ab828e07fb70db5"
  },
  {
    "url": "index.html",
    "revision": "46d246ee1547961c6673cbe6b390dc3c"
  },
  {
    "url": "inline-entry.0-123c32c9.js",
    "revision": "5b656a8a7b71a066cf6ef333f317a60b"
  },
  {
    "url": "legacy/angular.stories-f4c3503b.js",
    "revision": "93f2561d8bba5a05828d1f3d8db415fc"
  },
  {
    "url": "legacy/codesandbox-button-9e6dab47.js",
    "revision": "f7227f74071796e4ac12fec12bdbbd0f"
  },
  {
    "url": "legacy/inline-entry.0-a60da632.js",
    "revision": "40351655d2ee9dbb07639fcac0347234"
  },
  {
    "url": "legacy/lit-element-d82f920d.js",
    "revision": "7383b978480f458d3f7953d9d9d928f9"
  },
  {
    "url": "legacy/lit.stories-fb408f49.js",
    "revision": "2d3aa44a26ab5fd477373487e4f1249e"
  },
  {
    "url": "legacy/preact.stories-8d4368ac.js",
    "revision": "be782b0055cf9b2973c8e84ef24ad59c"
  },
  {
    "url": "legacy/preview-396c3c10.js",
    "revision": "6510a0d0098b045adf4ee3aaa742d277"
  },
  {
    "url": "legacy/react.stories-cb24a325.js",
    "revision": "7c83daede4379c17ae12ee62d3c033f1"
  },
  {
    "url": "legacy/storybook-helpers-35c8254a.js",
    "revision": "d6005de5578df558390b7b500fd0cbfd"
  },
  {
    "url": "legacy/stripe-elements.stories-48183533.js",
    "revision": "37c4964e1763e22b2d4cf3c0b1bdeb84"
  },
  {
    "url": "legacy/stripe-payment-request.stories-16f116df.js",
    "revision": "84443cf7e010f62a1ded911e866f0429"
  },
  {
    "url": "legacy/vanilla.stories-335939f1.js",
    "revision": "83cf6809bc3d295c79134ef49076689d"
  },
  {
    "url": "legacy/vue.stories-22b4a498.js",
    "revision": "1f4ce00df84f0b30154964216499d0ec"
  },
  {
    "url": "lit-element-9d52ca4f.js",
    "revision": "e002039723fedf00c0cc97916f89d2f3"
  },
  {
    "url": "lit.stories-3e0314f8.js",
    "revision": "49dad666d656b468c993a78269d96458"
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
    "url": "preact.stories-da66c56a.js",
    "revision": "82ed900dddc3ced62b34d8e74747d2a6"
  },
  {
    "url": "preview-e8603077.js",
    "revision": "faa2431056fabf1ac37d5ea2369ca39d"
  },
  {
    "url": "react.stories-1a647028.js",
    "revision": "113f6129ccde74077e2842fa897c1c69"
  },
  {
    "url": "storybook-helpers-e0d44384.js",
    "revision": "783922ceedb47b173e59985d711053f0"
  },
  {
    "url": "stripe-elements.stories-c930d69a.js",
    "revision": "f75d9942bbf2b2f3256c0e9a7d9fbfcb"
  },
  {
    "url": "stripe-payment-request.stories-ef1ee0f6.js",
    "revision": "d2b7bfac4ca358e364fe0319b07c71c9"
  },
  {
    "url": "vanilla.stories-e5f2e2f8.js",
    "revision": "c266e9717e8c91770543077748298d28"
  },
  {
    "url": "vue.stories-fc2bedba.js",
    "revision": "e3043678ce6e14ed7a8c2e2bc4e9a0ce"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
