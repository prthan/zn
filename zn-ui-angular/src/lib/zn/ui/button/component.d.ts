declare class znButtonFactory
{
  create(options :znButtonOptions) :znButton;
  get(name :string) :znButton;
}

declare class znButton
{
  constructor();
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znButtonEvent)=>void) :void;  
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
}