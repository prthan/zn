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
}

declare interface znTextAreaOptions
{
  name :string;
  target :any;
  label? :string;
  value? :string;
  placeholder? :string;
  readonly? :boolean;
}

declare interface znTextAreaEvent
{
  source :znTextArea;
}
