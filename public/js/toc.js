window.addEventListener("DOMContentLoaded", () => {
	const observer = new IntersectionObserver((entries) => {
		const toc = document.querySelector(".toc");
		const list = toc.firstElementChild;
		entries.forEach((entry) => {
			const id = entry.target.getAttribute("id");
			if (entry.intersectionRatio > 0) {
				document.querySelector(".active")?.classList.remove("active");
				const active = document.querySelector(
					`.toc li a[href="#${id}"]`
				).parentElement;
				active.classList.add("active");
				if (list.offsetHeight > toc.offsetHeight) {
					active.scrollIntoView({ behavior: "smooth", block: "nearest" });
				}
			}
		});
	});

	// Track all sections that have an `id` applied
	document
		.querySelectorAll(".article-wrapper .article-content :is(h2,h3,h4)[id]")
		.forEach((section) => {
			observer.observe(section);
		});
});
