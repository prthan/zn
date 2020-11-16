$(()=>
{
  let surfaceFactory=zn.designer.surface;
  let surface=surfaceFactory.create({
    target: ".surface"
  });
  surface.init();

  let assign=new zn.designer.shape.Rectangle(100,100,100,50, {name:"assign", text: "Assign"});
  surface.addShape(assign);

  let translate=new zn.designer.shape.Rectangle(100,200,100,50, {name: "translate", text: "Translate"});
  surface.addShape(translate);

  let invoke=new zn.designer.shape.Rectangle(100,300,150,50, {name: "invoke", text: "Invoke the target service"});
  surface.addShape(invoke);

  surface.addShape(new zn.designer.shape.Ellipse(100,400,70,70, {name: "receive", text: "Receive"}));
  surface.addShape(new zn.designer.shape.Ellipse(100,500,70,70, {name: "return", text: "Return"}));

  let check=new zn.designer.shape.Diamond(300,100,80,80, {name:"check", text: "Check"});
  surface.addShape(check);
  
  let ca=new zn.designer.shape.Diamond(300,200,80,80, {name: "case", text: "Case"});
  surface.addShape(ca);
  
  let sw=new zn.designer.shape.Diamond(300,300,90,90, {name: "switch", text: "Switch On Status"});
  surface.addShape(sw);

  surface.addShape(new zn.designer.shape.Pill(500,100,100,40, {name:"concat", text: "Concat"}));
  surface.addShape(new zn.designer.shape.Pill(500,200,110,40, {name:"copy", text: "Copy"}));
  surface.addShape(new zn.designer.shape.Pill(500,300,100,40, {name:"filter", text: "Filter"}));
  surface.addShape(new zn.designer.shape.Pill(500,400,100,40, {name:"reduce", text: "Reduce"}));

  let person=
  [
    {text: "ID"}, {text: "Name"},
    {text: "Address", $list: [{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}]},
    {text: "Contact Details", $list: [{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}]}
  ];
  let listPerson=new zn.designer.shape.List(700, 300, 150, 40, {name: "person", text: "PERSON", list: person});
  surface.addShape(listPerson);
  
  let address=[{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}];
  let listAddress=new zn.designer.shape.List(1000, 300, 150, 40, {name: "address", text: "ADDRESS", list: address});
  surface.addShape(listAddress);

  let contact=[{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}];
  let listContact=new zn.designer.shape.List(1000, 500, 150, 40, {name: "contact", text: "CONTACT", list: contact});
  surface.addShape(listContact);

  surface.on("points-connected", (evt)=>
  {
    let source=evt.connection.source;
    let target=evt.connection.target;
    
    console.log(evt);
    let index=-1;
    if(source.parent.type=="list-item") index=source.parent.index;
    if(target.parent.type=="list-item") index=target.parent.index;

    //if(index!=-1) listShape.nodes[index].mark(true);

  })

  surface.shapesLayer.draw();
})

