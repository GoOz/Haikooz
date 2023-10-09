require("dotenv").config();

const { DateTime } = require("luxon");
const markdownItAnchor = require("markdown-it-anchor");
const eleventyImage = require("@11ty/eleventy-img");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const timeToRead = require('eleventy-plugin-time-to-read');
const embedEverything = require("eleventy-plugin-embed-everything");
const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");
const readerBar = require('eleventy-plugin-reader-bar')
const svgSprite = require("eleventy-plugin-svg-sprite");
const Webmentions = require("eleventy-plugin-webmentions");
const { EleventyPluginCodeDemo } = require('eleventy-plugin-code-demo');

module.exports = function(eleventyConfig) {
	// PassThroughCopy
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
	});
	eleventyConfig.addPassthroughCopy("./content/**/*.svg");
	eleventyConfig.addPassthroughCopy("./content/**/*.pdf");
	eleventyConfig.addPassthroughCopy("./content/**/*.gif");
	eleventyConfig.addPassthroughCopy("./content/**/*.webm");

	// Generate excerpts
	eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
  });

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// App plugins
	eleventyConfig.addPlugin(require("./eleventy.config.drafts.js"));
	eleventyConfig.addPlugin(require("./eleventy.config.images.js"));

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(bundlerPlugin);

	// Community plugins
	eleventyConfig.addPlugin(timeToRead, {
		language: 'fr',
		style: 'short'
	});
	eleventyConfig.addPlugin(embedEverything);
	eleventyConfig.addPlugin(readerBar)
	eleventyConfig.addPlugin(svgSprite, {
    path: "./public/img/svg-sprite",
  });
  eleventyConfig.addPlugin(Webmentions, {
    domain: "blog.foojin.com",
    token: process.env.WEBMENTION_TOKEN,
  });
  eleventyConfig.addPlugin(EleventyPluginCodeDemo, {
	  name: 'demo',
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
	    frameborder: '0',
	    width: '100%',
	  },
	});

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).setLocale('fr-FR').toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
	});

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});

	return {
		// Control which files Eleventy will process
		templateFormats: [
			"md",
			"njk",
			"html",
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",         // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
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
};
