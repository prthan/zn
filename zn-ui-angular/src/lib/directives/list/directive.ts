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
  selector: '[zn-list]'
})
export class znListDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() items :Array<any>;
  @Input() itemActions :Array<any>;
  @Input() multiSelect :boolean;
  @Input() trackScroll :boolean;
  @Input() scrollContainer :string;

  @Output() onSelect :EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectionChange :EventEmitter<any> = new EventEmitter<any>();
  @Output() onItemAction :EventEmitter<any> = new EventEmitter<any>();
  @Output() onScrollEnd :EventEmitter<any> = new EventEmitter<any>();

  private list :znList;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znListOptions=
    {
      target: this.hostElementRef.nativeElement, 
      name: this.name, 
      items: this.items,
      itemActions: this.itemActions,
      multiSelect: this.multiSelect,
      trackScroll: this.trackScroll,
      scrollContainer: this.scrollContainer
    };

    this.list=zn.ui.components.list.create(options);

    if(this.onSelect.observers.length>0) this.list.on("select", (evt: znListEvent)=>this.onSelect.emit(evt));
    if(this.onSelectionChange.observers.length>0) this.list.on("selection-change", (evt: znListEvent)=>this.onSelectionChange.emit(evt));
    if(this.onItemAction.observers.length>0) this.list.on("item-action", (evt: znListEvent)=>this.onItemAction.emit(evt));
    console.log(this.onScrollEnd.observers.length);
    if(this.onScrollEnd.observers.length>0) this.list.on("scroll-end", (evt: znListEvent)=>this.onScrollEnd.emit(evt));

    this.list.init();

  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(!this.list) return;
    if(changes.items) this.list.setItems(changes.value.currentValue);
  }  
}
