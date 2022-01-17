module.exports = function litLabsSSR11ty(eleventyConfig, options) {
  eleventyConfig.addTemplateFormats('lit.js');
  eleventyConfig.addExtension('lit.js', {
    async compile(inputContent, inputPath) {
      const { render } = await import('@lit-labs/ssr/lib/render-with-global-dom-shim.js');
      return async function() {
        const result = render(inputContent);
        return;
      }
    }
  });
}
