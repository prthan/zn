$(()=>
{
  let surfaceFactory=zn.designer.surface;
  let surface=surfaceFactory.create({
    target: ".surface"
  });
  surface.init();

  let assign=new zn.designer.shape.Rectangle(100,100,100,50, {name:"assign", text: "Assign"});
  surface.addShape(assign.$shape);

  let translate=new zn.designer.shape.Rectangle(100,200,100,50, {name: "translate", text: "Translate"});
  surface.addShape(translate.$shape);

  let invoke=new zn.designer.shape.Rectangle(100,300,150,50, {name: "invoke", text: "Invoke the target service"});
  surface.addShape(invoke.$shape);

  surface.addShape(new zn.designer.shape.Ellipse(100,400,70,70, {name: "receive", text: "Receive"}).$shape);
  surface.addShape(new zn.designer.shape.Ellipse(100,500,70,70, {name: "return", text: "Return"}).$shape);

  let check=new zn.designer.shape.Diamond(300,100,80,80, {name:"check", text: "Check"});
  surface.addShape(check.$shape);
  
  let ca=new zn.designer.shape.Diamond(300,200,80,80, {name: "case", text: "Case"});
  surface.addShape(ca.$shape);
  
  let sw=new zn.designer.shape.Diamond(300,300,80,80, {name: "switch", text: "Switch On Status"});
  surface.addShape(sw.$shape);

  surface.addShape(new zn.designer.shape.Pill(500,100,100,40, {name:"assign-values", text: "Assign Values"}).$shape);
  surface.addShape(new zn.designer.shape.Pill(500,200,110,40, {name:"copy-values", text: "Copy Values"}).$shape);
  surface.addShape(new zn.designer.shape.Pill(500,300,100,40, {name:"add-values", text: "Add Values"}).$shape);


  surface.shapesLayer.draw();
})

