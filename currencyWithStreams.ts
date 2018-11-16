import './currency.html';
import { Observable, fromEvent, combineLatest, defer, from, of } from 'rxjs';
import { map, startWith, skip, tap, switchMap, share, debounceTime } from 'rxjs/operators';

export class RxCurrency { 
    private currency$: Observable<Event> = fromEvent(document.getElementsByName('targetCurrency'),
        'click'
    );
    private amount$: Observable<Event> = fromEvent(document.getElementById('amount'), 'input');


    constructor( ) {

        let mappedAmount$ =  this.amount$.pipe(map(($event: Event) => +(<HTMLInputElement>$event.target).value ) );
        // mappedAmount$.subscribe(amount => console.log(amount));

        let mappeedCurrency$ =  this.currency$.pipe(map(($event: Event) => (<HTMLInputElement>$event.target).value  ) ) ;
        // mappeedCurrency$.subscribe(currentCurrency =>
        //   console.log(`currenctCurrency ${currentCurrency} `)
        // );    
            

        combineLatest(mappedAmount$.pipe(startWith(10)), mappeedCurrency$.pipe(startWith('USD')))
          .pipe(skip(1))
          .pipe( debounceTime(300) )
          .pipe(
            tap(([amount, currency]) => console.log(`${amount} - ${currency} `) )  
            ,switchMap(([amount, currency]) => this.getFromServerWithObservable(amount, currency)  ))
          .subscribe(  convertedAmount => { 
              console.log(convertedAmount);
              (<HTMLInputElement>(document.getElementById('convertedAmounth'))).value = convertedAmount.toString();
            });
    }

    private getFromServerWithObservable = (amount: number, targetCurrency: string): Observable<number> => {
        return  Observable.create( observer => { 
            let xhr = new XMLHttpRequest();

            let onLoad = () => {
                if (xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    observer.next(data.result);
                    observer.complete();
                } else {
                    observer.error(xhr.statusText);
                }
            };

            xhr.addEventListener("load", onLoad);

            xhr.open('GET', `http://localhost:3000/convert/usd/${targetCurrency}/${amount}`);
            xhr.send();

            return () => {
                console.log("cleanup");
                xhr.removeEventListener("load", onLoad);
                xhr.abort();
            }

        });
    } 

    // private getFromServer = (amount: number, targetCurrency: string): void => {
    //     fetch(`http://localhost:3000/convert/usd/${targetCurrency}/${amount}`)
    //         .then(response => {
    //             if (!response.ok) throw response.status;
    //             else {
    //                 response.json().then(data => {
    //                     console.log(data);
    //                     (<HTMLInputElement>(document.getElementById('convertedAmounth'))).value = data.result;
    //                 });
    //             }
    //         });
    // }

    // private getFromServerWithPromise = (amount: number, targetCurrency: string): Observable<any> => {
    //     return defer( () => { 
    //         return from(fetch(`http://localhost:3000/convert/usd/${targetCurrency}/${amount}`)
    //             .then( r => {
    //                 if( r.ok ) return r.json();
    //                 else return Promise.reject(r.statusText);
    //             }   )  );
    //     } );

    // }

}