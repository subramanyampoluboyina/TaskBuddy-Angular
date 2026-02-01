import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupName,
  Validators,
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import moment from 'moment';
import { ApiServiceService } from '../../services/api-service.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit, OnDestroy {
  username = 'Subramanyam';
  layout: any = 'list';
  showTodoAddTask = false;
  selectedTask: any={};
  selectedDate: Date | null = null;
  showAddDate = false;
  isStatusListOpened = false;
  isCategoryListOpened = false;
  isListBoxVisible = false;
  addTaskDialogVisible = false;
  editTaskDialogVisible = false;
  @ViewChild('dateInput') dateInput!: ElementRef;
  statusCallBackFn:Function | null =null;
  categoryCallBackFn:Function | null = null;
  viewOptions: any[] = [
    { label: 'List', value: 'list', icon: 'pi pi-bars' },
    { label: 'Board', value: 'grid', icon: 'pi pi-table' },
  ];
  // categoryDropDown = [
  //   { name: 'Work', value: 'Work' },
  //   { name: 'Personal', value: 'Personal' },
  // ];
  todoCols = [
    { field: 'taskTitle', header: 'Task Name' },
    { field: 'dueDate', header: 'Due Date' },
    { field: 'statusName', header: 'Task Status' },
    { field: 'categoryValue', header: 'Task Category' },
  ];
  todoData: any = [];
  inProgressData: any = [];
  completedData: any = [];
  editMenuItems = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        if (this.selectedTask){
          this.getTask(this.selectedTask);
        } 
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      styleClass: 'deleteMenuItem',
    },
  ];
  // taskStatusMenuItems = [
  //   { name: 'TO-DO', value: 'todo' },
  //   { name: 'IN-PROGRESS', value: 'inprogress' },
  //   { name: 'COMPLETED', value: 'completed' },
  // ];
  // taskCategoryMenuItems = [
  //   { name: 'Work', value: 'work' },
  //   { name: 'Personal', value: 'personal' },
  // ];
  statusDropDown:any=[];
  categoryDropDown:any=[];
  addTask!: FormGroup;
  constructor(
    private builder: FormBuilder,
    private apiService:ApiServiceService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.addTask = this.builder.group({
      taskTitle: this.builder.control('', Validators.required),
      description: this.builder.control('', this.maxTextLengthValidator(300)),
      dueDate: this.builder.control(null, Validators.required),
      status: this.builder.control('', Validators.required),
      category: this.builder.control('', Validators.required),
      documents: this.builder.array([]),
    });
    document.body.addEventListener('click', this.onClickOutside);
    this.getStatusDropDown();
    this.getCategoryDropDown();
    this.getTasks();
  }

  documents():FormArray{
    return this.addTask.get('documents') as FormArray;
  }

  getStatusDropDown(){
    this.apiService.get('MstStatus').subscribe({
      next:(data:any)=>{
        if(data.result='Success'){
          this.statusDropDown=data.data;
        }
        else{
          this.messageService.add({ severity: 'warn', summary: data.result, detail: data.message })
        }
      },
      error:(err:any)=>{
        this.messageService.add({ severity: 'error', summary: err.error.result, detail: err.error.message })
      }
    })
  }

  getCategoryDropDown(){
    this.apiService.get('MstCategory').subscribe({
      next:(data:any)=>{
        if(data.result='Success'){
          this.categoryDropDown=data.data;
        }
        else{
          this.messageService.add({ severity: 'warn', summary: data.result, detail: data.message })
        }
      },
      error:(err:any)=>{
        this.messageService.add({ severity: 'error', summary: err.error.result, detail: err.error.message })
      }
    })
  }

  getTasks(){
    this.apiService.get('AddTask').subscribe({
      next:(data:any)=>{
        if(data.result=="Success"){
          if(data.data.length){
            data.data.forEach((element: any) => {
              if(element.mstStatus.name=='To-Do'){
                this.todoData.push(element)
                console.log(this.todoData);
              }
              else if(element.mstStatus.name=='In-Progress'){
                this.inProgressData.push(element);
                console.log(this.inProgressData);
              }
              else if(element.mstStatus.name=='Completed'){
                this.completedData.push(element);
                console.log(this.completedData);
              }
            });
          }                 
        }
        else{
          this.messageService.add({ severity: 'warn', summary: data.result, detail: data.message })
        }
      },
      error:(err:any)=>{
        this.messageService.add({ severity: 'error', summary: err.error.result, detail: err.error.message })
      }
    })
  }

  onClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.p-listbox') && !target.closest('.openListBtn')) {
      if (this.isListBoxVisible) {
        this.isListBoxVisible = false;
        this.isStatusListOpened = false;
        this.isCategoryListOpened = false;
      }
    }
  };

  showDatePicker() {
    this.dateInput.nativeElement.showPicker(); // Opens the native date picker
  }

  openStatusList(event: Event) {
    event.stopPropagation();
    this.isStatusListOpened = false;
    this.isCategoryListOpened = false;
    this.isStatusListOpened = !this.isStatusListOpened;
    this.isListBoxVisible = !this.isListBoxVisible;
  }

  openCategoryList(event: Event) {
    event.stopPropagation();
    this.isStatusListOpened = false;
    this.isCategoryListOpened = false;
    this.isCategoryListOpened = !this.isCategoryListOpened;
    this.isListBoxVisible = !this.isListBoxVisible;
  }

  drop(list: any, event: CdkDragDrop<string[]>) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }

  showDialog() {
    this.addTaskDialogVisible = true;
    this.selectedTask={}
  }

  showTodoAddTaskFn(){
    this.showTodoAddTask=!this.showTodoAddTask;
    this.selectedTask={};
  }

  formatUTCDate(dateString:Date | null | undefined){
    let momentObj = moment(dateString);
    let date =momentObj.toDate();
    var year = date ? date.getFullYear():9999;
    var month = date ? date.getMonth():99;
    var day = date ? date.getDate():99;
    return Date.UTC(year,month,day);
  }

  getCharacterCount(content: any) {
    if (!content) return 0;

    // Create a temporary div element to parse HTML
    const div = document.createElement('div');
    div.innerHTML = content;

    if (div.innerText.length > 300) {
      this.addTask.get('description');
    }
    // Extract only text content (ignoring HTML tags)
    return div.innerText.length;
  }

  maxTextLengthValidator(maxLength: number) {
    return (control: AbstractControl) => {
      if (!control.value) return null; // If empty, don't validate

      // Convert HTML content to plain text
      const div = document.createElement('div');
      div.innerHTML = control.value;
      const textLength = div.innerText.length;

      // Validate length
      return textLength > maxLength ? { maxLengthExceeded: true } : null;
    };
  }

  onUpload(e: any) {
    const file: File = e.target.files[0];
    let size = file.size;
    let sizeExt =new Array('Bytes', 'KB', 'MB', 'GB');
    let i=0;
    while(size>900){
      size/=1024;
      i++;
    }
    const fileSize=(Math.round(size*100)/100) +' '+ sizeExt[i];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const content = event.target.result;
        let document=this.builder.group({
          documentName:file.name,
          base64Content:content,
          documentType:file.type,
          documentSize:fileSize
        });
        this.documents().push(document);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteDoc(index: any) {
    this.documents().removeAt(index);
    // this.uploadedFiles.splice(index, 1);
  }

  clearFile(e: any) {
    e.target.value = '';
  }
  clearAllValues() {
    this.editTaskDialogVisible=false;
    this.addTaskDialogVisible=false;
    this.selectedTask={};
    this.addTask.reset();
    this.statusCallBackFn?.();
    this.categoryCallBackFn?.();
    // this.documents().clear();
    // this.uploadedFiles = [];
  }

  //  --- not used --- //
  clearFormControlValue(value: any, closeCallBack:Function) {
    value.setValue('');
    closeCallBack();
  }

  storeStatusCloseCallback(closeCallBack:Function){
    this.statusCallBackFn=closeCallBack;
  }
  storeCategoryCloseCallback(closeCallBack:Function){
    this.categoryCallBackFn=closeCallBack;
  }

  openMenu(event: Event, rowData: any, menu: any) {
    this.selectedTask = rowData; // Store rowData for edit
    menu.toggle(event); // Open the menu
  }

  submit() {
    var task = this.addTask.value;
    if(this.addTask.valid){
      console.log(this.addTask.value);
      task.dueDate = new Date(this.formatUTCDate(task.dueDate));
      this.apiService.post(task,'AddTask').subscribe({
        next:(data:any)=>{
          if(data.result=="Success"){
            this.messageService.add({severity:'success',detail:data.result,summary:data.message});
            this.addTask.reset();
            this.documents().clear();
            this.statusCallBackFn?.();
            this.categoryCallBackFn?.();
            this.addTaskDialogVisible=false;
            this.editTaskDialogVisible=false;
          }
          else{
            this.messageService.add({severity:'warn',detail:data.result,summary:data.message});
          }
        },
        error:(err:any)=>{
          this.messageService.add({severity:'error',detail:err.error.result,summary:err.error.message});
        }
      });
      // if (task.status.value == 'todo') {
      //   this.todoData.push(task);
      // }
      // else if(task.status.value == 'inprogress'){
      //   this.inProgressData.push(task);
      // }
      // else if(task.status.value == 'completed'){
      //   this.completedData.push(task);
      // }
      // this.addTaskDialogVisible=false;
      // this.editTaskDialogVisible=false;
    }
  }

  getTask(data: any) {
    this.editTaskDialogVisible = true;
    this.documents().clear();
    this.addTask.patchValue({
      taskTitle: data.taskTitle,
      description: data.description,
      category: data.mstCategory,
      dueDate: new Date(data.dueDate),
      status: data.mstStatus,
    });

    this.apiService.get(`GetDocuments/${data.id}`).subscribe({
      next:(data:any)=>{
        if(data.result=='Success'){
          data.data.forEach((doc:any) => {
            let document=this.builder.group({
              documentName:doc.documentName,
              base64Content:doc.base64Content,
              documentType:doc.documentType,
              documentSize:doc.documentSize,
              documentId:doc.id
            });
            this.documents().push(document);
          });
        }
      },
      error:(err:any)=>{
        this.messageService.add({severity:'error',detail:err.error.result,summary:err.error.message});
      }
    })
    // Manually trigger value change for Quill Editor
    setTimeout(() => {
      this.addTask.get('description')?.setValue(data.description || '');
    }, 0);
    console.log(this.addTask.value);
    console.log(this.documents());
  }

  deleteTask(data: {}) {}

  ngOnDestroy(): void {
    document.body.removeEventListener('click', this.onClickOutside);
  }
}
