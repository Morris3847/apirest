import express from "express";

class Server {

    public app: any;
    public port: any;

    constructor(port: any) {
        this.app = express();
        this.port = port;
    }

    start(): void {
        this.app.listen(this.port, () => {
            console.log(`Servidor ejecutándose en http://localhost:${this.port}`);
        });
    }
}

export default Server;