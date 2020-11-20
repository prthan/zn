(function(window)
{
  let __package  = "zn.designer.op";
  let __name     = "DrawObject";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Operation
  {
    constructor(surface)
    {
      let op = this;
      op.surface = surface;
    }

    start(x, y)
    {
      let op = this;
      op.p0 = { x: x, y: y };
      op.p1 = { x: x, y: y };

      let r = utils.getRect(op.p0, op.p1);
      op.drawRect = new Konva.Rect({
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        fill: props["shape.select.fill"],
        strokeWidth: props["shape.select.stroke.size"],
        stroke: props["shape.select.stroke"],
        dash: [4, 4],
      });
      op.surface.dragLayer.add(op.drawRect);
      op.surface.dragLayer.batchDraw();
    }

    update(x, y)
    {
      let op = this;
      op.p1.x = x;
      op.p1.y = y;
      let r = utils.getRect(op.p0, op.p1);
      op.drawRect.position({ x: r.x, y: r.y });
      op.drawRect.size({ width: r.width, height: r.height });
      op.surface.dragLayer.batchDraw();
    }

    end(x, y)
    {
      let op = this;
      op.p1.x = x;
      op.p1.y = y;
      op.drawRect.destroy();
      op.surface.dragLayer.batchDraw();

      if (op.p0.x != op.p1.x && op.p0.y != op.p1.y) op.surface.stage.fire("draw-object", { rect: utils.getRect(op.p0, op.p1) });
    }
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Operation;

})(window);

