declare class znTextFieldFactory
{
  create(options :znTextFieldOptions) :znTextField;
  get(name :string) :znTextField;
}

declare class znTextField
{
  constructor(options :znTextFieldOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znTextFieldEvent)=>void) :void;
  setValue(value :string|number) :void;
  getValue() :string|number;
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
}

declare interface znTextFieldEvent
{
  source :znTextField;
}
