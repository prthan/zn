declare class znDateFieldFactory
{
  create(options :znDateFieldOptions) :znDateField;
  get(name :string) :znDateField;
}

declare class znDateField
{
  constructor();
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znDateFieldEvent)=>void) :void;  
  setValue(value :Date) :void;
  getValue() :Date;  
}

declare interface znDateFieldOptions
{
  name :string;
  target :any;
  label? :string;
  value? :Date;
  format? :string;
  icon? :string;
  placeholder? :string;
  readonly? :boolean;
}

declare interface znDateFieldEvent
{
  source :znDateFieldEvent;
}
