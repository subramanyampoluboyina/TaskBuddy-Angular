import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(
    private router:Router
  ){}
  ngOnInit(): void {
    this.removeDuplicates("subramanyam", true)
  }

  signin(){
    this.router.navigateByUrl('/landing');
  }

//   Given arr = [1, 2, 1, 2, 4, 3, 4, 3,9], write a program in Angular (TypeScript) 
// or C# to remove duplicate values and return the result in ascending order.
// Expected output: [1, 2, 3, 4,9]
  // arr=;
  removeDuplicates(name:string, printEven:Boolean){
    let reversedName='';
    let evenChars='';
    for (let index = name.length-1; index >= 0; index--) {
      reversedName+=name[index];
      if(printEven==true){
        if(index%2==0){
          evenChars+=name[index];
        }
      }
      else{
        if(index%2!=0){
          evenChars+=name[index];
        }
      }
    }
    console.log(reversedName);
    console.log(evenChars);
  }
}
