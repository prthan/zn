declare class znButton
{
  constructor(options :znButtonOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znButtonEvent)=>void) :void;
  get(name :string) :znButton;
}

declare interface znButtonOptions
{
  name :string;
  target :any;
  text? :string;
  icon? :string;
  action? :string;
  type? :string;
}

declare interface znButtonEvent
{
  source :znButton;
  action: string;
}