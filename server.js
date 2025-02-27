import express from "express"
import path from 'path';
import { connectDatabase } from "./config/database.js";
import { Route } from './route/index.js';
import { cwd } from "process";
// const __dirname = path.resolve();


const app = express();

const PORT = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Used to serve static images
// app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/upload', express.static(path.join(cwd(), 'public/images')))

console.log(path.join(cwd(), 'public/images'))

//Routing
new Route(app);

//Db Connection
connectDatabase();

//App Listening to Port
app.listen(PORT, () => {
	console.log(`server is running on ${PORT}`);
})