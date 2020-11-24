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

  data :string="{\"shapes\":[{\"type\":\"ellipse\",\"rect\":{\"x\":65,\"y\":165,\"width\":70,\"height\":70},\"ctx\":{\"name\":\"shape-0\",\"text\":\"Receive\"},\"oid\":\"nkzhwunsnygcpsddjk3\"},{\"type\":\"ellipse\",\"rect\":{\"x\":65,\"y\":565,\"width\":70,\"height\":70},\"ctx\":{\"name\":\"shape-1\",\"text\":\"Return\"},\"oid\":\"ekghbu1soagh6ugdok1\"},{\"type\":\"rectangle\",\"rect\":{\"x\":250,\"y\":175,\"width\":100,\"height\":50},\"ctx\":{\"name\":\"shape-2\",\"text\":\"Invoke\"},\"oid\":\"7kmhpuxs165unvjdvel\"},{\"type\":\"diamond\",\"rect\":{\"x\":255,\"y\":310,\"width\":90,\"height\":90},\"ctx\":{\"name\":\"shape-3\",\"text\":\"Check\"},\"oid\":\"6kyhqu8s85ud8bae043\"},{\"type\":\"list\",\"rect\":{\"x\":500,\"y\":300,\"width\":150,\"height\":325},\"ctx\":{\"name\":\"shape-4\",\"text\":\"PERSON\",\"list\":[{\"text\":\"ID\"},{\"text\":\"Name\"},{\"text\":\"Address\",\"$list\":[{\"text\":\"Street\"},{\"text\":\"City\"},{\"text\":\"State\"},{\"text\":\"ZipCode\"}]},{\"text\":\"Contact Details\",\"$list\":[{\"text\":\"Home Phone\"},{\"text\":\"Office\"},{\"text\":\"Mobile Phone\"},{\"text\":\"EMail ID\"}]}]},\"oid\":\"xkzh6udscc6dudee4ub\"},{\"type\":\"list\",\"rect\":{\"x\":800,\"y\":200,\"width\":150,\"height\":125},\"ctx\":{\"name\":\"shape-5\",\"text\":\"ADDRESS\",\"list\":[{\"text\":\"Street\"},{\"text\":\"City\"},{\"text\":\"State\"},{\"text\":\"ZipCode\"}]},\"oid\":\"vkphyups2rwi9iie6kq\"},{\"type\":\"list\",\"rect\":{\"x\":795,\"y\":550,\"width\":150,\"height\":125},\"ctx\":{\"name\":\"shape-6\",\"text\":\"CONTACT\",\"list\":[{\"text\":\"Home Phone\"},{\"text\":\"Office\"},{\"text\":\"Mobile Phone\"},{\"text\":\"EMail ID\"}]},\"oid\":\"zkdh8u9sm4u0hbde9oh\"},{\"type\":\"pill\",\"rect\":{\"x\":250,\"y\":480,\"width\":100,\"height\":40},\"ctx\":{\"name\":\"shape-7\",\"text\":\"Assign\"},\"oid\":\"lk8heuqsxobv3nkesk7\"}],\"lines\":[{\"name\":\"/shape-0/right-/shape-2/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-0\",\"text\":\"Receive\",\"oid\":\"nkzhwunsnygcpsddjk3\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"shape-2\",\"text\":\"Invoke\",\"oid\":\"7kmhpuxs165unvjdvel\"},\"direction\":\"left\"},\"oid\":\"fk8hyuas4k235ghdxl5\"},{\"name\":\"/shape-2/bottom-/shape-3/top\",\"from\":{\"name\":\"bottom\",\"text\":\"Bottom\",\"parent\":{\"name\":\"shape-2\",\"text\":\"Invoke\",\"oid\":\"7kmhpuxs165unvjdvel\"},\"direction\":\"bottom\"},\"to\":{\"name\":\"top\",\"text\":\"Top\",\"parent\":{\"name\":\"shape-3\",\"text\":\"Check\",\"oid\":\"6kyhqu8s85ud8bae043\"},\"direction\":\"top\"},\"oid\":\"kkfhoupstrpfjdde36g\"},{\"name\":\"/xkzh6udscc6dudee4ub/item$2/right-/vkphyups2rwi9iie6kq/item$/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"item$2\",\"index\":2,\"list\":\"xkzh6udscc6dudee4ub\",\"type\":\"list-item\",\"text\":\"Address\",\"$level\":0,\"oid\":\"ek4h2u2s1qo88zde4ug\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$\",\"list\":\"vkphyups2rwi9iie6kq\",\"type\":\"list-header\",\"text\":\"ADDRESS\",\"oid\":\"wk0h1uesviehjqhe6kq\"},\"direction\":\"left\"},\"oid\":\"rkghwudsae927ckehaf\"},{\"name\":\"/xkzh6udscc6dudee4ub/item$7/right-/zkdh8u9sm4u0hbde9oh/item$/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"item$7\",\"index\":7,\"list\":\"xkzh6udscc6dudee4ub\",\"type\":\"list-item\",\"text\":\"Contact Details\",\"$level\":0,\"oid\":\"lkthfuds6tpapke4uk\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$\",\"list\":\"zkdh8u9sm4u0hbde9oh\",\"type\":\"list-header\",\"text\":\"CONTACT\",\"oid\":\"vkfhhu9s0ae5raie9oi\"},\"direction\":\"left\"},\"oid\":\"pk9hjugsbvbz7rejty\"},{\"name\":\"/shape-3/right-/xkzh6udscc6dudee4ub/item$/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-3\",\"text\":\"Check\",\"oid\":\"6kyhqu8s85ud8bae043\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$\",\"list\":\"xkzh6udscc6dudee4ub\",\"type\":\"list-header\",\"text\":\"PERSON\",\"oid\":\"4khh6u5sibloo8oe4ud\"},\"direction\":\"left\"},\"oid\":\"ikrheulsrp0dp2renwj\"},{\"name\":\"/shape-3/bottom-/shape-7/top\",\"from\":{\"name\":\"bottom\",\"text\":\"Bottom\",\"parent\":{\"name\":\"shape-3\",\"text\":\"Check\",\"oid\":\"6kyhqu8s85ud8bae043\"},\"direction\":\"bottom\"},\"to\":{\"name\":\"top\",\"text\":\"Top\",\"parent\":{\"name\":\"shape-7\",\"text\":\"Assign\",\"oid\":\"lk8heuqsxobv3nkesk7\"},\"direction\":\"top\"},\"oid\":\"qksh9uhsukfgxxez92\"},{\"name\":\"/shape-7/bottom-/shape-1/right\",\"from\":{\"name\":\"bottom\",\"text\":\"Bottom\",\"parent\":{\"name\":\"shape-7\",\"text\":\"Assign\",\"oid\":\"lk8heuqsxobv3nkesk7\"},\"direction\":\"bottom\"},\"to\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-1\",\"text\":\"Return\",\"oid\":\"ekghbu1soagh6ugdok1\"},\"direction\":\"right\"},\"oid\":\"iklh5ucs0tjm9wf58v\"}]}";
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
    let ctx={name: "shape-"+(this.shapeCount++), text: "PERSON", list: list};
    this.surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  ["add-var-address"](evt :znSurfaceEvent)
  {
    let list=[{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}];
    let ctx={name: "shape-"+(this.shapeCount++), text: "ADDRESS", list: list};
    this.surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  ["add-var-contact"](evt :znSurfaceEvent)
  {
    let list=[{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}];
    let ctx={name: "shape-"+(this.shapeCount++), text: "CONTACT", list: list};
    this.surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

}
