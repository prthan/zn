(function (window)
{
  let __package = "zn.ui.components";
  let __name = "Annotator";

  class Annotator
  {
    constructor(options)
    {
      this.options = options;
      this.phrase = options.phrase;
      this.parts= [];
      this.annotations= options.annotations || [];
      if(this.phrase) this.parts=this.parse(this.phrase);

      this.eventHandlers = {};
    }
    
    init()
    {
      let annotator = this;
      annotator.$target = $(annotator.options.target);

      annotator.$target.addClass("zn-annotator");
      annotator.$target.attr("zn-annotator", annotator.options.name);
     
      
      annotator.setupUI();
      annotator.setupEventHandlers();

      annotator.$target.get()[0].znc = annotator;
      annotator.fireEvent("init");
    }
    
    on(eventName, eventHandler)
    {
      let annotator = this;
      (annotator.eventHandlers[eventName] = annotator.eventHandlers[eventName] || []).push(eventHandler);
    }
    
    fireEvent(eventName, event)
    {
      let annotator = this;
      let evt = event || {};
      evt.source = annotator;
      evt.name = eventName;
      (annotator.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }
    
    setValue(phrase)
    {
      let annotator = this;
      annotator.phrase = phrase;
      annotator.parts=annotator.parse(phrase)
      annotator.annotations=[];
      annotator.$phrase.html(Annotator.htmlParts(annotator.parts));
      annotator.indexElements();
    }
    
    getValue() { return this.phrase; }
    
    getSelection()
    {
      return this.selection;
    }

    addAnnotation(from, to, text)
    {
      let annotator=this;
      let annotations=annotator.annotations;
      annotations.push({from: from, to: to, text: text});

      annotator.addAnnotationToPhrase(from, to, annotations.length-1, text)
    }

    setupUI()
    {
      let annotator = this;
      annotator.$target.html(Annotator.html(annotator.options));
      annotator.$phrase = annotator.$target.find(".zn-phrase");
      
      annotator.initParts();
      annotator.initAnnotations();
    }

    initParts()
    {
      let annotator = this;
      annotator.$phrase.html(Annotator.htmlParts(annotator.parts));
      annotator.indexElements();
    }

    initAnnotations()
    {
      let annotator = this;
      annotator.annotations.forEach((annotation, i)=>
      {
        let indexes=annotator.getIndexes(annotation.from, annotation.to);
        annotator.applyStyle(indexes, "annotated");
        annotator.addAnnotationToPhrase(annotation.from, annotation.to, i, annotation.text);
      })
    }

    addAnnotationToPhrase(from, to, i, text)
    {
      let annotator=this;

      let indexes=annotator.getIndexes(from, to);
      annotator.applyStyle(indexes, "annotated");

      let $word=annotator.$target.find(`.zn-word[data-word='${indexes[0].w}']`);
      let $letter=annotator.$target.find(`.zn-letter[data-word='${indexes[0].w}'][data-letter='${indexes[0].l}']`)
      let lp=$letter.position();

      $word.append(Annotator.htmlAnnotation(text, i));
      let $annotation=annotator.$target.find(`.zn-annotation[data-annotation='${i}']`);

      $annotation.css("left", lp.left);
      $annotation.show();
    }

    parse(v)
    {
      let parts=v.split(" ").reduce((a,c)=>
      {
        let w={word: c, letters: [...c, " "].map(x=>{return {letter: x}})}
        a.push(w);
        return a;
      }, []);
      return parts;
    }

    indexElements()
    {
      let annotator=this;
      let $phrase=annotator.$phrase;
      annotator.parts.forEach((word, wi)=>
      {
        word.letters.forEach((letter, li)=>
        {
          letter.$letter=$phrase.find(`.zn-letter[data-word='${wi}'][data-letter='${li}']`);
        })
      })
    }

    getIndexes(from, to)
    {
      let fw=from.w, fl=from.l, tw=to.w, tl=to.l;
      if(fw > tw)
      {
        let x=tw, y=tl;
        tw=fw;tl=fl;
        fw=x;fl=y;
      }
      else if(fw==tw && fl > tl)
      {
        let x=tl;
        tl=fl;
        fl=x;
      }

      let annotator=this;
      let parts=annotator.parts;
      let indexes=[];
      for(let i=fw;i<=tw;i++)
      {
        let word=parts[i];
        let si= i==fw ? fl : 0;
        let ei= i==tw ? tl : word.letters.length-1;
        for(let j=si;j<=ei;j++)
        {
          indexes.push({w: i, l: j});
        }
      }

      return indexes;
    }

    applyStyle(indexes, c)
    {
      let annotator=this;
      let parts=annotator.parts;

      indexes.forEach((item, i)=>
      {
        let $letter=parts[item.w].letters[item.l].$letter;
        $letter.addClass(c);
        if(i==0) $letter.addClass(c+"-start");
        if(i==indexes.length-1) $letter.addClass(c+"-end");
      });      
    }

    select(from,to)
    {
      let annotator=this;
      annotator.deselect();
      let indexes=annotator.getIndexes(from, to);
      annotator.applyStyle(indexes, "selected");
    }

    deselect()
    {
      let annotator=this;
      let $phrase=annotator.$phrase;
      $phrase.find(".selected").removeClass("selected").removeClass("selected-start").removeClass("selected-end");
      $phrase.find(".anchor").removeClass("anchor")
    }

    setupEventHandlers()
    {
      let annotator = this;
      let $phrase=annotator.$phrase;
      
      $phrase.on("mousedown", ".zn-letter", (evt)=>
      {
        evt.preventDefault();
        evt.stopPropagation();

        let $letter=$(evt.currentTarget);
        let index={w: parseInt($letter.attr("data-word")), l: parseInt($letter.attr("data-letter"))};
        annotator.startPoint=index;
      });

      $phrase.on("mousemove", ".zn-letter", (evt)=>
      {
        evt.preventDefault();
        evt.stopPropagation();

        let $letter=$(evt.currentTarget);
        let index={w: parseInt($letter.attr("data-word")), l: parseInt($letter.attr("data-letter"))};
        if(annotator.startPoint)
        {
          annotator.lastHoverPoint=index;
          annotator.select(annotator.startPoint, annotator.lastHoverPoint);
        }
      });

      $phrase.on("mouseup", ".zn-letter", (evt)=>
      {
        evt.preventDefault();
        evt.stopPropagation();

        let $letter=$(evt.currentTarget);
        let index={w: parseInt($letter.attr("data-word")), l: parseInt($letter.attr("data-letter"))};
        annotator.endPoint=index;
        if(evt.shiftKey)
        {
          if(annotator.selection) annotator.startPoint=annotator.selection[0]
        }
        annotator.select(annotator.startPoint, annotator.endPoint);
        annotator.selection=[annotator.startPoint, annotator.endPoint];
        annotator.startPoint=null;
        annotator.endPoint=null;
        annotator.lastHoverPoint=null;
      });

      $phrase.on("mousedown", (evt)=>
      {
        annotator.deselect();
        annotator.selection=null;
        annotator.startPoint=null;
        annotator.endPoint=null;
        annotator.lastHoverPoint=null;
      });

      $phrase.on("mouseleave", (evt)=>
      {
        if(!annotator.startPoint) return;
        annotator.endPoint=annotator.lastHoverPoint;
        annotator.select(annotator.startPoint, annotator.endPoint);
        annotator.selection=[annotator.startPoint, annotator.endPoint];
        annotator.startPoint=null;
        annotator.endPoint=null;
        annotator.lastHoverPoint=null;
      })

    }
    
    static get(name)
    {
      return $(`[zn-annotator='${name}']`).get()[0].znc;
    }

    static html(options)
    {
      return `<div class="zn-phrase"></div>`;
    };

    static htmlParts(parts)
    {
      return parts.reduce((a,c,i)=> a + `<span class="zn-word" data-word="${i}">${Annotator.htmlLetters(c.letters, i)}</span>`, "");
    };

    static htmlLetters(letters, wi)
    {
      return letters.reduce((a,c,i)=> a + `<span class="zn-letter ${c.letter==" " ? 'space':''}" data-word="${wi}" data-letter="${i}">${c.letter!=" " ? c.letter : '&nbsp;'}</span>`, "");
    }
    
    static htmlAnnotation(text, i)
    {
      return `<div class='zn-annotation' data-annotation="${i}">${text}</div>`;
    }
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Annotator;

})(window);

