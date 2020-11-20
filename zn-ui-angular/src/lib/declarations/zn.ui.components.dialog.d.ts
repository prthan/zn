declare class znDialog
{
  constructor(options :znDialogOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znDialogEvent)=>void) :void;
  show() :void;
  hide() :void;
  setActions(actions :Array<any>) :void;
  get(name :string) :znDialog;
}

declare interface znDialogOptions
{
  target :any;
  name :string;
  wrap? :string;
  title :string;
  actions? :Array<any>;

}

declare interface znDialogEvent
{
  source :znDialog;
}
