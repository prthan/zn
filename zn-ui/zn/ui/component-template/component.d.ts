declare class znComponentFactory
{
  create(options :znComponentOptions) :znComponent;
  get(name :string) :znComponent;
}

declare class znComponent
{
  constructor(options :znComponentOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znComponentEvent)=>void) :void;
}

declare interface znComponentOptions
{

}

declare interface znComponentEvent
{
  source :znComponent;
}
