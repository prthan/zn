import { Component, OnInit } from '@angular/core';

declare global
{
  var zn :zn;
}

@Component({
  selector: 'app-view-surface',
  templateUrl: './view-surface.component.html',
  styleUrls: ['./view-surface.component.css']
})
export class ViewSurfaceComponent implements OnInit {

  shapeAction :string;
  shapeCount :number=0;
  surface :znSurface= null;

  data :string="{\"shapes\":[{\"type\":\"list\",\"rect\":{\"x\":505,\"y\":205,\"width\":150,\"height\":325},\"ctx\":{\"name\":\"shape-0\",\"text\":\"PERSON\",\"list\":[{\"text\":\"ID\",\"$level\":0},{\"text\":\"Name\",\"$level\":0},{\"text\":\"Address\",\"$level\":0},{\"text\":\"Street\",\"$level\":1},{\"text\":\"City\",\"$level\":1},{\"text\":\"State\",\"$level\":1},{\"text\":\"ZipCode\",\"$level\":1},{\"text\":\"Contact Details\",\"$level\":0},{\"text\":\"Home Phone\",\"$level\":1},{\"text\":\"Office\",\"$level\":1},{\"text\":\"Mobile Phone\",\"$level\":1},{\"text\":\"EMail ID\",\"$level\":1}]},\"oid\":\"2k9ic6vt6o37x4ix6qt\"},{\"type\":\"list\",\"rect\":{\"x\":790,\"y\":190,\"width\":150,\"height\":125},\"ctx\":{\"name\":\"shape-1\",\"text\":\"ADDRESS\",\"list\":[{\"text\":\"Street\",\"$level\":0},{\"text\":\"City\",\"$level\":0},{\"text\":\"State\",\"$level\":0},{\"text\":\"ZipCode\",\"$level\":0}]},\"oid\":\"mk8ib6qt83ixpomy3qq\"},{\"type\":\"list\",\"rect\":{\"x\":795,\"y\":440,\"width\":150,\"height\":125},\"ctx\":{\"name\":\"shape-2\",\"text\":\"CONTACT\",\"list\":[{\"text\":\"Home Phone\",\"$level\":0},{\"text\":\"Office\",\"$level\":0},{\"text\":\"Mobile Phone\",\"$level\":0},{\"text\":\"EMail ID\",\"$level\":0}]},\"oid\":\"tkxiz67trgrq6hsy51w\"},{\"type\":\"ellipse\",\"rect\":{\"x\":65,\"y\":165,\"width\":70,\"height\":70},\"ctx\":{\"name\":\"shape-3\",\"text\":\"Receive\"},\"oid\":\"fkuih6rtnz0x8foylbo\"},{\"type\":\"ellipse\",\"rect\":{\"x\":65,\"y\":565,\"width\":70,\"height\":70},\"ctx\":{\"name\":\"shape-4\",\"text\":\"Return\"},\"oid\":\"ckaib60tmyok7dyovc\"},{\"type\":\"rectangle\",\"rect\":{\"x\":250,\"y\":175,\"width\":100,\"height\":50},\"ctx\":{\"name\":\"shape-5\",\"text\":\"Invoke\"},\"oid\":\"bktii62t9zfl5oayrnm\"},{\"type\":\"diamond\",\"rect\":{\"x\":255,\"y\":355,\"width\":90,\"height\":90},\"ctx\":{\"name\":\"shape-6\",\"text\":\"Check\"},\"oid\":\"7knit6ctl9rbr9dz0y9\"},{\"type\":\"pill\",\"rect\":{\"x\":250,\"y\":580,\"width\":100,\"height\":40},\"ctx\":{\"name\":\"shape-7\",\"text\":\"Assign\"},\"oid\":\"ukzif6ltrhrzslizh90\"}],\"lines\":[{\"name\":\"/2k9ic6vt6o37x4ix6qt/item$2/right-/mk8ib6qt83ixpomy3qq/item$/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"item$2\",\"index\":2,\"list\":\"2k9ic6vt6o37x4ix6qt\",\"type\":\"list-item\",\"text\":\"Address\",\"$level\":0,\"oid\":\"ok4ii6ktriechex6r0\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$\",\"list\":\"mk8ib6qt83ixpomy3qq\",\"type\":\"list-header\",\"text\":\"ADDRESS\",\"oid\":\"rkwid63t2gejsgry3qq\"},\"direction\":\"left\"},\"oid\":\"bkdic6vtdslqefbyewm\"},{\"name\":\"/2k9ic6vt6o37x4ix6qt/item$7/right-/tkxiz67trgrq6hsy51w/item$/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"item$7\",\"index\":7,\"list\":\"2k9ic6vt6o37x4ix6qt\",\"type\":\"list-item\",\"text\":\"Contact Details\",\"$level\":0,\"oid\":\"ak6ib6wtd49galrx6r3\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$\",\"list\":\"tkxiz67trgrq6hsy51w\",\"type\":\"list-header\",\"text\":\"CONTACT\",\"oid\":\"zkiig68t9fyu3toy51w\"},\"direction\":\"left\"},\"oid\":\"rknie6vt3d5urzyhal\"},{\"name\":\"/shape-3/right-/shape-5/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-3\",\"text\":\"Receive\",\"oid\":\"fkuih6rtnz0x8foylbo\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"shape-5\",\"text\":\"Invoke\",\"oid\":\"bktii62t9zfl5oayrnm\"},\"direction\":\"left\"},\"oid\":\"uktis64tf2jcs5byyeb\"},{\"name\":\"/shape-5/bottom-/shape-6/top\",\"from\":{\"name\":\"bottom\",\"text\":\"Bottom\",\"parent\":{\"name\":\"shape-5\",\"text\":\"Invoke\",\"oid\":\"bktii62t9zfl5oayrnm\"},\"direction\":\"bottom\"},\"to\":{\"name\":\"top\",\"text\":\"Top\",\"parent\":{\"name\":\"shape-6\",\"text\":\"Check\",\"oid\":\"7knit6ctl9rbr9dz0y9\"},\"direction\":\"top\"},\"oid\":\"hkui062thl1325uzcdh\"},{\"name\":\"/shape-6/right-/2k9ic6vt6o37x4ix6qt/item$/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-6\",\"text\":\"Check\",\"oid\":\"7knit6ctl9rbr9dz0y9\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$\",\"list\":\"2k9ic6vt6o37x4ix6qt\",\"type\":\"list-header\",\"text\":\"PERSON\",\"oid\":\"ukbid6htccfv52x6qu\"},\"direction\":\"left\"},\"oid\":\"lkrip6jt17ljzxnzehu\"},{\"name\":\"/shape-6/bottom-/shape-7/top\",\"from\":{\"name\":\"bottom\",\"text\":\"Bottom\",\"parent\":{\"name\":\"shape-6\",\"text\":\"Check\",\"oid\":\"7knit6ctl9rbr9dz0y9\"},\"direction\":\"bottom\"},\"to\":{\"name\":\"top\",\"text\":\"Top\",\"parent\":{\"name\":\"shape-7\",\"text\":\"Assign\",\"oid\":\"ukzif6ltrhrzslizh90\"},\"direction\":\"top\"},\"oid\":\"8k4io6htoseyrxwzlmq\"},{\"name\":\"/shape-7/left-/shape-4/right\",\"from\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"shape-7\",\"text\":\"Assign\",\"oid\":\"ukzif6ltrhrzslizh90\"},\"direction\":\"left\"},\"to\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-4\",\"text\":\"Return\",\"oid\":\"ckaib60tmyok7dyovc\"},\"direction\":\"right\"},\"oid\":\"2kgir6jtmdppo6xzn8p\"}]}";
  constructor() { }

  ngOnInit(): void {
  }

  addShape($event :znButtonEvent)
  {
    console.log('add-shape', $event)
    this.shapeAction=$event.action;
    this.surface.setMode("position");
  }

  onPosition($event :znSurfaceEvent)
  {
    console.log('position', $event);
    this[this.shapeAction]($event);
  }
  
  onObjSelect($event :znSurfaceEvent)
  {
    console.log('obj-select', $event);
  }

  onRelSelect($event :znSurfaceEvent)
  {
    console.log('rel-select',$event);
  }

  onRelCreate($event :znSurfaceEvent)
  {
    console.log('rel-create',$event);
  }

  onSelectionChange($event :znSurfaceEvent)
  {
    console.log('selection-change',$event);
  }

  onDelete($event :znSurfaceEvent)
  {
    console.log('delete',$event);
  }

  exportToJson($event :znSurfaceEvent)
  {
    console.log(this.surface.exportToJson());
  }

  importFromJson($event :znSurfaceEvent)
  {
    this.surface.importFromJson(this.data);
  }

  downloadAsImage()
  {
    this.surface.downloadAsImage();
  }

  ['add-invoke'](evt :znSurfaceEvent)
  {
    let ctx={name: "shape-"+(this.shapeCount++), text: "Invoke"};
    this.surface.addShape("rectangle", {x: evt.x - 50, y: evt.y - 25, width: 100, height: 50}, ctx);
    //let ctx={name: "shape-"+(this.shapeCount++),};
    //this.surface.addShape("rectangle", {x: evt.x - 50, y: evt.y - 25, width: 40, height: 20}, ctx);
  }

  ["add-receive"](evt :znSurfaceEvent)
  {
    let ctx={name: "shape-"+(this.shapeCount++), text: "Receive"};
    this.surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 70, height: 70}, ctx);
    //let ctx={name: "shape-"+(this.shapeCount++)};
    //this.surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 30, height: 30}, ctx);

  }

  ["add-return"](evt :znSurfaceEvent)
  {
    let ctx={name: "shape-"+(this.shapeCount++), text: "Return"};
    this.surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 70, height: 70}, ctx);
  }

  ["add-assign"](evt :znSurfaceEvent)
  {
    let ctx={name: "shape-"+(this.shapeCount++), text: "Assign"};
    this.surface.addShape("pill", {x: evt.x - 50, y: evt.y - 20, width: 100, height: 40}, ctx);
    //let ctx={name: "shape-"+(this.shapeCount++)};
    //this.surface.addShape("pill", {x: evt.x - 50, y: evt.y - 20, width: 40, height: 20}, ctx);
  }

  ["add-check"](evt :znSurfaceEvent)
  {
    //let ctx={name: "shape-"+(this.shapeCount++), text: "Check"};
    //this.surface.addShape("diamond", {x: evt.x - 45, y: evt.y - 45, width: 90, height: 90}, ctx);
    let ctx={name: "shape-"+(this.shapeCount++)};
    this.surface.addShape("diamond", {x: evt.x - 45, y: evt.y - 45, width: 30, height: 30}, ctx);

  }

  ["add-var-person"](evt :znSurfaceEvent)
  {
    let list=
    [
      {text: "ID"}, {text: "Name"},
      {text: "Address", $list: [{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}]},
      {text: "Contact Details", $list: [{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}]}
    ];
    let ctx={name: "shape-"+(this.shapeCount++), text: "PERSON", list: zn.designer.Utils.flattenList(list)};
    this.surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  ["add-var-address"](evt :znSurfaceEvent)
  {
    let list=[{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}];
    let ctx={name: "shape-"+(this.shapeCount++), text: "ADDRESS", list: zn.designer.Utils.flattenList(list)};
    this.surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  ["add-var-contact"](evt :znSurfaceEvent)
  {
    let list=[{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}];
    let ctx={name: "shape-"+(this.shapeCount++), text: "CONTACT", list: zn.designer.Utils.flattenList(list)};
    this.surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

}
