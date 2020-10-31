declare class znRadioGroupFactory
{
  create(options :znRadioGroupOptions) :znRadioGroup;
  get(name :string) :znRadioGroup;
}

declare class znRadioGroup
{
  constructor();
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znRadioGroupEvent)=>void) :void;  
  setValue(value :string|boolean) :void;
  getValue() :string|boolean;  
}

declare interface znRadioGroupOptions
{
  name :string;
  target :any;
  label? :string;
  value? :string;
  layout? :string;
  items? :Array<znRadioGroupItem>;
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
