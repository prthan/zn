import { Directive, ElementRef, HostListener, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';

declare global
{
  var zn :zn;
  var $ :any;
  var fuse :any;
  var numeral :any;
  var moment :any;
}

@Directive({
  selector: '[zn-button]'
})
export class znButtonDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() text :string;
  @Input() icon :string;
  @Input() action :string;
  @Input() type :string;

  @Output() onAction :EventEmitter<any> = new EventEmitter<znButtonEvent>();
  
  private button :znButton;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znButtonOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      icon: this.icon, 
      text: this.text,
      action: this.action,
      type: this.type
    };

    this.button=zn.ui.components.button.create(options);

    if(this.onAction.observers.length>0) this.button.on("action",(evt: znButtonEvent)=>this.onAction.emit(evt));

    this.button.init();

  }

  ngOnChanges(changes :SimpleChanges)
  {
  }  
}
