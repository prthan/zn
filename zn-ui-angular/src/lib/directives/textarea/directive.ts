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
  selector: '[zn-textarea]'
})
export class znTextAreaDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() label :string;
  @Input() placeholder :string;
  @Input() readonly :boolean;

  @Input() value :string;
  @Output() valueChange :EventEmitter<string> = new EventEmitter<string>();
  
  private textarea :znTextArea;

  constructor(private hostElementRef: ElementRef) { }

  ngOnInit()
  {
    let options :znTextAreaOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      value: this.value, 
      label: this.label, 
      placeholder: this.placeholder,
      readonly: this.readonly
    };

    this.textarea=zn.ui.textarea.create(options);

    this.textarea.on("change", (evt :any)=>
    {
      this.value=evt.newValue;
      this.valueChange.emit(evt.newValue);
    })

    this.textarea.init();

  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(this.textarea) this.textarea.setValue(changes.value.currentValue);
  }  
}
