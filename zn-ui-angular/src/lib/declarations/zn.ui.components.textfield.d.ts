declare class znTextField
{
  constructor(options :znTextFieldOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znTextFieldEvent)=>void) :void;
  setValue(value :string|number) :void;
  getValue() :string|number;
  message(text :string, type :string) :void;
  get(name :string) :znTextField;
}

declare interface znTextFieldOptions
{
  name :string;
  target :any;
  label? :string;
  value? :string|number;
  password? :boolean;
  icon? :string;
  placeholder? :string;
  readonly? :boolean;
  error :string;
  message :string;
}

declare interface znTextFieldEvent
{
  source :znTextField;
}
