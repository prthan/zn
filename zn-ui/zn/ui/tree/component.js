(function (window)
{
  let __package = "zn.ui.components";
  let __name = "Tree";

  class Tree
  {
    constructor(options)
    {
      this.options = options;
      this.roots=options.roots || [];
      this.eventHandlers = {};
    }
    
    init()
    {
      let tree = this;
      tree.$target = $(tree.options.target);

      tree.$target.addClass("zn-tree");
      tree.$target.attr("zn-tree", tree.options.name);

      tree.setupUI();
      tree.setupEventHandlers();

      tree.$target.get()[0].znc = tree;
      tree.fireEvent("init");
    }
    
    on(eventName, eventHandler)
    {
      let tree = this;
      (tree.eventHandlers[eventName] = tree.eventHandlers[eventName] || []).push(eventHandler);
    }
    
    fireEvent(eventName, event)
    {
      let tree = this;
      let evt = event || {};
      evt.source = tree;
      evt.name = eventName;
      (tree.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }
    
    setRoots(roots)
    {
      let tree = this;
      tree.roots = roots;
    }
    
    setupUI()
    {
      let tree = this;
      tree.nodeMap={};
      tree.$target.html(Tree.html(tree.options, tree.nodeMap));
    }

    setupEventHandlers()
    {
      let tree = this;
      tree.$target.on("click", ".node-content", (evt)=>
      {
        let $nodeContent=$(evt.currentTarget);
        let $node=$nodeContent.parent();
        let $nodeChildren=$nodeContent.siblings(".node-children");
        let $nodeToggle=$nodeContent.find(".node-toggle");

        let state=$node.attr("data-state")
        $nodeToggle.find(`.state-${state}`).hide();
        
        state=(state=="collapsed"?"expanded":"collapsed");
        $node.attr("data-state", state);
        
        $nodeToggle.find(`.state-${state}`).show();
        if(state=="expanded") $nodeChildren.show();
        else $nodeChildren.hide();
      })

      tree.$target.on("dragstart", ".node-content, .leaf-node", (evt)=>
      {
        let $node=$(evt.currentTarget);
        let nodeIndex=$node.attr("data-node-index");
        let path=tree.getNodePath(nodeIndex);
        evt.originalEvent.dataTransfer.setData("text/plain", JSON.stringify(path));
      })

    }
    
    getNodePath(nodeIndex)
    {
      let tree=this;
      let treeNode=tree.nodeMap[nodeIndex];
      let path=[{text: treeNode.text}];
      let p=treeNode;
      while((p=p.$parent)!=null) path.unshift({text: p.text})
      
      return path;
    }

    getRoots(text)
    {
      let impl=(res$, rej$)=>
      {
      }
      return new Promise(impl);
    }

    static OFFSET=15;

    static get(name)
    {
      return $(`[zn-tree='${name}']`).get()[0].znc;
    }

    static html(options, nodeMap)
    {
      return `
      ${(options.roots || []).reduce((a,c)=>
        {
          a += Tree.htmlNode(c, 0, null, nodeMap);
          return a;
        }, "")}
      `;
    };
  
    static htmlLeafNode(node, level, parent, nodeMap)
    {
      nodeMap.$index = (nodeMap.$index || 0) + 1;
      node.$parent=parent;
      nodeMap[""+nodeMap.$index]=node;

      return `
      <div class="leaf-node"" draggable="true" data-node-index="${nodeMap.$index}">
        <div style="width: ${level*Tree.OFFSET}px" class="indent">&nbsp;</div>
        <div class="node-toggle">&nbsp;</div>
        ${node.icon ? Tree.htmlIcon(node.icon, "node-icon"): ''} 
        <div class="text">${node.text}</div>
      </div>
      `;
    }    

    static htmlNode(node, level, parent, nodeMap)
    {
      nodeMap.$index = (nodeMap.$index || 0) + 1;
      node.$parent=parent;
      nodeMap[""+nodeMap.$index]=node;

      return `
      <div class="node" data-state="${node.state || 'expanded'}">
        <div class="node-content" draggable="true" data-node-index="${nodeMap.$index}">
          <div style="width: ${level*Tree.OFFSET}px" class="indent">&nbsp;</div>
          <div class="node-toggle">
            <i class="state-collapsed fas fa-caret-right" style="display: ${(node.state || 'expanded')=='collapsed' ? 'inline-block':'none'}"></i>
            <i class="state-expanded fas fa-caret-down" style="display: ${(node.state || 'expanded')=='expanded' ? 'inline-block':'none'}"></i>
          </div>
          ${node.icon ? Tree.htmlIcon(node.icon, "node-icon"): ''}
          <div class="text">${node.text}</div>
        </div>
        <div class="node-children">
          ${node.children.reduce((a,c)=>{
            a += (c.children ? Tree.htmlNode(c, level+1, node, nodeMap) : Tree.htmlLeafNode(c, level+1, node, nodeMap));
            return a;
          },"")}
        </div>
      </div>
      `;
    }    

    static htmlIcon(icon, type)
    {
      return `<i class="icon ${type} ${icon}"></i>`
    }
  
    static htmlLabel(label)
    {
      return `<div class="zn-tree-label">${label}</div>`
    }
  
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Tree;

})(window);

