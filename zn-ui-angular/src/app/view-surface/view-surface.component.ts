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

  data :string="{\"shapes\":[{\"type\":\"ellipse\",\"rect\":{\"x\":165,\"y\":65,\"width\":70,\"height\":70},\"ctx\":{\"name\":\"shape-0\",\"text\":\"Receive\"}},{\"type\":\"ellipse\",\"rect\":{\"x\":165,\"y\":465,\"width\":70,\"height\":70},\"ctx\":{\"name\":\"shape-1\",\"text\":\"Return\"}},{\"type\":\"list\",\"rect\":{\"x\":645,\"y\":240,\"width\":150,\"height\":325},\"ctx\":{\"name\":\"shape-2\",\"text\":\"PERSON\",\"list\":[{\"text\":\"ID\"},{\"text\":\"Name\"},{\"text\":\"Address\",\"$list\":[{\"text\":\"Street\"},{\"text\":\"City\"},{\"text\":\"State\"},{\"text\":\"ZipCode\"}]},{\"text\":\"Contact Details\",\"$list\":[{\"text\":\"Home Phone\"},{\"text\":\"Office\"},{\"text\":\"Mobile Phone\"},{\"text\":\"EMail ID\"}]}]}},{\"type\":\"list\",\"rect\":{\"x\":905,\"y\":205,\"width\":150,\"height\":125},\"ctx\":{\"name\":\"shape-3\",\"text\":\"ADDRESS\",\"list\":[{\"text\":\"Street\"},{\"text\":\"City\"},{\"text\":\"State\"},{\"text\":\"ZipCode\"}]}},{\"type\":\"list\",\"rect\":{\"x\":905,\"y\":465,\"width\":150,\"height\":125},\"ctx\":{\"name\":\"shape-4\",\"text\":\"CONTACT\",\"list\":[{\"text\":\"Home Phone\"},{\"text\":\"Office\"},{\"text\":\"Mobile Phone\"},{\"text\":\"EMail ID\"}]}},{\"type\":\"rectangle\",\"rect\":{\"x\":350,\"y\":75,\"width\":100,\"height\":50},\"ctx\":{\"name\":\"shape-5\",\"text\":\"Invoke\"}},{\"type\":\"pill\",\"rect\":{\"x\":350,\"y\":195,\"width\":100,\"height\":40},\"ctx\":{\"name\":\"shape-6\",\"text\":\"Assign\"}},{\"type\":\"diamond\",\"rect\":{\"x\":355,\"y\":305,\"width\":90,\"height\":90},\"ctx\":{\"name\":\"shape-7\",\"text\":\"Check\"}},{\"type\":\"rectangle\",\"rect\":{\"x\":350,\"y\":475,\"width\":100,\"height\":50},\"ctx\":{\"name\":\"shape-8\",\"text\":\"Invoke\"}},{\"type\":\"list\",\"rect\":{\"x\":570,\"y\":595,\"width\":150,\"height\":125},\"ctx\":{\"name\":\"shape-9\",\"text\":\"CONTACT\",\"list\":[{\"text\":\"Home Phone\"},{\"text\":\"Office\"},{\"text\":\"Mobile Phone\"},{\"text\":\"EMail ID\"}]}}],\"lines\":[{\"name\":\"/shape-2/item$2/right-/shape-3/item$/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"item$2\",\"index\":2,\"list\":\"shape-2\",\"type\":\"list-item\",\"text\":\"Address\",\"$level\":0},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$\",\"list\":\"shape-3\",\"type\":\"list-header\",\"text\":\"ADDRESS\"},\"direction\":\"left\"}},{\"name\":\"/shape-2/item$7/right-/shape-4/item$/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"item$7\",\"index\":7,\"list\":\"shape-2\",\"type\":\"list-item\",\"text\":\"Contact Details\",\"$level\":0},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$\",\"list\":\"shape-4\",\"type\":\"list-header\",\"text\":\"CONTACT\"},\"direction\":\"left\"}},{\"name\":\"/shape-6/right-/shape-2/item$/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-6\",\"text\":\"Assign\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$\",\"list\":\"shape-2\",\"type\":\"list-header\",\"text\":\"PERSON\"},\"direction\":\"left\"}},{\"name\":\"/shape-0/right-/shape-5/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-0\",\"text\":\"Receive\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"shape-5\",\"text\":\"Invoke\"},\"direction\":\"left\"}},{\"name\":\"/shape-5/bottom-/shape-6/top\",\"from\":{\"name\":\"bottom\",\"text\":\"Bottom\",\"parent\":{\"name\":\"shape-5\",\"text\":\"Invoke\"},\"direction\":\"bottom\"},\"to\":{\"name\":\"top\",\"text\":\"Top\",\"parent\":{\"name\":\"shape-6\",\"text\":\"Assign\"},\"direction\":\"top\"}},{\"name\":\"/shape-6/bottom-/shape-7/top\",\"from\":{\"name\":\"bottom\",\"text\":\"Bottom\",\"parent\":{\"name\":\"shape-6\",\"text\":\"Assign\"},\"direction\":\"bottom\"},\"to\":{\"name\":\"top\",\"text\":\"Top\",\"parent\":{\"name\":\"shape-7\",\"text\":\"Check\"},\"direction\":\"top\"}},{\"name\":\"/shape-7/bottom-/shape-8/top\",\"from\":{\"name\":\"bottom\",\"text\":\"Bottom\",\"parent\":{\"name\":\"shape-7\",\"text\":\"Check\"},\"direction\":\"bottom\"},\"to\":{\"name\":\"top\",\"text\":\"Top\",\"parent\":{\"name\":\"shape-8\",\"text\":\"Invoke\"},\"direction\":\"top\"}},{\"name\":\"/shape-8/right-/shape-9/item$/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-8\",\"text\":\"Invoke\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$\",\"list\":\"shape-9\",\"type\":\"list-header\",\"text\":\"CONTACT\"},\"direction\":\"left\"}},{\"name\":\"/shape-1/right-/shape-8/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-1\",\"text\":\"Return\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"shape-8\",\"text\":\"Invoke\"},\"direction\":\"left\"}},{\"name\":\"/shape-7/right-/shape-2/item$1/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-7\",\"text\":\"Check\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$1\",\"index\":1,\"list\":\"shape-2\",\"type\":\"list-item\",\"text\":\"Name\",\"$level\":0},\"direction\":\"left\"}},{\"name\":\"/shape-7/right-/shape-2/item$7/left\",\"from\":{\"name\":\"right\",\"text\":\"Right\",\"parent\":{\"name\":\"shape-7\",\"text\":\"Check\"},\"direction\":\"right\"},\"to\":{\"name\":\"left\",\"text\":\"Left\",\"parent\":{\"name\":\"item$7\",\"index\":7,\"list\":\"shape-2\",\"type\":\"list-item\",\"text\":\"Contact Details\",\"$level\":0},\"direction\":\"left\"}}]}";
  constructor() { }

  ngOnInit(): void {
  }

  onRowSelect($event :any)
  {
    console.log($event);
  }

  addShape($event :any)
  {
    console.log('add-shape', $event)
    this.shapeAction=$event.action;
    this.surface.setMode("position");
  }

  onPosition($event :any)
  {
    console.log('position', $event);
    this[this.shapeAction]($event);
  }
  
  onObjSelect($event :any)
  {
    console.log('obj-select', $event);
  }

  onRelSelect($event :any)
  {
    console.log('rel-select',$event);
  }

  onRelCreate($event :any)
  {
    console.log('rel-create',$event);
  }

  onSelectionChange($event :any)
  {
    console.log('selection-change',$event);
  }

  onDelete($event :any)
  {
    console.log('delete',$event);
  }

  exportToJson($event :any)
  {
    console.log(this.surface.exportToJson());
  }

  importFromJson($event :any)
  {
    this.surface.importFromJson(this.data);
  }

  downloadAsImage()
  {
    this.surface.downloadAsImage();
  }

  ['add-invoke'](evt :any)
  {
    let ctx={name: "shape-"+(this.shapeCount++), text: "Invoke"};
    this.surface.addShape("rectangle", {x: evt.x - 50, y: evt.y - 25, width: 100, height: 50}, ctx);
  }

  ["add-receive"](evt :any)
  {
    let ctx={name: "shape-"+(this.shapeCount++), text: "Receive"};
    this.surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 70, height: 70}, ctx);
  }

  ["add-return"](evt :any)
  {
    let ctx={name: "shape-"+(this.shapeCount++), text: "Return"};
    this.surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 70, height: 70}, ctx);
  }

  ["add-assign"](evt :any)
  {
    let ctx={name: "shape-"+(this.shapeCount++), text: "Assign"};
    this.surface.addShape("pill", {x: evt.x - 50, y: evt.y - 20, width: 100, height: 40}, ctx);
  }

  ["add-check"](evt :any)
  {
    let ctx={name: "shape-"+(this.shapeCount++), text: "Check"};
    this.surface.addShape("diamond", {x: evt.x - 45, y: evt.y - 45, width: 90, height: 90}, ctx);
  }

  ["add-var-person"](evt :any)
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

  ["add-var-address"](evt :any)
  {
    let list=[{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}];
    let ctx={name: "shape-"+(this.shapeCount++), text: "ADDRESS", list: list};
    this.surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  ["add-var-contact"](evt :any)
  {
    let list=[{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}];
    let ctx={name: "shape-"+(this.shapeCount++), text: "CONTACT", list: list};
    this.surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

}
