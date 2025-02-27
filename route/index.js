import userRouter from "./user.js";
import productRouter from "./product.js"

export class Route {
	constructor(app) {
		this.app = app;
		this.allRoute();
	}
	allRoute() {
		this.app.use('/user', userRouter);
		this.app.use('/product', productRouter)
	}
}
