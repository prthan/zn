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
  selector: '[zn-radiogroup]'
})
export class znRadioGroupDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() label :string;
  @Input() layout :string;
  @Input() items :Array<znDropdownItem>;
  @Input() error :string;
  @Input() message :string;

  @Output() onSelect :EventEmitter<any> = new EventEmitter<any>();

  @Input() value :string;
  @Output() valueChange :EventEmitter<string> = new EventEmitter<string>();
  
  private radiogroup :znRadioGroup;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znRadioGroupOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      value: this.value, 
      label: this.label, 
      items: this.items, 
      layout: this.layout,
      error: this.error,
      message: this.message      
    };

    this.radiogroup=zn.ui.components.radiogroup.create(options);

    if(this.onSelect.observers.length>0) this.radiogroup.on("change", (evt: znRadioGroupEvent)=>this.onSelect.emit(evt));
    this.radiogroup.on("change", (evt :any)=>
    {
      this.value=evt.newValue;
      this.valueChange.emit(evt.newValue);
    })

    this.radiogroup.init();

  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(!this.radiogroup) return;
    if(changes.value) this.radiogroup.setValue(changes.value.currentValue);
    if(changes.error) this.radiogroup.message(changes.error.currentValue, "error");
    if(changes.message) this.radiogroup.message(changes.message.currentValue, "message");
  }  
}
