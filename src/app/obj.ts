class details{
    name:string | undefined;
    qualification:string | undefined;
    dateOfBirth:Date | undefined;
    Department:string | undefined;
    CurrentAdderss:Address | undefined;
    CommunicationAddress:Address | undefined;
}

class Address{
    line1:string | undefined;
    line2:string | undefined;
    line3:string | undefined;
}

import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
 
const cancel$ = new Subject<void>();
 
const polling$ = interval(2000);
 
const subscription = polling$
 .pipe(takeUntil(cancel$))
 .subscribe(val => {
   console.log('Polling value:', val);
   // Place your API call or polling logic here
 });
 
setTimeout(() => {
 cancel$.next();
 cancel$.complete();
}, 7000);
