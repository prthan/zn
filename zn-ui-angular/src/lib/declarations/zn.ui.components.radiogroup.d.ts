declare class znRadioGroup
{
  constructor(pptions: znRadioGroupOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znRadioGroupEvent)=>void) :void;  
  setValue(value :string|boolean) :void;
  getValue() :string|boolean;  
  message(text :string, type :string) :void;
  get(name :string) :znRadioGroup;
}

declare interface znRadioGroupOptions
{
  name :string;
  target :any;
  label? :string;
  value? :string;
  layout? :string;
  items? :Array<znRadioGroupItem>;
  error :string;
  message :string;
}

declare interface znRadioGroupItem
{
  label :string;
  value :string;
}

declare interface znRadioGroupEvent
{
  source :znRadioGroup;
}
