import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
const app = express();
const port = 3000;
const API_URL = "https://api.coingecko.com/api/v3/";
const config = {
	params: { x_cg_demo_api_key: COINGECKO_API_KEY },
};
const homeCoins = {
	bitcoin: "bitcoin",
	solana: "solana",
	ethereum: "ethereum",
	xrp: "ripple",
};
let data = {};
let swapData = {};
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
	try {
		const bitcoin = await axios.get(
			`${API_URL}/simple/price?include_24hr_change=true&vs_currencies=usd&ids=${homeCoins.bitcoin}`,
			config
		);
		const solana = await axios.get(
			`${API_URL}/simple/price?include_24hr_change=true&vs_currencies=usd&ids=${homeCoins.solana}`,
			config
		);
		const ethereum = await axios.get(
			`${API_URL}/simple/price?include_24hr_change=true&vs_currencies=usd&ids=${homeCoins.ethereum}`,
			config
		);
		const xrp = await axios.get(
			`${API_URL}/simple/price?include_24hr_change=true&vs_currencies=usd&ids=${homeCoins.xrp}`,
			config
		);
		const trend = await axios.get(`${API_URL}search/trending`, config);
		const trendData = {
			trend: trend.data.coins.splice(0, 10),
		};
		const select = await axios.get(
			`${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25`,
			config
		);
		const options = select.data.map((coin) => ({
			coin: coin,
		}));
		res.render("index.ejs", {
			bitcoin: bitcoin.data,
			solana: solana.data,
			ethereum: ethereum.data,
			xrp: xrp.data,
			data: data,
			trendData: trendData,
			options: options,
			swapData: swapData,
		});
	} catch (error) {
		res.render("error.ejs");
	}
});

app.post("/search", async (req, res) => {
	const userInput = req.body.search;
	try {
		const response = await axios.get(
			`${API_URL}search?query=${userInput}`,
			config
		);
		data = {
			result1Name: response.data.coins[0].name,
			result1Symbol: response.data.coins[0].symbol,
			result2Name: response.data.coins[1].name,
			result2Symbol: response.data.coins[1].symbol,
			result3Name: response.data.coins[2].name,
			result3Symbol: response.data.coins[2].symbol,
		};
		res.redirect("/");
	} catch (error) {
		res.render("error.ejs");
	}
});

app.post("/swap", async (req, res) => {
	const userAmount = req.body.swap;
	const swapFrom = req.body["swap-from"];
	const swapTo = req.body["swap-to"];
	console.log(req.body);
	const swapFromPrice = await axios.get(
		`${API_URL}simple/price?vs_currencies=usd&names=${swapFrom}`,
		config
	);
	const swapToPrice = await axios.get(
		`${API_URL}simple/price?vs_currencies=usd&names=${swapTo}`,
		config
	);
	const swapResult =
		(swapFromPrice.data[swapFrom].usd * userAmount) /
		swapToPrice.data[swapTo].usd;
	swapData = {
		userAmount: userAmount,
		swapFrom: swapFrom,
		swapTo: swapTo,
		swapResult: swapResult,
	};
	res.redirect("/");
	try {
	} catch (error) {
		res.render("error.ejs");
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
