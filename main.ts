// alert('hello!');

import { interval, fromEvent, Observer, Observable } from 'rxjs';
import { map, filter, flatMap, retry, retryWhen, delay, debounceTime } from 'rxjs/operators';
import { merge } from 'rxjs/index';
import './index.html';
import {  Currency } from './currency';
import { RxCurrency } from './currencyWithStreams';

let currency = new Currency();
//let rxCurrency = new RxCurrency();

// export currency;

interface Coordinates {
  x: number;
  y: number;
}

let source = interval(1000); // rxjs.of(1, 2, 3);
let mouseSource = fromEvent(document, 'mousemove').pipe(
  map((e: MouseEvent) => {
    return {
      x: e.clientX,
      y: e.clientY
    };
  })
);

let outputDiv = document.getElementById('output');
let button = document.getElementById('getBooksButton');

let clicks = fromEvent(button, 'click');

function loadBooks(url: string): void {
  return Observable.create((observer: any) => {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
      if( xhr.status === 200 ) {
        let data = JSON.parse(xhr.responseText);
        observer.next(data);
        observer.complete();
      } else 
          observer.error(xhr.statusText);
    });
    xhr.open('GET', url);
    xhr.send();
  }).pipe(retry(2));
}

// function retryStrategy(): Observable<any> {
//   return function (errors: Observable<any>) {
//     return errors.pipe(delay(3000));
//   }
// }

function renderBooks(books: any): void {
  books.forEach((book: any) => {
    let div = document.createElement('div');
    div.innerText = book.title;
    outputDiv.appendChild(div);
  });
}

// clicks.pipe(flatMap(e => loadBooks('books.json2')))
//   .subscribe(renderBooks,
//     err => console.log(`error: ${err}`) );

class MyObserver implements Observer<number> {
  closed?: boolean;

  next(value: number) {
    console.log(`value ${value}`);
  }

  // next: (value: number) => {
  //    //console.log('yo');
  // //    console.log('ho ho');

  //  };

  error(err: any) {
    console.log(`error ${err}`);
  }
  complete() {
    console.log('completed !');
  }
}

let observer = source.subscribe(new MyObserver());

let transformedTimerSource = source.pipe(
  map((value: number) => {
    return {
      x: value,
      y: -1
    };
  })
);

 transformedTimerSource.subscribe(value => console.log(value));

// mouseSource
//   .pipe(debounceTime(100))
//     .subscribe( (value) => console.log(value) );

merge(mouseSource, transformedTimerSource)
  .pipe( filter( coordiates => coordiates.x <500  ) )
  .subscribe( coordiates => console.log(coordiates) );

// merge(mouseSource, transformedTimerSource)
//   .pipe(filter((value: Coordinates) => value.x < 500))
//   .subscribe(value => console.log(value));

// setTimeout(() => observer.unsubscribe(), 10000);
//  aaa.unsubscribe();
// console.log('no');
