import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import path from "path";
import Image from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(
      format || "dd LLLL yyyy"
    );
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Return the keys used in an object
  eleventyConfig.addFilter("getKeys", (target) => {
    return Object.keys(target);
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter((tag) => ["all", "posts"].indexOf(tag) === -1);
  });

	const md = new markdownIt({
		html: true,
	});
	eleventyConfig.addFilter("markdown", (content) => {
		return md.render(content);
	});

	async function contentImgUrlFilter(src) {
    const inputDir = path.dirname(this.page.inputPath);
    const imagePath = path.resolve(inputDir, src);
    const outputDir = path.dirname(this.page.outputPath);
    const urlPath = this.page.url;

    const stats = await Image(imagePath, {
      widths: [1200], // Width for Open Graph image
      formats: ["png"],
      outputDir: outputDir, // Output directory
      urlPath: urlPath, // Public URL path
      filenameFormat: function (hash, src, width, format) {
        return `${hash}-${width}.${format}`;
      },
    });

    return stats.png[0].url; // Return the URL of the processed image
  }

	eleventyConfig.addFilter("contentImgUrlFilter", contentImgUrlFilter);
}
