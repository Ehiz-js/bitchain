const API_KEY = "CG-PjMCbcHHbRFv9LsXK7ceVBUf";
const ctx = document.getElementById("btcChart").getContext("2d");
const basePrice = 60000;
const prices = [];
for (let i = 0; i < 30; i++) {
	if (i === 0) {
		prices.push(basePrice);
	} else {
		// Daily fluctuation (-3% to +3%)
		const fluctuation = 0.97 + Math.random() * 0.06;
		prices.push(Math.round(prices[i - 1] * fluctuation));
	}
}
const btcPriceChart = new Chart(ctx, {
	type: "line",
	data: {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
		datasets: [
			{
				label: "BTC Price (USD)",
				data: prices,
				borderColor: "#F7931A",
				borderWidth: 2,
				tension: 0.1,
				fill: false,
				pointRadius: 0, // Correct placement for hiding points
			},
		],
	},
	options: {
		scales: {
			x: {
				display: false, // Completely hides X axis (line, labels, ticks)
			},
			y: {
				display: false, // Completely hides Y axis (line, labels, ticks)
			},
		},
		plugins: {
			legend: {
				display: false, // Optional: hide legend
			},
		},
		responsive: true,
		maintainAspectRatio: false,
		animation: {
			// Corrected placement for animations
			tension: {
				duration: 1000,
				easing: "easeInQuad",
				from: 0.8,
				to: 0.1,
			},
		},
	},
});
let icon = document.querySelector(".icon");
let navLinks = document.querySelector(".nav-links");
let navCloseBTn = document.querySelector(".nav-close-btn");

icon.addEventListener("click", () => {
	if (navLinks.classList.contains("slide-right")) {
		navLinks.classList.remove("slide-right");
	}
	icon.classList.add("hidden");
	navLinks.classList.add("mobile-nav");
	navCloseBTn.classList.add("close-icon");
});
navCloseBTn.addEventListener("click", () => {
	navLinks.classList.add("slide-right");
	navCloseBTn.classList.remove("close-icon");
	icon.classList.remove("hidden");
});
