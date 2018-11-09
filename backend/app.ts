import * as express from 'express';
import * as bodyParser from 'body-parser';
import { format } from 'path';
import * as cors from 'cors';

class App {
  public app: express.Application;
  private USDRates = {
    USD: 1,
    GBP: 0.766118,
    EUR: 0.880097,
    DEN: 53.89,
    BTC: 0.00016
  };

  constructor() {
    this.app = express();
    this.config();
    this.setRoutes();
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
  }

  private setRoutes(): void {
    this.app.get('/', (req, res) => res.send({ name: 'vlado' }));

    this.app.get('/convert/:from/:to/:amount', (request, response) => {
      let timeout = Math.random() * 1000 + Math.random() * 1000;
      if (request.params.to === 'DEN') timeout = timeout + 2000;
      setTimeout(() => {
        response.send({
          from: request.params.from,
          to: request.params.to,
          amount: request.params.amount,
          result: this.convert(request.params.to, request.params.amount)
        });
      }, timeout);
    });
  }

  private convert(to: string, amount: number): number {
    return this.USDRates[to.toUpperCase()] * amount;
  }
}

export default new App().app;
