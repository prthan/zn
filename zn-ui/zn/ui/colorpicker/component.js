(function(window)
{
  let __package = "zn.ui.components";
  let __name = "ColorPicker";

  let SPECTRUM_IMG_DATA="data:image/png;base64,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";
  
  class ColorPicker
  {
    constructor(options)
    {
      this.options = options;
      this.value = options.value || "#000000";
      this.eventHandlers = {};
    }

    init()
    {
      let colorpicker = this;
      colorpicker.$target = $(colorpicker.options.target);

      colorpicker.$target.addClass("zn-colorpicker");
      colorpicker.$target.attr("zn-colorpicker", colorpicker.options.name);
      if (colorpicker.options.error) colorpicker.$target.addClass("error");

      colorpicker.setupUI();
      colorpicker.setupEventHandlers();

      colorpicker.$target.get()[0].znc = colorpicker;
      colorpicker.setValue(colorpicker.value);
      colorpicker.fireEvent("init");
    }
    on(eventName, eventHandler)
    {
      let colorpicker = this;
      (colorpicker.eventHandlers[eventName] = colorpicker.eventHandlers[eventName] || []).push(eventHandler);
    }
    fireEvent(eventName, event)
    {
      let colorpicker = this;
      let evt = event || {};
      evt.source = colorpicker;
      evt.name = eventName;
      (colorpicker.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }
    setValue(value)
    {
      let colorpicker = this;
      colorpicker.value = value;
      colorpicker.$input.find("input").val(value);
      colorpicker.$input.find(".color").css("background-color", value);
    }
    getValue()
    {
      return this.value;
    }
    message(msg, type)
    {
      let colorpicker = this;
      if (msg != "")
      {
        colorpicker.$msg.text(msg);
        if (type == "error") colorpicker.$target.addClass("error");
        else colorpicker.$target.addClass("message");
      }
      else
      {
        colorpicker.$msg.text("");
        colorpicker.$target.removeClass("error").removeClass("message");
      }
    }
    setupUI()
    {
      let colorpicker = this;
      colorpicker.$target.html(ColorPicker.html(colorpicker.options));
      colorpicker.$value = colorpicker.$target.find(".value");
      colorpicker.$input = colorpicker.$target.find(".zn-colorpicker-input");
      //colorpicker.$menu = colorpicker.$target.find(".zn-colorpicker-menu");
      colorpicker.$msg = colorpicker.$target.find(".zn-colorpicker-msg");
    }
    setupEventHandlers()
    {
      let colorpicker = this;
      colorpicker.$target.find(".zn-colorpicker-input").on("keydown", (evt) =>
      {
        if (evt.keyCode != 40) return;
        if (!colorpicker.$menu) colorpicker.showColorMenu();
      });
      colorpicker.$target.find(".zn-colorpicker-input input").on("focus", (evt) =>
      {
        colorpicker.$target.addClass("focused");
      })
      .on("blur", (evt) =>
      {
        colorpicker.$target.removeClass("focused");
      });
      
      colorpicker.$target.find(".zn-colorpicker-input .action").on("click", (evt) =>
      {
        colorpicker.$input.find("input").focus();
        if (!colorpicker.$menu) colorpicker.showColorMenu();
      });

      colorpicker.$target.find(".zn-colorpicker-input input").on("change", (evt) =>
      {
        let $input = $(evt.currentTarget);
        let oldValue = colorpicker.getValue();
        let newValue = $input.val();
        colorpicker.value = newValue;
        colorpicker.$input.find(".color").css("background-color", newValue);
        colorpicker.fireEvent("change", { oldValue: oldValue, newValue: newValue });
      });

    }
    
    canvasContext(canvas, w)
    {
      let dpr = window.devicePixelRatio || 1;
      let rect = canvas.getBoundingClientRect();

      canvas.width = w * dpr;
      canvas.height = 72 * dpr;
      let ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      return ctx;      
    }

    colorData(colorHex)
    {
      let data=[colorHex.substr(1, 2), colorHex.substr(3, 2), colorHex.substr(5, 2)];
      return "#"+data.join("");
    }

    initCanvas(w)
    {
      let colorpicker = this;

      let colorsCanvas=colorpicker.$menu.find("canvas").get()[0];
      colorsCanvas.setAttribute("width", w);
      colorsCanvas.setAttribute("height", 72);
      let colorsCanvasCtx=colorsCanvas.getContext('2d');
      
      let grd = colorsCanvasCtx.createLinearGradient(0, 0, w, 0);
      grd.addColorStop(0.00, "#FF0000");
      grd.addColorStop(0.17, "#FFA500");
      grd.addColorStop(0.33, "#FFFF00");
      grd.addColorStop(0.50, "#00FF00");
      grd.addColorStop(0.67, "#00FFFF");
      grd.addColorStop(0.83, "#0000FF");      
      grd.addColorStop(1.00, "#8F00FF");
      colorsCanvasCtx.fillStyle = grd;
      colorsCanvasCtx.fillRect(0, 0, w, 24);

      let colorData=colorpicker.colorData(colorpicker.value);

      grd = colorsCanvasCtx.createLinearGradient(0, 0, w, 0);
      grd.addColorStop(0, "#000000");
      grd.addColorStop(0.5, colorData);
      grd.addColorStop(1, "#FFFFFF");
      colorsCanvasCtx.fillStyle = grd;
      colorsCanvasCtx.fillRect(0, 24, w, 24);

      grd = colorsCanvasCtx.createLinearGradient(0, 25, w, 24);
      grd.addColorStop(0, colorData + "00");
      grd.addColorStop(1, colorData + "FF");
      colorsCanvasCtx.fillStyle = grd;
      colorsCanvasCtx.fillRect(0, 48, w, 24);

    }

    showColorMenu()
    {
      let colorpicker = this;
      colorpicker.oldValue=colorpicker.value;

      $("body").append(`<div class="zn-colorpicker-menu" tabindex="0"></div>`);
      colorpicker.$menu=$(".zn-colorpicker-menu");
      colorpicker.$menu.html(ColorPicker.htmlDropdownMenu(colorpicker.options.items));

      var $body = $("body");
      colorpicker.hideMenu = () =>
      {
        $body.off("mousedown.zn.ui.components.colorpicker.itemspopup");
        $body.off("keydown.zn.ui.components.colorpicker.itemspopup");
        colorpicker.$menu.remove();
        colorpicker.$menu=null;
      };
      $body.on("mousedown.zn.ui.components.colorpicker.itemspopup", (evt) =>
      {
        if (!ColorPicker.pointInContent({ x: evt.pageX, y: evt.pageY }, colorpicker.$menu) && 
            !ColorPicker.pointInContent({ x: evt.pageX, y: evt.pageY }, colorpicker.$target)) colorpicker.hideMenu();
      });
      $body.on("keydown.zn.ui.components.colorpicker.itemspopup", (evt) =>
      {
        if (evt.keyCode == 27)
        {
          colorpicker.setValue(colorpicker.oldValue);
          colorpicker.fireEvent("input", { value: colorpicker.oldValue });
          colorpicker.hideMenu();
        }
        if (evt.keyCode == 13)
        {
          if(colorpicker.oldValue!=colorpicker.value) colorpicker.fireEvent("change", {newValue: colorpicker.value, oldValue: colorpicker.oldValue});
          colorpicker.hideMenu();
        }
      });

      colorpicker.$menu.find("canvas").click((evt) =>
      {
        let x=evt.offsetX;
        let y=evt.offsetY;
        
        let inputRect=colorpicker.$input.get()[0].getBoundingClientRect();
        let colorsCanvas=colorpicker.$menu.find("canvas").get()[0];
        let colorsCanvasCtx=colorsCanvas.getContext('2d');
        let c=colorsCanvasCtx.getImageData(x, y, 1, 1).data;
        let w=inputRect.width - 6;

        if(y>=0&&y<=24)
        {
          let grd = colorsCanvasCtx.createLinearGradient(0, 0, w, 0);
          grd.addColorStop(0, "#000000");
          grd.addColorStop(0.5, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`);
          grd.addColorStop(1, "#ffffff");
          colorsCanvasCtx.fillStyle = grd;
          colorsCanvasCtx.clearRect(0, 24, w, 24);
          colorsCanvasCtx.fillRect(0, 24, w, 24);

        }

        if(y>=0 && y<=48)
        {
          let grd = colorsCanvasCtx.createLinearGradient(0, 25, w, 24);
          grd.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0)`);
          grd.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 255)`);
          colorsCanvasCtx.fillStyle = grd;
          colorsCanvasCtx.clearRect(0, 48, w, 24);
          colorsCanvasCtx.fillRect(0, 48, w, 24);
        }

        let colorHexValue=c.reduce((a,c)=>
        {
          return a + ('0' + (c & 0xFF).toString(16)).slice(-2).toUpperCase();
        },"#");
        colorpicker.value=colorHexValue;
        colorpicker.$input.find("input").val(colorHexValue);
        colorpicker.$input.find(".color").css("background-color", colorHexValue);
        colorpicker.fireEvent("input", { value: colorHexValue });
      });

      colorpicker.$menu.show();

      let inputRect=colorpicker.$input.get()[0].getBoundingClientRect();
      let menuRect=colorpicker.$menu.get()[0].getBoundingClientRect();
      let left=inputRect.x;
      let top= inputRect.y + inputRect.height + 1;
      let wh = $(window).height();
      if (top + menuRect.height > wh) top =  wh - menuRect.height;
      top += $(window).scrollTop();
      colorpicker.$menu.css("top", top + "px").css("left", left + "px").css("width", inputRect.width);

      colorpicker.initCanvas(inputRect.width - 6);
    }

    static get(name)
    {
      return $(`[zn-colorpicker='${name}']`).get()[0].znc;
    }
  
    static html(options)
    {
      return `
      ${options.label ? ColorPicker.htmlLabel(options.label) : ''}
      <div class="zn-colorpicker-input" tabindex="0">
        <div class='color' style='background-color: ${options.value}'>&nbsp;</div>
        <div class="input"><input type="text" value="${options.value}"></input></div>
        <div class="action"><i class="fas fa-palette"></i></div>
      </div>
      <div class="zn-colorpicker-msg">${options.error || options.message || ''}</div>
      `;
    };
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`
    }
  
    static htmlLabel(label)
    {
      return `<div class="zn-colorpicker-label">${label}</div>`
    }
  
    static htmlDropdownMenu(items)
    {
      return `<div class="canvas-wrapper"><canvas class="palette"/></div>`
    }
  
    static htmlValue(value)
    {
      return `<span class='color' style='background-color: ${value}'>&nbsp;</span><input type="text" value="${value || ""}"></input>`
    }

    static pointInContent(point,content)
    {
      let offset=content.offset();
      let w=content.get()[0].offsetWidth;
      let h=content.get()[0].offsetHeight;
      
      return point.x >= offset.left && 
             point.x <= (offset.left+w) && 
             point.y >= offset.top &&
             point.y <= (offset.top+h);
    }
  
    static itemForValue(items, value)
    {
      if(!items) return null;
      
      let result=items.filter((i)=>{return i.value==value});
      return result.length==0 ? null : result[0];
    }
  
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = ColorPicker;

})(window);

