import cluster from 'cluster';
import { cpus } from 'os';
import express from 'express';
import http from 'http';
import infoRouter from './src/routes/info.js';
import randomRouter from './src/routes/apiRandom.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/info', infoRouter);
app.use('/api/randoms', randomRouter);

import expHbs from 'express-handlebars';
import handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

app.engine(
	'.hbs',
	expHbs.engine({
		extname: '.hbs',
		layoutsDir: path.join(__dirname + '/public/layout'),
		partialsDir: path.join(__dirname + '/public/partials'),
		defaultLayout: 'main.hbs',
		handlebars: allowInsecurePrototypeAccess(handlebars),
	})
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'public/views'));

const PORT = process.argv[2] || 8080; 

const forkMode = process.argv[3] == 'FORK';
const clusterMode = process.argv[3] == 'CLUSTER';
const numCPUs = cpus().length;

if (forkMode) {
	server.listen(PORT, () => {
		console.log(`Se inicio el server en el puerto: ${PORT}, PID = ${process.pid}`);
	});
} else if (clusterMode && cluster.isPrimary) {
	console.log(`Num CPUs = ${numCPUs}`);
	console.log(`PID MASTER = ${process.pid}`);

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('exit', (worker) => {
		console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString());
		cluster.fork();
	});
} else {
	server.listen(PORT, () => {
		console.log(`Se inicio el server en el puerto: ${PORT}, PID = ${process.pid}`);
	});
	server.on('error', (error) => {
		console.log(error);
	});
}
