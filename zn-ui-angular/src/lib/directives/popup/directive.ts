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
  selector: '[zn-popup]'
})
export class znPopupDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() source :string;
  @Input() showAt :string;
  @Input() snap :boolean;

  private popup :znPopup;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znPopupOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      snap: this.snap,
      source: this.source,
      showAt: this.showAt
    };

    this.popup=new (zn.findClass('zn.ui.components.Popup'))(options);
    
    this.popup.init();
  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(!this.popup) return;
  }  
}
