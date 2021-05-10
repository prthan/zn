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
  selector: '[zn-draggable]'
})
export class znDraggableDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() target :string;

  private draggable :znDraggable;

  constructor(private hostElementRef: ElementRef) 
  { 
    console.log(1);
  }

  ngOnInit()
  {
    let options :znDraggableOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      updateTarget: this.target
    };

    this.draggable=new (zn.findClass('zn.ui.components.Draggable'))(options);
    this.draggable.init();
  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(!this.draggable) return;
  }  
}
