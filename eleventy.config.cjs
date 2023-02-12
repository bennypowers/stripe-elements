const SyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const DirectoryOutputPlugin = require('@11ty/eleventy-plugin-directory-output');
const TableOfContentsPlugin = require('eleventy-plugin-toc');
const markdownItAnchor = require('markdown-it-anchor')
const fs = require('fs/promises');
const path = require('path');

module.exports = function(eleventyConfig) {
  eleventyConfig.amendLibrary('md', md => md.use(markdownItAnchor));

  eleventyConfig.addPlugin(SyntaxHighlight);
  eleventyConfig.addPlugin(TableOfContentsPlugin);
  eleventyConfig.addPlugin(DirectoryOutputPlugin);

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

  // Return your Object options:
  return {
    templateEngineOverride: 'njk,md',
    dir: {
      input: "docs",
      output: "_site"
    }
  }
};
