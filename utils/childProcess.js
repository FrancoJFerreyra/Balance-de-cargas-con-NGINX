import randomNumber from "./genRandomNumber.js";

process.on("message", (cant) => {
	const numbers = randomNumber(cant);
	process.send({ res: numbers });
});