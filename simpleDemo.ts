import { interval, fromEvent, Observer, Observable, of } from 'rxjs';
import {   map, filter, flatMap,   retry,  retryWhen,   delay,
  debounceTime
} from 'rxjs/operators';
import { merge } from 'rxjs/index';
import './index.html';

export class SimpleDemo { 
   public  hello(): void {} 
}


let source =  interval(1000); // of(1, 2, 3);

//var mySubcriber =  source.subscribe( value => console.log(`value : ${value} `)  );
// setTimeout(  ()=> { 
//   mySubcriber.unsubscribe()
// }, 6000 );


let mouseSource = fromEvent(document, 'mousemove').pipe(
  map((e: MouseEvent) => {
    return {
      x: e.clientX,
      y: e.clientY
    };
  })
);

//mouseSource.subscribe( value => console.log(`x: ${value.x} y: ${value.y}`)  );

let button = document.getElementById('button');

let clicks = fromEvent(button, 'click');
clicks.subscribe(ev => console.log(`mouse clicked ${ev}`));

class MyObserver implements Observer<number> {
  closed?: boolean;

  next(value: number) {
    console.log(`value ${value}`);
  }

  error(err: any) {
    console.log(`error ${err}`);
  }
  complete() {
    console.log('completed !');
  }
}

let observer = source.subscribe(new MyObserver());
observer.unsubscribe();

let transformedTimerSource = source.pipe(
  map((value: number) => {
    return {
      x: value,
      y: -1
    };
  })
);

//transformedTimerSource.subscribe(value => console.log(value));

merge(mouseSource, transformedTimerSource)
  .pipe(filter(coordiates => coordiates.x < 500))
  //.pipe(debounceTime(100))
   .pipe(  filter( (value) => value.y >0 ) )
  ;//.subscribe(coordiates => console.log(coordiates));


// setTimeout(() => {
//   observer.unsubscribe(),
// } , 5000);
