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
    "url": "angular.stories-a1fb21f5.js",
    "revision": "32185ee8301222d300c7675a1ef5b35c"
  },
  {
    "url": "codesandbox-button-84b117ac.js",
    "revision": "98ebae6d562f511b6a2afa566b8cb4be"
  },
  {
    "url": "fallback.stories-b6849d29.js",
    "revision": "1a82c59129a3f0d61db9c9aceae284c2"
  },
  {
    "url": "iframe.html",
    "revision": "27329a995216039d5c93ab33503aa16f"
  },
  {
    "url": "index.html",
    "revision": "efdf29fe428ee015b348135ce56025b9"
  },
  {
    "url": "inline-entry.0-95224755.js",
    "revision": "2d9661a768b20d80a790e36062f75661"
  },
  {
    "url": "legacy/angular.stories-f21af3c7.js",
    "revision": "4068d58aa84523c0c2b3bc89f42e0227"
  },
  {
    "url": "legacy/codesandbox-button-b2b98b59.js",
    "revision": "c72974bff77ac6f37bee89af6b30627f"
  },
  {
    "url": "legacy/fallback.stories-5e66bef0.js",
    "revision": "b2383ca92e7e0472164e1dd2cb13094f"
  },
  {
    "url": "legacy/inline-entry.0-e22b5eef.js",
    "revision": "9254ce620704f9faf036a1506da547cc"
  },
  {
    "url": "legacy/lit-element-ba2ebbe8.js",
    "revision": "9b1ffafaa550babe43f6d38f7b0f6011"
  },
  {
    "url": "legacy/lit-html-d4bb504d.js",
    "revision": "faae661d9dab928043785e659c0c8faa"
  },
  {
    "url": "legacy/lit.stories-1fa62f98.js",
    "revision": "c3039a09129049811a79e90a4f3cfb48"
  },
  {
    "url": "legacy/manager-c120ccba.js",
    "revision": "21386c84d35be3c72bc999d0c55378af"
  },
  {
    "url": "legacy/mwc-textfield-00774d0d.js",
    "revision": "258301d7549599de0c565651b4ded205"
  },
  {
    "url": "legacy/preact.stories-18fbad97.js",
    "revision": "69c185cd7ae3934eadf3b38f89ac10a5"
  },
  {
    "url": "legacy/preview-f6e6c63e.js",
    "revision": "817f0f73a65e1218b6f50379108080dc"
  },
  {
    "url": "legacy/react.stories-3a9e5115.js",
    "revision": "29e0d9cab669f307cad24317be283652"
  },
  {
    "url": "legacy/storybook-d172e98d.js",
    "revision": "1796a5792854b054c109aef9500810bc"
  },
  {
    "url": "legacy/storybook-deb9934b.js",
    "revision": "6adb5bfa0a68d1e547af49b9ddf9ca64"
  },
  {
    "url": "legacy/storybook-helpers-77e3c655.js",
    "revision": "caaf8020c6915885f77fa357b89834e1"
  },
  {
    "url": "legacy/stripe-elements-829b7507.js",
    "revision": "9850e52c6987ab3c6ee2f7a094542000"
  },
  {
    "url": "legacy/stripe-elements.stories-49f52972.js",
    "revision": "206a29fb639bfc88fd895f44592323f3"
  },
  {
    "url": "legacy/stripe-payment-request.stories-e423ce54.js",
    "revision": "50dc8554823fca13e508b9010f045145"
  },
  {
    "url": "legacy/vanilla.stories-68a2df12.js",
    "revision": "1ae1aef4de75f56314916616209b8d95"
  },
  {
    "url": "legacy/vue.stories-ed3e850f.js",
    "revision": "c09c65634cfba166d8155027a34cd05e"
  },
  {
    "url": "lit-element-785ef095.js",
    "revision": "114887a460c06be121a5e55670d0970f"
  },
  {
    "url": "lit-html-ad749610.js",
    "revision": "887e0345284e59bac129fc51b09999f1"
  },
  {
    "url": "lit.stories-27b22f2a.js",
    "revision": "1dfa42a8bcf895f33a97662e5f84a339"
  },
  {
    "url": "manager-e0ad63bf.js",
    "revision": "b207f5aa7275928430724e15f5bb4491"
  },
  {
    "url": "mwc-textfield-c304cde7.js",
    "revision": "39c66983656ec19dcad0444ee4296379"
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
    "url": "preact.stories-1e2428b8.js",
    "revision": "9538c7216f40802bc02274183ed9b69b"
  },
  {
    "url": "preview-24378c87.js",
    "revision": "b66ab8aaa5100c48ef13c03dfc4fb6bf"
  },
  {
    "url": "react.stories-130d8e39.js",
    "revision": "f0c773030aa9089dff5b380911f324c4"
  },
  {
    "url": "storybook-672964cf.js",
    "revision": "8f53473378d3e4101bbb90b1b3fafa28"
  },
  {
    "url": "storybook-b7018926.js",
    "revision": "a4dd4d1689bc8ab82c0bf8e17aab881e"
  },
  {
    "url": "storybook-helpers-bff92679.js",
    "revision": "fe699fe4950dcb310f600235804322f0"
  },
  {
    "url": "stripe-elements-c68ff575.js",
    "revision": "3ebefd06467c8d0b5bbac9a47ce283e8"
  },
  {
    "url": "stripe-elements.stories-9f6ad176.js",
    "revision": "b8a57fab406b2de7fe8de6e6049954c0"
  },
  {
    "url": "stripe-payment-request.stories-bf58b4d8.js",
    "revision": "a3aad4da0241c24e49b60672448842c1"
  },
  {
    "url": "vanilla.stories-cb39425e.js",
    "revision": "00aa54aca7dfd97edf4fb05a954bd98f"
  },
  {
    "url": "vue.stories-1a82d2ad.js",
    "revision": "db250bdb97b91523bc4058078b467f1d"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
