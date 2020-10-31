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
  selector: '[zn-dropdownfield]'
})
export class znDropdownFieldDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() label :string;
  @Input() items :Array<znDropdownItem>;

  @Output() onSelect :EventEmitter<any> = new EventEmitter<any>();

  @Input() value :string;
  @Output() valueChange :EventEmitter<string> = new EventEmitter<string>();
  
  private dropdownfield :znDropdownField;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znDropdownFieldOptions={target: this.hostElementRef.nativeElement, name: this.name, value: this.value, label: this.label, items: this.items};

    this.dropdownfield=zn.ui.dropdownfield.create(options);

    if(this.onSelect.observers.length>0) this.dropdownfield.on("change", (evt: znDropdownFieldEvent)=>this.onSelect.emit(evt));
    this.dropdownfield.on("change", (evt :any)=>
    {
      this.value=evt.newValue;
      this.valueChange.emit(evt.newValue);
    })

    this.dropdownfield.init();

  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(this.dropdownfield) this.dropdownfield.setValue(changes.value.currentValue);
  }  
}
