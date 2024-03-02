// Main Content
const content = document.querySelector(".content");

// No Data Text
const noDataMessage = document.querySelector(".no-data-message");

// Chart Container
const chartContainer = document.querySelector(".chart-container");

// Chart Title
const chartTitle = document.querySelector(".chart-title");

// Input Popup Toggle Button
const inputPopupToggleButton = document.querySelector(".add-button");

// Input Popup
const inputPopupContainer = document.querySelector(".input-wrapper");
const inputPopup = document.querySelector(".input-popup");

// Input Popup Form
const inputForm = document.querySelector(".input-form");
const inputSubmitButton = document.querySelector(".input-submit-button");

// Chart Mode Input
const chartModeInput = document.querySelector(".chart-mode");

// Chart Range Inputs
const rangeYearInput = document.querySelector(".range-year");
const rangeMonthInput = document.querySelector(".range-month");
const rangeWeekInput = document.querySelector(".range-week");

// Chart Mode (Default: Week)
let chartMode = "week";

// Chart Ranges
let yearRange;
let monthRange;
let weekRange;

// Input Popup Toggle Button
inputPopupToggleButton.addEventListener("click", toggleInputPopup);

// Input Popup Form Submit Button
inputSubmitButton.addEventListener("click", (e) => {
	e.preventDefault();
	toggleInputPopup();
	processNewRecord();
	renderChart();
});

// Chart Mode Input
chartModeInput.addEventListener("change", () => {
	changeChartMode();
	renderChart();
});

// Chart Range Inputs
rangeYearInput.addEventListener("change", () => {
	getYearRange();
	renderChart();
});
rangeMonthInput.addEventListener("change", () => {
	getMonthRange();
	renderChart();
});
rangeWeekInput.addEventListener("change", () => {
	getWeekRange();
	renderChart();
});

// Render the Chart
function renderChart() {
	let data = loadLocalStorage();
	let sortedData;
	if (data.length > 0) {
		generateYears(new Date(data[0][0]).getFullYear());
		setMinRangeInputValues(new Date(data[0][0]));
	}
	sortedData = sortData(data);
	if (sortedData.length == 0) {
		toggleNoDataMessage(true);
	} else {
		toggleNoDataMessage(false);
	}
	generateChart(sortedData);
}

// Sort the Data Using the Range Input Values & Chart Mode
function sortData(data) {
	let filteredData;
	switch (chartMode) {
		case "year":
			getYearRange();
			filteredData = data.filter(filterYearRange);
			break;
		case "month":
			getMonthRange();
			filteredData = data.filter(filterMonthRange);
			break;
		case "week":
			getWeekRange();
			filteredData = data.filter(filterWeekRange);
			break;
		case "all":
			filteredData = data;
			break;
	}
	return filteredData;
}

// Year Range Filter
function filterYearRange(item) {
	if (new Date(item[0]).getFullYear() == yearRange) {
		return true;
	}
	return false;
}

// Month Range Filter
function filterMonthRange(item) {
	if (item[0].slice(0, -3) == monthRange) {
		return true;
	}
	return false;
}

// Week Range Filter
function filterWeekRange(item) {
	let itemYear = new Date(item[0]).getFullYear();
	let itemWeek = new Date(item[0]).getWeekNumber();
	let rangeYear = weekRange.split("-")[0];
	let rangeWeek = weekRange.split("-")[1].substring(1);
	if (itemYear == rangeYear) {
		if (itemWeek == rangeWeek) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

// Get the Year Range Input Value
function getYearRange() {
	yearRange = parseInt(rangeYearInput.value);
}

// Get the Month Range Input Value
function getMonthRange() {
	monthRange = rangeMonthInput.value;
}

// Get the Week Range Input Value
function getWeekRange() {
	weekRange = rangeWeekInput.value;
}

// Set Min Values to Month & Week Range Inputs
function setMinRangeInputValues(oldestDate) {
	let oldestYear = oldestDate.getFullYear();
	let oldestMonth =
		oldestYear +
		"-" +
		(oldestDate.getMonth() > 8
			? oldestDate.getMonth() + 1
			: "0" + (oldestDate.getMonth() + 1));
	let oldestWeek =
		oldestYear +
		"-W" +
		(oldestDate.getWeekNumber() > 9
			? oldestDate.getWeekNumber()
			: "0" + oldestDate.getWeekNumber());
	rangeMonthInput.min = oldestMonth;
	rangeWeekInput.min = oldestWeek;
}

// Set Max Values to Month & Week Range Inputs
function setMaxRangeInputValues() {
	rangeMonthInput.max = rangeMonthInput.value;
	rangeWeekInput.max = rangeWeekInput.value;
}

// Set Default Values to Month & Week Range Inputs
function setDefaultRangeInputValues() {
	rangeMonthInput.valueAsDate = new Date();
	rangeWeekInput.valueAsDate = new Date();
}

// Set Default & Max Values to Input Form
function setDefaultInputValues() {
	let { date } = inputForm.elements;
	date.valueAsDate = new Date();
	date.max = date.value;
}

// Generate Years For Year Range Input
function generateYears(startYear) {
	rangeYearInput.innerHTML = "";
	let endYear = new Date().getFullYear();
	for (let year = endYear; year >= startYear; year--) {
		let option = document.createElement("option");
		option.innerText = year;
		option.value = year;
		if (year == yearRange) {
			option.selected = true;
		}
		rangeYearInput.append(option);
	}
}

// Change Chart Mode
function changeChartMode() {
	switch (chartModeInput.value) {
		case "week":
			chartTitle.innerText = "Weekly Stress";
			rangeYearInput.classList.add("display-none");
			rangeMonthInput.classList.add("display-none");
			rangeWeekInput.classList.remove("display-none");
			chartMode = "week";
			break;
		case "month":
			chartTitle.innerText = "Monthly Stress";
			rangeYearInput.classList.add("display-none");
			rangeMonthInput.classList.remove("display-none");
			rangeWeekInput.classList.add("display-none");
			chartMode = "month";
			break;
		case "year":
			chartTitle.innerText = "Yearly Stress";
			rangeYearInput.classList.remove("display-none");
			rangeMonthInput.classList.add("display-none");
			rangeWeekInput.classList.add("display-none");
			chartMode = "year";
			break;
		case "all":
			chartTitle.innerText = "All Stress";
			rangeYearInput.classList.add("display-none");
			rangeMonthInput.classList.add("display-none");
			rangeWeekInput.classList.add("display-none");
			chartMode = "all";
			break;
	}
}

// Create New Record
function processNewRecord() {
	let { date, stressLevel } = inputForm.elements;
	let newRecord = [];
	newRecord[0] = date.value;
	newRecord[1] = parseInt(stressLevel.value);
	saveLocalStorage(newRecord);
}

// Toggle No Data Message
function toggleNoDataMessage(state) {
	if (state) {
		chartContainer.classList.add("display-none");
		noDataMessage.classList.remove("display-none");
	} else {
		chartContainer.classList.remove("display-none");
		noDataMessage.classList.add("display-none");
	}
}

// Toggle Input Popup
function toggleInputPopup() {
	inputPopupContainer.classList.toggle("active");
	inputPopupToggleButton.classList.toggle("active");
	inputPopup.classList.toggle("active");
}

// Load Data From LocalStorage
function loadLocalStorage() {
	let localData;
	if (localStorage.getItem("stressData") === null) {
		localData = [];
	} else {
		localData = JSON.parse(localStorage.getItem("stressData"));
	}
	return localData;
}

// Save/Overwrite To LocalStorage
function saveLocalStorage(data) {
	let localData;
	let overwrite = false;
	if (localStorage.getItem("stressData") === null) {
		localData = [];
	} else {
		localData = JSON.parse(localStorage.getItem("stressData"));
	}
	localData.forEach((element) => {
		if (element[0] === data[0]) {
			element[1] = data[1];
			overwrite = true;
		}
	});
	if (!overwrite) {
		localData.push(data);
	}
	localData.sort();
	localStorage.setItem("stressData", JSON.stringify(localData));
}

// Get the Number of the Week of a Given Date
Date.prototype.getWeekNumber = function () {
	var d = new Date(
		Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
	);
	var dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

setDefaultInputValues();
setDefaultRangeInputValues();
setMaxRangeInputValues();
renderChart();
