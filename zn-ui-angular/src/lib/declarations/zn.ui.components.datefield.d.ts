declare class znDateField
{
  constructor(options: znDateFieldOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znDateFieldEvent)=>void) :void;  
  setValue(value :Date) :void;
  getValue() :Date;  
  message(text :string, type :string) :void;
  get(name :string) :znDateField;
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
  error :string;
  message :string;
}

declare interface znDateFieldEvent
{
  source :znDateFieldEvent;
}
