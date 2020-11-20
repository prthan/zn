declare class znCalendarFactory
{
  create(options :znCalendarOptions) :znCalendar;
  get(name :string) :znCalendar;
}

declare class znCalendar
{
  constructor();
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znCalendarEvent)=>void) :void;  
  setValue(value :Date) :void;
  getValue() :Date;
}

declare interface znCalendarOptions
{
  name :string;
  target :any;
  date? :Date;
}

declare interface znCalendarEvent
{
  source :znCalendar;
}
