const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const toc = require('eleventy-plugin-toc');
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')

// const litLabsSSR11ty = require('./lit-labs-ssr-11ty.cjs');

module.exports = function(eleventyConfig) {
  eleventyConfig.setLibrary('md', markdownIt({ html: true }).use(markdownItAnchor));

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(toc);

  eleventyConfig.addWatchTarget('docs/*.css');

  eleventyConfig.addWatchTarget('*.ts');
  eleventyConfig.addWatchTarget('lib/*.ts');

  eleventyConfig.addPassthroughCopy({
    'docs/*.{js,css}': true,
    '*.{js,d.ts,map}': 'stripe-elements',
    'lib/*.{js,d.ts,map}': 'stripe-elements/lib'
  });


  eleventyConfig.on('eleventy.before', async function () {
    const { build } = await import('./scripts/build.js');
    await build();
  });

  eleventyConfig.addShortcode('sandbox', function(id, args) {
    const url = new URL(`/embed/${id}`, 'https://codesandbox.io')
    Object.entries({view: 'preview', ...args}).forEach(([key, val]) => url.searchParams.set(key, val));
    return `<iframe
        src="${url.toString()}"
        style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
    `;
  })

  // eleventyConfig.addPlugin(litLabsSSR11ty);

  // Return your Object options:
  return {
    templateEngineOverride: 'njk,md',
    dir: {
      input: "docs",
      output: "_site"
    }
  }
};
