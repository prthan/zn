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
  selector: '[zn-calendar]'
})
export class znCalendarDirective implements OnInit, OnChanges
{
  @Input() name :string;

  @Output() onDateSelect :EventEmitter<any> = new EventEmitter<any>();

  @Input() date :Date;
  @Output() dateChange :EventEmitter<Date> = new EventEmitter<Date>();
  
  private calendar :znCalendar;

  constructor(private hostElementRef: ElementRef) 
  { 
    
  }

  ngOnInit()
  {
    let options :znCalendarOptions={target: this.hostElementRef.nativeElement, name: this.name, date: this.date || new Date()};

    this.calendar=new (zn.findClass('zn.ui.components.Calendar'))(options);
    
    if(this.onDateSelect.observers.length>0) this.calendar.on("date-select",(evt: znCalendarEvent)=>this.onDateSelect.emit(evt));
    this.calendar.on("date-select", (evt :any)=>
    {
      this.date=evt.newValue;
      this.dateChange.emit(evt.newValue);
    })
    this.calendar.init();
  }

  ngOnChanges(changes :SimpleChanges)
  {
    if(this.calendar) this.calendar.setValue(changes.date.currentValue);
  }  
}
