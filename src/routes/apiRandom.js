import { Router } from 'express';
import { fork } from 'child_process';

const randomRouter = Router();
const child_process = fork('./utils/childProcess.js');

randomRouter.get('/', (req, res) => {
	const cant = req.query.cant || 10;
	child_process.send(cant);
	child_process.on('message', (msj) => {
		res.send(msj.res);
	});
});

export default randomRouter;
