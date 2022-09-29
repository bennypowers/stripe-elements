const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const directoryOutputPlugin = require('@11ty/eleventy-plugin-directory-output');
const toc = require('eleventy-plugin-toc');
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const fs = require('fs/promises');
const path = require('path');

// const litLabsSSR11ty = require('./lit-labs-ssr-11ty.cjs');

module.exports = function(eleventyConfig) {
  eleventyConfig.setLibrary('md', markdownIt({ html: true }).use(markdownItAnchor));

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(toc);
  eleventyConfig.addPlugin(directoryOutputPlugin);

  eleventyConfig.addWatchTarget('docs/*.css');

  eleventyConfig.addWatchTarget('*.ts');
  eleventyConfig.addWatchTarget('lib/*.ts');

  eleventyConfig.addPassthroughCopy({
    'docs/*.{js,css}': true,
    '*.{js,d.ts,map}': 'stripe-elements',
    'lib/*.{js,d.ts,map}': 'stripe-elements/lib'
  });

  eleventyConfig.addShortcode('cem', async function() {
    const { customElementsManifestToMarkdown } = await import('@custom-elements-manifest/to-markdown');
    const customElementsManifest = JSON.parse(await fs.readFile(path.join(__dirname, 'custom-elements.json')))
    const content = customElementsManifestToMarkdown(customElementsManifest, {
      headingOffset: 2,
      private: 'details',
    });

    return `<div class="api-table">

${content}

</div>`;
  });

  eleventyConfig.on('eleventy.before', async function () {
    const { execaCommand } = await import('execa');
    await execaCommand('npm run build:esbuild');
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
    pathPrefix: process.env.CONTEXT === 'deploy-preview' ? '' : '/stripe-elements/',
    dir: {
      input: "docs",
      output: "_site"
    }
  }
};
