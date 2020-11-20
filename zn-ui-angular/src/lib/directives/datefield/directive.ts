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
  selector: '[zn-datefield]'
})
export class znDateFieldDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() label :string;
  @Input() password :boolean;
  @Input() icon :string;
  @Input() format :string;
  @Input() placeholder :string;
  @Input() readonly :boolean;
  @Input() error :string;
  @Input() message :string;

  @Output() onDateSelect :EventEmitter<any> = new EventEmitter<any>();
  @Output() onAction :EventEmitter<any> = new EventEmitter<any>();

  @Input() value :Date;
  @Output() valueChange :EventEmitter<Date> = new EventEmitter<Date>();
  
  private datefield :znDateField;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znDateFieldOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      value: this.value, 
      label: this.label, 
      icon: this.icon, 
      format: this.format,
      placeholder: this.placeholder,
      readonly: this.readonly,
      error: this.error,
      message: this.message      
    };

    this.datefield=new (zn.findClass('zn.ui.components.DateField'))(options);

    if(this.onDateSelect.observers.length>0) this.datefield.on("date-select", (evt: znDateFieldEvent)=>this.onDateSelect.emit(evt));
    if(this.onAction.observers.length>0) this.datefield.on("action", (evt: znDateFieldEvent)=>this.onDateSelect.emit(evt));

    this.datefield.on("change", (evt :any)=>
    {
      this.value=evt.newValue;
      this.valueChange.emit(evt.newValue);
    })

    this.datefield.init();

  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(!this.datefield) return;
    
    if(changes.value) this.datefield.setValue(changes.value.currentValue);
    if(changes.error) this.datefield.message(changes.error.currentValue, "error");
    if(changes.message) this.datefield.message(changes.message.currentValue, "message");

  }  
}
