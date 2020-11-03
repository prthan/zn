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
  selector: '[zn-table]'
})
export class znTableDirective implements OnInit, OnChanges
{
  @Input() columns :Array<any>;
  @Input() rows :Array<any>;
  @Input() rowActions :Array<any>;
  @Input() actions :Array<any>;
  @Input() headerHeight :number;
  @Input() rowHeight :number;
  @Input() name :string;
  @Input() multiSelect :string;
  @Input() fill :string;
  @Input() pageSize :number;

  @Output() onRowSelect :EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowAction :EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowSelectionChange :EventEmitter<any> = new EventEmitter<any>();
  @Output() onAction :EventEmitter<any> = new EventEmitter<any>();

  private table :znTable;

  constructor(private hostElementRef: ElementRef) 
  { 
 
  }
 
  ngOnInit()
  {
    let options :znTableOptions={target: this.hostElementRef.nativeElement, columns: this.columns, name: this.name, rows: this.rows};
    if(this.rowActions) options.rowActions=this.rowActions;
    if(this.actions) options.actions=this.actions;
    if(this.headerHeight) options.headerHeight=this.headerHeight;
    if(this.rowHeight) options.rowHeight=this.rowHeight;
    if(this.multiSelect==="Y") options.multiSelect=true;
    if(this.fill) options.fill=this.fill;
    if(this.pageSize)
    {
      options.pageSize=this.pageSize;
      options.paging=true;
    }


    this.table=zn.ui.components.table.create(options);
    
    if(this.onRowSelect.observers.length>0) this.table.on("row-select", (tableEvent: znTableEvent)=>this.onRowSelect.emit(tableEvent));
    if(this.onRowAction.observers.length>0) this.table.on("row-action", (tableEvent: znTableEvent)=>this.onRowAction.emit(tableEvent));
    if(this.onRowSelectionChange.observers.length>0) this.table.on("row-selection-change", (tableEvent: znTableEvent)=>this.onRowSelectionChange.emit(tableEvent));
    if(this.onAction.observers.length>0) this.table.on("action", (tableEvent: znTableEvent)=>this.onAction.emit(tableEvent));

    this.table.init();
  }

  ngOnChanges(changes :SimpleChanges)
  {
  }
}
