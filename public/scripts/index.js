let weatherMusic = new Audio("sounds/weather-tone.mp3");
weatherMusic.loop = true;
weatherMusic.volume = 0.5;
// let musicBtn = document.getElementById("music-btn");
// document.addEventListener("DOMContentLoaded", () => {
// 	console.log("running 1");

// 	musicBtn.addEventListener("click", () => {
// 		console.log("clicked");
// 		document.addEventListener("DOMContentLoaded", () => {
// 			setTimeout(() => {
// 				weatherMusic.play();
// 				console.log("2");
// 			}, 2000);
// 		});
// 	});
// });
document.addEventListener("DOMContentLoaded", () => {
	let title = document.getElementById("cnt").textContent;
	if (title.length > 0) {
		const overlay = document.createElement("div");
		overlay.style.cssText =
			"position:fixed; top:0; left:0; width:1px; height:1px; opacity:0;";
		document.body.appendChild(overlay);
		overlay.click(); // Fake interaction
		setTimeout(() => {
			weatherMusic.play();
			console.log("plays");
		}, 1000);
	}
});

// document.addEventListener("DOMContentLoaded", () => {
// 	 // Now allowed
// });
