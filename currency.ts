import './currency.html';
import { Observable, fromEvent } from 'rxjs';

export class Currency {
  private selection$: Observable<Event> = fromEvent(
    document.getElementsByName('targetCurrency'),
    'click'
  );

  constructor() {
    // this.selection$.subscribe($event => console.log((<HTMLInputElement>$event.target).value ) );
    document.getElementsByName('targetCurrency')
          .forEach(e => e.addEventListener('click', this.currencyChanged));

    document.getElementById('amount').addEventListener('input' , this.amountChanged);
  }

  public amountChanged = ($event: Event) : void => { 
      const targetCurrency: string = this.getSelectedCurrency();
      const amount : number  = +(<HTMLInputElement>$event.target).value;
      console.log(`cur: ${targetCurrency} amount: ${amount} `);
      this.getFromServer(amount, targetCurrency );

  }

  private getSelectedCurrency = (): string => { 
      const currencies = document.getElementsByName('targetCurrency');
      for (let i = 0; i < currencies.length; i++  )  {
          const element: HTMLInputElement = (<HTMLInputElement> currencies[i]);
          if( element.checked ) return element.value;
      }
      return '';
  }

    private getFromServer = (amount: number, targetCurrency: string) : void => {
      fetch(`http://localhost:3000/convert/usd/${targetCurrency}/${amount}`)
          .then(response => {
              if (!response.ok) throw response.status;
              else {
                  response.json().then(data => {
                      console.log(data);
                      (<HTMLInputElement>(document.getElementById('convertedAmounth'))).value = data.result;
                  });
              }
          });
    }

  public currencyChanged = ($event: Event): void => {
    const targetCurrency = (<HTMLInputElement>$event.target).value;
    const amount = +(<HTMLInputElement>document.getElementById('amount')).value;
    console.log(amount);

    console.log(targetCurrency);
    this.getFromServer(amount, targetCurrency);

 
  }
 
}

//console.log(document.getElementsByName('targetCurrency')[0]);
