const chartArea = document.querySelector(".chart");
const barsWrapper = chartArea.querySelector(".bars-wrapper");
const textWrapper = chartArea.querySelector(".text-wrapper");

function generateChart(data) {
	clearChart();
	let chartHeight = barsWrapper.offsetHeight;
	data.forEach((item) => {
		createBar((chartHeight / 5) * item[1], item[0]);
	});
}

function createBar(height, text) {
	let bar = document.createElement("div");
	bar.classList.add("bar");
	bar.style.height = height + "px";
	barsWrapper.appendChild(bar);

	let label = document.createElement("p");
	label.innerText = new Date(text).toLocaleDateString("en-GB");
	textWrapper.appendChild(label);
}

function clearChart() {
	barsWrapper.innerHTML = "";
	textWrapper.innerHTML = "";
}
