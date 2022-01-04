(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "List";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Component
  {
    constructor(x, y, w, h, ctx, oid)
    {
      let component = this;
      component.$class = `${__package}.${__name}`;
      component.$type = "list";

      component.ctx = ctx;
      component.oid = oid || zn.shortid();
      component.list=ctx.list;

      component.ch = 25 + component.list.length * props["node.height"];
      if (h > component.ch) component.ch = h;

      component.nodes = [];

      component.$shape = new Konva.Group({ x: x, y: y, width: w, height: component.ch, draggable: true });
      component.$shape.setAttr("zn-ctx", ctx);
      component.$shape.setAttr("zn-oid", component.oid);
      component.$shape.addName("list");

      component.addHitRegion(w, h, ctx);
      component.addSelectArea(w, h, ctx);
      component.addShapeBackground(w, h, ctx);
      component.addHeader(w, ctx);
      component.addShapeDetails(w, h, ctx);
      component.addShapeForeground(w, h, ctx);
      component.setupEventHandlers();
    }

    addHitRegion(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let hitSize = props["connector.size"] * 2;
      let hitRegion = new Konva.Rect({
        x: -hitSize + 0.5,
        y: -hitSize + 0.5,
        width: w + hitSize * 2,
        height: component.ch + hitSize * 2,
        strokeWidth: 0,
        fill: props["hitregion.fill"]
      });
      hitRegion.addName("hit-region");
      group.add(hitRegion);
      component.hitRegion = hitRegion;
    }

    addShapeBackground(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let background = new Konva.Rect({
        x: 0, y: 0,
        width: w,
        height: component.ch,
        fill: props["rect.fill"],
        cornerRadius: 5,
        listening: false
      });
      background.addName("background");
      group.add(background);
      component.background = background;
    }

    addShapeForeground(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let foreground = new Konva.Rect({
        x: 0, y: 0,
        width: w,
        height: component.ch,
        stroke: props["rect.stroke"],
        strokeWidth: 3,
        cornerRadius: 5,
        listening: false
      });
      foreground.addName("foreground");
      group.add(foreground);
      component.foreground = foreground;
    }
    
    addSelectArea(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let size = props["shape.select.offset"];
      let selection = new Konva.Rect({
        x: -size + 0,
        y: -size + 0,
        width: w + size * 2,
        height: component.ch + size * 2,
        fill: props["shape.select.fill"],
        strokeWidth: props["shape.select.stroke.size"],
        stroke: props["shape.select.stroke"],
        dash: [4, 4],
        visible: false,
        listening: false,
        cornerRadius: 5
      });
      selection.addName("selection");
      group.add(selection);
      component.selection = selection;
    }

    addHeader(w, ctx)
    {
      let component = this;
      let group = component.$shape;

      component.headerNode = new zn.designer.shape.HeaderNode(0, 0, w, props["node.height"], { name: `item$`, list: component.oid, type: "list-header", text: ctx.text });
      component.headerNode.rect.cornerRadius([5, 5, 0, 0]);
      group.add(component.headerNode.$shape);

    }

    addShapeDetails(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let x = 0;
      let y = 25;
      let dy = 25;

      component.list.forEach((e, i) =>
      {
        let node = new zn.designer.shape.Node(x, y, w, props["node.height"], {name: `item$${i}`, index: i, list: component.oid, type: "list-item", ...e });
        component.nodes.push(node);
        group.add(node.$shape);
        y += dy;
      });
    }

    updateShape(w, h)
    {
      let component = this;
      let group = component.$shape;
      let ch=25 + component.list.length * props["node.height"];
      let s = { width: w, height: ch};

      group.setSize(s);

      let hitSize = props["connector.size"] * 2;
      component.hitRegion.size({ width: w + hitSize * 2, height: ch + hitSize * 2 });
      component.background.size(s);
      component.foreground.size(s);

      let offset = props["shape.select.offset"];
      component.selection.size({ width: w + offset * 2, height: ch + offset * 2 });

      component.headerNode.updateShape(w, 25);
      component.nodes.forEach((node, i) =>node.updateShape(w, 25));

      zn.designer.shape.ConnectorPoint.updateForRectangularShape(component);
    }

    getRect()
    {
      let component = this;
      let size = component.$shape.getSize();
      let pos = component.$shape.getPosition();

      return { x: pos.x, y: pos.y, width: size.width, height: component.ch };
    }

    setRect(rect)
    {
      let component=this;
      component.$shape.setPosition({x: rect.x, y: rect.y});
      component.updateShape(rect.width, rect.height);
      component.$shape.getLayer().batchDraw();
    }

    setText(text)
    {
      let component=this;
      component.ctx.text=text;
      component.headerNode.text.text(text);
      component.$shape.getLayer().batchDraw();
    }

    insertNode(ctx, index)
    {
      let component = this;
      let group = component.$shape;
      let size=component.$shape.getSize();

      let node = new zn.designer.shape.Node(0, 25 + index * 25, size.width, props["node.height"], {name: `item$${index}`, index: index, list: component.oid, type: "list-item", ...ctx });
      group.add(node.$shape);

      if(index)
      {
        component.nodes.splice(index, 0, node);
        component.list.splice(index, 0, ctx);
      }
      else
      {
        component.nodes.push(node);
        component.list.push(ctx);
      }
      

      component.nodes.forEach((node, i)=>
      {
        node.setIndex(i);
        node.$shape.y(25 + i * 25);
      })
      
      component.updateShape(size.width, 50);
      component.$shape.getLayer().batchDraw();
    }

    deleteNode(index)
    {
      let component=this;
      let size=component.$shape.getSize();
      let node=component.nodes[index];
      let connectorLines=node.connectorLines();
      node.$shape.getStage().fire("delete-connections", {ids: connectorLines});
      node.destroy();
      component.nodes.splice(index, 1);
      component.list.splice(index, 1);
      component.nodes.forEach((node, i)=>
      {
        node.setIndex(i);
        node.$shape.y(25 + i * 25);
      })
      component.updateShape(size.width, 50);
      component.$shape.getLayer().batchDraw();
    }

    moveNodeUp(index)
    {
      let component=this;
      
      if(index<=0) return;
      let size=component.$shape.getSize();

      let prevNode=component.nodes[index-1];
      component.nodes[index-1]=component.nodes[index];
      component.nodes[index]=prevNode;

      let prevItem=component.list[index-1];
      component.list[index-1]=component.list[index];
      component.list[index]=prevItem;

      component.nodes.forEach((node, i)=>
      {
        node.setIndex(i);
        node.$shape.y(25 + i * 25);
      })
      component.updateShape(size.width, 50);
      component.$shape.getLayer().batchDraw();
    }

    moveNodeDown(index)
    {
      let component=this;

      if(index>component.nodes.length-1) return;
      
      let size=component.$shape.getSize();

      let nextNode=component.nodes[index+1];
      component.nodes[index+1]=component.nodes[index];
      component.nodes[index]=nextNode;

      let nextItem=component.list[index+1];
      component.list[index+1]=component.list[index];
      component.list[index]=nextItem;

      component.nodes.forEach((node, i)=>
      {
        node.setIndex(i);
        node.$shape.y(25 + i * 25);
      })
      component.updateShape(size.width, 50);
      component.$shape.getLayer().batchDraw();
    }

    setNodeLevel(index, level)
    {
      let component=this;
      if(index>component.nodes.length-1) return;

      component.nodes[index].setLevel(level);
      component.list[index].$level=level;
    }

    setNodeText(index, text)
    {
      let component=this;
      if(index>component.nodes.length-1) return;

      component.nodes[index].setText(text);
      component.list[index].text=text;
    }

    setColor(type, colorVal)
    {
      let component=this;
      if(type=="stroke-color") component.foreground.stroke(colorVal);
      if(type=="fill-color") component.background.fill(colorVal);
      /*if(type=="text-color")
      {
        if(props["text.stroke"]) component.text.stroke(colorVal)
        else component.text.fill(colorVal);
      }*/
      component.$shape.getLayer().batchDraw();
    }

    getColor(type)
    {
      let component=this;
      if(type=="stroke-color") return component.foreground.stroke();
      if(type=="fill-color") return component.background.fill();
      /*if(type=="text-color")
      {
        if(props["text.stroke"]) return component.text.stroke()
        else return component.text.fill();
      }*/
      return "";
    }

    move(dx, dy)
    {
      let component = this;
      let $shape=component.$shape;
      $shape.x($shape.x()+dx);
      $shape.y($shape.y()+dy);
      base.handleShapeDragEnd(component)
    }

    setupEventHandlers()
    {
      let component = this;
      let group = component.$shape;

      group.on("dragend", () =>
      {
        if(!group.hasName("selected")) base.snap(group);
        base.fireConnectorPointUpdateEvent(component.headerNode.$shape);
        component.nodes.forEach((node) => base.fireConnectorPointUpdateEvent(node.$shape));
        //base.snapOtherSelectedObjects(group.getLayer(), group);
        group.getStage().fire("shape-rect-update", {source: component})
      });
      group.on("dragmove", (event) =>
      {
        base.fireConnectorPointUpdateEvent(component.headerNode.$shape);
        component.nodes.forEach((node) => base.fireConnectorPointUpdateEvent(node.$shape));
        base.moveOtherSelectedObjects(group.getLayer(), group, event);
        group.getStage().fire("shape-rect-update", {source: component})
      });
      group.on("mousedown", (event) =>
      {
        if (!event.evt.ctrlKey) base.handleShapeMouseDown(component);
      });
      group.on("click", (event) =>
      {
        if (!event.evt.ctrlKey) base.handleShapeClick(component);
        else base.handleShapeSelectAdd(component);
      });

    }

    destroy()
    {
      let component = this;
      component.$shape.destroy();
    }
    
    connectorLines()
    {
      let component = this;
      let lines = [];
      lines.push(...component.headerNode.connectorLines());
      component.nodes.forEach((node) => lines.push(...node.connectorLines()));

      return lines;
    }
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

