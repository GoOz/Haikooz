const path = require("path");
const eleventyImage = require("@11ty/eleventy-img");

module.exports = eleventyConfig => {
	function relativeToInputPath(inputPath, relativeFilePath) {
		let split = inputPath.split("/");
		split.pop();

		return path.resolve(split.join(path.sep), relativeFilePath);
	}

	// Eleventy Image shortcode
	// https://www.11ty.dev/docs/plugins/image/
	eleventyConfig.addAsyncShortcode("image", async function imageShortcode(src, alt, sizes) {
		// Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
		// Warning: Avif can be resource-intensive so take care!
		let formats = ["avif", "webp", "auto"];
		let file = relativeToInputPath(this.page.inputPath, src);
		let metadata = await eleventyImage(file, {
			widths: [400, 812, 1400, "auto"],
			formats,
			sharpOptions: {
				animated: true
			},
			outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
		});

		// TODO loading=eager and fetchpriority=high
		let imageAttributes = {
			alt,
			sizes: sizes || "(min-width: 50em) 812px, 100vw",
			loading: "lazy",
			decoding: "async",
		};
		return eleventyImage.generateHTML(metadata, imageAttributes);
	});
	// OG Featured image
	eleventyConfig.addAsyncShortcode("ogFeatured", async function(src) {
		let metadata = await eleventyImage(src, {
			widths: [600],
			formats: ["jpeg"],
			outputDir: path.join(eleventyConfig.dir.output, "img")
		});

		let data = metadata.jpeg[metadata.jpeg.length - 1];
		return `<meta property="og:image" content="${data.url}">`;
	});
};
