import "dotenv/config.js";

import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  HtmlBasePlugin,
} from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

import pluginFilters from "./_config/filters.js";

import timeToRead from "eleventy-plugin-time-to-read";
import embedEverything from "eleventy-plugin-embed-everything";
import readerBar from "eleventy-plugin-reader-bar";
import svgSprite from "eleventy-plugin-svg-sprite";
import Webmentions from "eleventy-plugin-webmentions";
import { EleventyPluginCodeDemo } from "eleventy-plugin-code-demo";
import pluginUnfurl from "eleventy-plugin-unfurl";

export default async function (eleventyConfig) {
  // Drafts, see also _data/eleventyDataSchema.js
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  eleventyConfig
    .addPassthroughCopy({
      "./public/": "/",
    })
    .addPassthroughCopy("./content/feed/pretty-atom-feed.xsl")
    .addPassthroughCopy("./content/**/*.svg")
    .addPassthroughCopy("./content/**/*.pdf")
    .addPassthroughCopy("./content/**/*.gif")
    .addPassthroughCopy("./content/**/*.webm");

  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

  eleventyConfig.addBundle("css", {
    toFileDirectory: "dist",
  });

  eleventyConfig.addBundle("js", {
    toFileDirectory: "dist",
  });

  // Official plugins
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: "<!-- excerpt -->",
  });
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom", // or "rss", "json"
    outputPath: "/feeds/posts.xml",
    stylesheet: "pretty-atom-feed.xsl",
    collection: {
      name: "posts",
      limit: 0,
    },
    metadata: {
      language: "fr",
      title: "HaïkoOz",
      subtitle: "Journal personnel de GoOz, avec des mots petits et grands.",
      base: "https://blog.foojin.com/",
      author: {
        name: "GoOz",
      },
    },
  });

  // Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // Output formats for each image.
    formats: ["avif", "webp", "auto"],
    widths: [400, 812, 1400, "auto"],
    failOnError: false,
    htmlOptions: {
      imgAttributes: {
        // e.g. <img loading decoding> assigned on the HTML tag will override these values.
				sizes: "(min-width: 50em) 812px, 100vw",
        loading: "lazy",
        decoding: "async",
      },
    },
    sharpOptions: {
      animated: true,
    },
  });

  // Filters
  eleventyConfig.addPlugin(pluginFilters);

  eleventyConfig.addPlugin(IdAttributePlugin, {
    // slugify: eleventyConfig.getFilter("slugify"),
    // selector: "h1,h2,h3,h4,h5,h6", // default
  });

  // Community plugins
  eleventyConfig.addPlugin(timeToRead, {
    language: "fr",
    style: "short",
  });
  eleventyConfig.addPlugin(embedEverything);
  eleventyConfig.addPlugin(readerBar);
  eleventyConfig.addPlugin(svgSprite, {
    path: "./public/img/svg-sprite",
  });
  eleventyConfig.addPlugin(Webmentions, {
    domain: "blog.foojin.com",
    token: process.env.WEBMENTION_TOKEN,
  });
  eleventyConfig.addPlugin(pluginUnfurl);
  eleventyConfig.addPlugin(EleventyPluginCodeDemo, {
    name: "demo",
    renderDocument: ({ html, css, js }) => `
	  <!DOCTYPE html>
	  <html>
	    <head>
	    	<style>body{font-size:1.25em;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Oxygen,Cantarell,sans-serif;color:hsl(0 0% 80%);background-color:hsl(0 0% 20%);line-height:1.6}</style>
	      <style>${css}</style>
	    </head>
	    <body>
	      ${html}
	      <script>${js}</script>
	    </body>
	  </html>`,
    iframeAttributes: {
      frameborder: "0",
      width: "100%",
    },
  });
}

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk, *.html, *.liquid
  templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],

  // Pre-process *.md files with: (default: `liquid`)
  markdownTemplateEngine: "njk",

  // Pre-process *.html files with: (default: `liquid`)
  htmlTemplateEngine: "njk",

  // These are all optional:
  dir: {
    input: "content", // default: "."
    includes: "../_includes", // default: "_includes"
    data: "../_data", // default: "_data"
    output: "_site",
  },

  // -----------------------------------------------------------------
  // Optional items:
  // -----------------------------------------------------------------

  // If your site deploys to a subdirectory, change `pathPrefix`.
  // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

  // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
  // it will transform any absolute URLs in your HTML to include this
  // folder name and does **not** affect where things go in the output folder.

  pathPrefix: "/",
};

// module.exports = function (eleventyConfig) {
// App plugins
// eleventyConfig.addPlugin(require("./eleventy.config.drafts.js"));
// eleventyConfig.addPlugin(require("./eleventy.config.images.js"));
// };
