declare class znDropdownFieldFactory
{
  create(options :znDropdownFieldOptions) :znDropdownField;
  get(name :string) :znDropdownField;
}

declare class znDropdownField
{
  constructor(options :znDropdownFieldOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znDropdownFieldEvent)=>void) :void;  
  setValue(value :string|boolean) :void;
  getValue() :string|boolean;  
  message(text :string, type :string) :void;
}

declare interface znDropdownFieldOptions
{
  name :string;
  target :any;
  label? :string;
  value? :string;
  items? :Array<znDropdownItem>;
  error :string;
  message :string;
}

declare interface znDropdownItem
{
  label :string;
  value :string;
}

declare interface znDropdownFieldEvent
{
  source :znDropdownField;
}