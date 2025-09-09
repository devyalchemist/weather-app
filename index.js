import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import axios from "axios";
import qr from "qr-image";
import { createWriteStream } from "fs";
import { configDotenv } from "dotenv";
import "dotenv/config";

const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
const weatherApiKey = process.env.WEATHER_API_KEY;
const timeApiUrl = "https://timeapi.io/api/timezone/coordinate";
const wikiUrl = "https://en.wikipedia.org";
let longitude;
let latitude;
let realWeather;
let realTime;
let realLocation;
let realTemp;
let realHumidity;
let realPressure;

const app = express();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = `${__dirname}/public/`;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicPath));
app.use(processQr);

app.get("/", (req, res) => {
	res.render("index.ejs", {
		result: "",
		template: "<div class='empty'></div>",
	});
});

function processQr(req, res, next) {
	// 	if (req.method !== "POST" || req.body) {
	// 		next();
	// 	}
	if (req.method === "POST" && req.path === "/submit") {
		// Middleware logic only for POST /submit
		realLocation = req.body.location;
		var qr_img = qr.image(`${wikiUrl}/wiki/${realLocation}`, { type: "png" });
		qr_img.pipe(createWriteStream(`${publicPath}/images/qr.png`));

		console.log("Processing /submit POST request");
	}
	next();
	//     if(req.)
}

app.post("/submit", async (req, res) => {
	const { location } = req.body;
	// realLocation = location;
	const weatherconfig = {
		params: {
			q: location,
			appid: weatherApiKey,
			units: "metric",
		},
	};

	try {
		// const { data } = await axios.get("https://api.openweathermap.org/data/2.5/weather?q=london&units=metric");

		const { data } = await axios.get(weatherApiUrl, weatherconfig);
		const weather = data.weather[0].description;
		const temperature = data.main.temp;
		const humidity = data.main.humidity;
		const pressure = data.main.pressure;
		realHumidity = humidity;
		realPressure = pressure;
		realWeather = weather;
		realTemp = temperature;
		longitude = data.coord.lon;
		latitude = data.coord.lat;
		console.log(longitude, latitude);
	} catch (error) {
		console.error(`Error message: ${error.message}`);
		const weatherApiError =
			error.response?.data?.message || "City not found or API error";

		// res.render("index.ejs", {
		// 	result: apiError,
		// });
		// res.render("index.ejs", `Error: ${JSON.stringify(error.response.data)}`);
	}
	let description = getTemperatureDrama(realTemp);

	const timeConfig = {
		params: {
			longitude: longitude,
			latitude: latitude,
		},
	};

	try {
		const { data } = await axios.get(timeApiUrl, timeConfig);
		const [date, rest] = data.currentLocalTime.split("T");
		const [time, chunk] = rest.split(".");
		realTime = time;
	} catch (error) {
		console.error(error.message);
	}
	const result = {
		weather: realWeather,
		time: realTime,
		location: location.toUpperCase(),
		description: description,
		temp: realTemp,
		humidity: realHumidity,
		pressure: realPressure,
	};
	res.render("index.ejs", { result: result, template: "" });
	// let weatherMusic = new Audio("sounds/weather-tone.mp3");
	// weatherMusic.play();
});

app.listen(port, () => {
	console.log(`Server running on port: ${port}`);
});

function getTemperatureDrama(tempCelsius) {
	if (tempCelsius < 0) {
		return "❄️ Dead-ass frozen. Your tears form icicles before they hit the ground. Even polar bears are like, 'Nah.'";
	} else if (tempCelsius <= 5) {
		return "🥶 The air hurts your face. Your phone battery dies out of spite. Winter is coming... and staying.";
	} else if (tempCelsius <= 10) {
		return "🧊 'It's brisk!' you lie to yourself. Your hands are now permanent pocket residents.";
	} else if (tempCelsius <= 15) {
		return "🌨️ Jacket weather. You'll carry an umbrella just to feel something.";
	} else if (tempCelsius <= 20) {
		return "🍂 'Perfect weather!' says no one from Canada. 'Tolerable,' says everyone else.";
	} else if (tempCelsius <= 25) {
		return "🌤️ Goldilocks zone. Shorts at noon, hoodie by sunset. Peak indecision.";
	} else if (tempCelsius <= 30) {
		return "🔥 Sweat is your new cologne. Fans oscillate like they're judging your life choices.";
	} else if (tempCelsius <= 35) {
		return "☀️ Satan's sauna. You could fry an egg on your dashboard (and your will to live).";
	} else if (tempCelsius <= 40) {
		return "🥵 The air is liquid fire. Shadows have abandoned you. Water is a tease.";
	} else if (tempCelsius <= 45) {
		return "♨️ Civilization was a mistake. The sun is now your mortal enemy.";
	} else if (tempCelsius <= 50) {
		return "💀 The pavement melts shoes. Birds spontaneously combust. Welcome to hell's porch.";
	} else if (tempCelsius <= 60) {
		return "☠️ NASA could study this for Mars simulations. You've evaporated. Goodbye.";
	} else {
		return "🛸 Congratulations! You've discovered a new state of matter. Call the UN.";
	}
}
