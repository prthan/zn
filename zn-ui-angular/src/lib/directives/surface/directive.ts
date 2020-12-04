import { Directive, ElementRef, HostListener, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges} from '@angular/core';

declare global
{
  var zn :zn;
  var $ :any;
  var fuse :any;
  var numeral :any;
  var moment :any;
}

@Directive({
  selector: '[zn-surface]'
})
export class znSurfaceDirective implements OnInit, OnChanges
{
  @Input() name :string;
  @Input() width :number;
  @Input() height :number;

  @Output() onPosition :EventEmitter<any> = new EventEmitter<any>();
  @Output() onObjSelect :EventEmitter<any> = new EventEmitter<any>();
  @Output() onRelSelect :EventEmitter<any> = new EventEmitter<any>();
  @Output() onRelCreate :EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectionChange :EventEmitter<any> = new EventEmitter<any>();
  @Output() onDelete :EventEmitter<any> = new EventEmitter<any>();
  @Output() onDrawObj :EventEmitter<any> = new EventEmitter<any>();
  @Output() onStageSelect :EventEmitter<any> = new EventEmitter<any>();
  @Output() onObjRectUpdate :EventEmitter<any> = new EventEmitter<any>();

  @Output() binding :EventEmitter<any> = new EventEmitter<any>();

  private surface :znSurface;

  constructor(private hostElementRef: ElementRef) 
  { 
 
  }
 
  ngOnInit()
  {
    let options :znSurfaceOptions={target: this.hostElementRef.nativeElement, name: this.name, width: this.width, height: this.height};

    this.surface=new (zn.findClass('zn.designer.Surface'))(options);
    
    if(this.onPosition.observers.length>0) this.surface.on("position", (evt: znSurfaceEvent)=>this.onPosition.emit(evt));
    if(this.onObjSelect.observers.length>0) this.surface.on("obj-select", (evt: znSurfaceEvent)=>this.onObjSelect.emit(evt));
    if(this.onRelSelect.observers.length>0) this.surface.on("rel-select", (evt: znSurfaceEvent)=>this.onRelSelect.emit(evt));
    if(this.onRelCreate.observers.length>0) this.surface.on("rel-create", (evt: znSurfaceEvent)=>this.onRelCreate.emit(evt));
    if(this.onSelectionChange.observers.length>0) this.surface.on("selection-set-change", (evt: znSurfaceEvent)=>this.onSelectionChange.emit(evt));
    if(this.onDelete.observers.length>0) this.surface.on("delete", (evt: znSurfaceEvent)=>this.onDelete.emit(evt));
    if(this.onDrawObj.observers.length>0) this.surface.on("draw-object", (evt: znSurfaceEvent)=>this.onDrawObj.emit(evt));
    if(this.onStageSelect.observers.length>0) this.surface.on("stage-select", (evt: znSurfaceEvent)=>this.onStageSelect.emit(evt));
    if(this.onObjRectUpdate.observers.length>0) this.surface.on("obj-rect-update", (evt: znSurfaceEvent)=>this.onObjRectUpdate.emit(evt));
    

    this.surface.on("init", ()=>
    {
      if(this.binding.observers.length>0) this.binding.emit(this.surface);
    })
    this.surface.init();
  }

  ngOnChanges(changes :SimpleChanges)
  {
  }
}
