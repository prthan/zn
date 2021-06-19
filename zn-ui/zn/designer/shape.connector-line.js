(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "ConnectorLine";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Component
  {
    constructor(cp0, cp1, ctx, oid)
    {
      let component = this;
      component.$class = `${__package}.${__name}`;
      component.$type = "line";

      component.cp0 = cp0;
      component.cp1 = cp1;
      component.ctx = ctx;
      component.oid = oid || zn.shortid();

      let p0 = base.pointOf(cp0);
      let p1 = base.pointOf(cp1);

      component.startPointDirection = component.cp0.getAttr("zn-ctx").direction;
      component.endPointDirection = component.cp1.getAttr("zn-ctx").direction;

      component.$shape = new Konva.Arrow({
        points: utils.blinePoints(p0.x, p0.y, p1.x, p1.y, component.startPointDirection, component.endPointDirection),
        bezier: true,
        fill: props["connector.line.stroke"],
        stroke: props["connector.line.stroke"],
        strokeWidth: 2,
        pointerLength: 5,
        pointerWidth: 4,
        hitStrokeWidth: 20
      });
      component.$shape.setAttr("zn-ctx", ctx);
      component.$shape.setAttr("zn-oid", component.oid);
      component.$shape.addName("connector-line");

      component.cp0.$lines = (component.cp0.$lines || []);
      component.cp0.$lines.push(component.oid);

      component.cp1.$lines = (component.cp1.$lines || []);
      component.cp1.$lines.push(component.oid);

      component.setupEventHandlers();
    }

    setupEventHandlers()
    {
      let component = this;
      let line = component.$shape;

      let updateLine = () =>
      {
        let p0 = base.pointOf(component.cp0);
        let p1 = base.pointOf(component.cp1);
        let blinePoints = utils.blinePoints(p0.x, p0.y, p1.x, p1.y, component.startPointDirection, component.endPointDirection);
        line.points(blinePoints);
        line.getLayer().batchDraw();
      };

      component.ehname = `eh${new Date().getTime()}`;
      component.cp0.on(`connector-update.${component.ehname}`, updateLine);
      component.cp1.on(`connector-update.${component.ehname}`, updateLine);

      line.on("mouseover", () =>
      {
        line.stroke(props["connector.line.hilight"]);
        line.getLayer().batchDraw();
      });

      line.on("mouseout", () =>
      {
        if (line.hasName("selected"))
          line.stroke(props["connector.line.select"]);
        else
          line.stroke(props["connector.line.stroke"]);
        line.getLayer().batchDraw();
      });

      line.on("mousedown", () =>
      {
        base.resetConnectorLineSelection(line.getLayer());
        line.addName("selected");
        line.stroke(props["connector.line.select"]);
        line.getLayer().batchDraw();
        line.getStage().fire("connection-select", { source: line });
      });
    }

    removePointUpdateEventHandlers()
    {
      let component = this;
      component.cp0.off(`connector-update.${component.ehname}`);
      component.cp1.off(`connector-update.${component.ehname}`);
    }
    
    destroy()
    {
      let component = this;
      component.removePointUpdateEventHandlers();
      component.cp0.$lines = component.cp0.$lines.filter((id) => id != component.oid);
      component.cp1.$lines = component.cp1.$lines.filter((id) => id != component.oid);
      component.$shape.destroy();
    }
  }




  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

