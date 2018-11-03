// alert('hello!');

import * as rxjs from 'rxjs';
import { Observer } from 'rxjs';
import './index.html';

let source = rxjs.interval(1000); // rxjs.of(1, 2, 3);
// let source =

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
setTimeout(() => observer.unsubscribe(), 10000);
//  aaa.unsubscribe();
// console.log('no');
