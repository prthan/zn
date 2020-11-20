import { Component, ElementRef, HostListener, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';

declare global
{
  var zn :zn;
  var $ :any;
  var fuse :any;
  var numeral :any;
  var moment :any;
}

@Component({
  selector: 'zn-dialog',
  template: `
  <div class="zn-dialog-wrapper">
    <div class="zn-dialog-header"></div>
    <div class="zn-dialog-content"><ng-content></ng-content></div>
    <div class="zn-dialog-footer">
      <div class="zn-actions left-actions"></div>
      <div class="zn-actions right-actions"></div>
    </div>
  </div>
  `,
})
export class znDialogComponent implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() "dialog-title" :string;
  @Input() actions :Array<any>;

  @Output() onAction :EventEmitter<any> = new EventEmitter<any>();

  private dialog :znDialog;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znDialogOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      title: this["dialog-title"],
      actions: this.actions,
      wrap: "N"
    };

    this.dialog=new (zn.findClass('zn.ui.components.Dialog'))(options);
    if(this.onAction.observers.length>0) this.dialog.on("action",(evt: any)=>this.onAction.emit(evt));

    this.dialog.on("init", ()=>
    {
    })

    this.dialog.init();

  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(!this.dialog) return;
    if(changes.actions) this.dialog.setActions(changes.actions.currentValue);
  }  
}
