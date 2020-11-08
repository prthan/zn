declare class znPopupFactory
{
  create(options :znPopupOptions) :znPopup;
  get(name :string) :znPopup;
  hide() :void;
}

declare class znPopup
{
  constructor(options :znPopupOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znPopupEvent)=>void) :void;
  show() :void;
  hide() :void;
}

declare interface znPopupOptions
{
  name :string;
  target :any;
  source :string;
  snap :boolean;
  showAt :string;
}

declare interface znPopupEvent
{
  source :znPopup;
}
