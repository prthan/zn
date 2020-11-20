declare class znTextAreaFactory
{
  create(options :znTextAreaOptions) :znTextArea;
  get(name :string) :znTextArea;
}

declare class znTextArea
{
  constructor(options :znTextAreaOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znTextAreaEvent)=>void) :void;  
  setValue(value :string) :void;
  getValue() :string;
  message(text :string, type :string) :void;
}

declare interface znTextAreaOptions
{
  name :string;
  target :any;
  label? :string;
  value? :string;
  placeholder? :string;
  readonly? :boolean;
  error :string;
  message :string;
}

declare interface znTextAreaEvent
{
  source :znTextArea;
}
