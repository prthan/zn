declare class znCalendar
{
  constructor(optons :znCalendarOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znCalendarEvent)=>void) :void;  
  setValue(value :Date) :void;
  getValue() :Date;
  get(name :string) :znCalendar;
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
