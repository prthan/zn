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
  selector: '[zn-textfield]'
})
export class znTextFieldDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() label :string;
  @Input() password :boolean;
  @Input() icon :string;
  @Input() placeholder :string;
  @Input() readonly :boolean;
  @Input() error :string;
  @Input() message :string;

  @Output() onAction :EventEmitter<any> = new EventEmitter<any>();

  @Input() value :string;
  @Output() valueChange :EventEmitter<string> = new EventEmitter<string>();
  
  private textfield :znTextField;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znTextFieldOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      value: this.value, 
      label: this.label, 
      password: this.password, 
      icon: this.icon,
      placeholder: this.placeholder,
      readonly: this.readonly,
      error: this.error,
      message: this.message
    };

    this.textfield=new (zn.findClass('zn.ui.components.TextField'))(options);

    if(this.onAction.observers.length>0) this.textfield.on("action", (evt: znTextFieldEvent)=>this.onAction.emit(evt));
    this.textfield.on("change", (evt :any)=>
    {
      this.value=evt.newValue;
      this.valueChange.emit(evt.newValue);
    })

    this.textfield.init();

  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(!this.textfield) return;
    if(changes.value) this.textfield.setValue(changes.value.currentValue);
    if(changes.error) this.textfield.message(changes.error.currentValue, "error");
    if(changes.message) this.textfield.message(changes.message.currentValue, "message");

  }  
}
