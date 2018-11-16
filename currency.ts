import './currency.html';

export class Currency {

  constructor() {
    document.getElementsByName('targetCurrency')
          .forEach(e => e.addEventListener('click', this.currencyChanged));

    document.getElementById('amount').addEventListener('input' , this.amountChanged);
  }

  private amountChanged = ($event: Event) : void => { 
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

  private currencyChanged = ($event: Event): void => {
    const targetCurrency = (<HTMLInputElement>$event.target).value;
    const amount = +(<HTMLInputElement>document.getElementById('amount')).value;
    console.log(`amount: ${amount} , currency: ${targetCurrency}`);
    this.getFromServer(amount, targetCurrency);
  }
}

