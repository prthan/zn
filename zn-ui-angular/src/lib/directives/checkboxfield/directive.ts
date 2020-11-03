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
  selector: '[zn-checkboxfield]'
})
export class znCheckboxFieldDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() text :string;
  @Input() password :boolean;
  @Input() icon :string;
  @Input() onValue :string;
  @Input() offValue :string;
  @Input() error :string;
  @Input() message :string;

  @Input() value :string|boolean;
  @Output() valueChange :EventEmitter<string|boolean> = new EventEmitter<string|boolean>();
  
  private checkboxfield :znCheckboxField;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znCheckboxFieldOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      value: this.value, 
      text: this.text,
      error: this.error,
      message: this.message      
    };
    if(this.onValue || this.offValue) options.values={on: this.onValue, off: this.offValue};

    this.checkboxfield=zn.ui.checkboxfield.create(options);

    this.checkboxfield.on("change", (evt :any)=>
    {
      this.value=evt.newValue;
      this.valueChange.emit(evt.newValue);
    })

    this.checkboxfield.init();

  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(!this.checkboxfield) return;

    if(changes.value) this.checkboxfield.setValue(changes.value.currentValue);
    if(changes.error) this.checkboxfield.message(changes.error.currentValue, "error");
    if(changes.message) this.checkboxfield.message(changes.message.currentValue, "message");    
  }  
}
