import express from "express";
import { Router } from "express";
import { cpus } from 'os';

const infoRouter = Router();

const numCPUs = cpus().length;

const processTypes = {
    processors: numCPUs,
    cwd: process.cwd(),
    pid: process.pid,
    node: process.version,
    memory: process.memoryUsage(),
    platform: process.platform,
    path: process.execPath,
    title: process.title
}

infoRouter.get('/', (req,res)=>{
    res.render('info', processTypes)
})

export default infoRouter;