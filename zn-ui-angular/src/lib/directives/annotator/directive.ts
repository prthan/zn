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
  selector: '[zn-annotator]'
})
export class znAnnotatorDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() phrase :string;
  @Input() annotations :Array<znAnnotation>;

  private annotator :znAnnotator;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znAnnotatorOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      phrase: this.phrase,
      annotations: this.annotations
    };

    this.annotator=new (zn.findClass('zn.ui.components.Annotator'))(options);
    this.annotator.init();
  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(!this.annotator) return;
  }  
}
