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
    "revision": "882df4275be8e6e96183f925d81ce639"
  },
  {
    "url": "index.html",
    "revision": "46d246ee1547961c6673cbe6b390dc3c"
  },
  {
    "url": "inline-entry.0-d4074bb9.js",
    "revision": "28f1798b37254ec130fbaa6b267f76b6"
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
    "url": "legacy/inline-entry.0-5a3c5e39.js",
    "revision": "0a53383421222856fcbfcc4ca9d0280a"
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
    "url": "legacy/storybook-helpers-f3c1a813.js",
    "revision": "edac5149daef1211b81029e2f9e9f5b6"
  },
  {
    "url": "legacy/stripe-elements.stories-3706d861.js",
    "revision": "3bac495e68a8c46b46fb8b21ccd976e3"
  },
  {
    "url": "legacy/stripe-payment-request.stories-870d65f2.js",
    "revision": "6a733d4d73e6347541bb40271adb7e78"
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
    "url": "storybook-helpers-ed1dc679.js",
    "revision": "a10836534d4672df1d45d974e34b9053"
  },
  {
    "url": "stripe-elements.stories-9054a049.js",
    "revision": "a09c4cadd9041e62c71c578fb180f3ec"
  },
  {
    "url": "stripe-payment-request.stories-0034c9ba.js",
    "revision": "66620bf01b218d2d488049960d4b39c1"
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
