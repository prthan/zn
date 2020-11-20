declare class znCheckboxFieldFactory
{
  create(options :znCheckboxFieldOptions) :znCheckboxField;
  get(name :string) :znCheckboxField;
}

declare class znCheckboxField
{
  constructor(options :znCheckboxFieldOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znCheckboxFieldEvent)=>void) :void;  
  setValue(value :string|boolean) :void;
  getValue() :string|boolean;
  message(text :string, type :string) :void;
}

declare interface znCheckboxFieldOptions
{
  name :string;
  target :any;
  label? :string;
  value? :string|boolean;
  text? :string;
  values? :znCheckboxValues;
  error :string;
  message :string;
}

declare interface znCheckboxValues
{
  on :string;
  off :string;
}

declare interface znCheckboxFieldEvent
{
  source :znCheckboxField;
}
