/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Overlay container widget
 */
qx.Class.define("unify.ui.container.Overlay", {
  extend : unify.ui.container.Composite,
  
  include : [unify.ui.core.MChildControl, qx.ui.core.MRemoteChildrenHandling],
  
  events : {
    /** Event thrown if overlay visibility is changed to hidden */
    "hidden" : "qx.event.type.Event",
    
    /** Event thrown if overlay visibility is changed to shown */
    "shown" : "qx.event.type.Event"
  },
  
  properties : {
    // overridden
    appearance : {
      refine: true,
      init: "overlay"
    },
    
    /** Paint arrow */
    hasArrow : {
      check: "Boolean",
      init: true,
      apply: "__applyHasArrow"
    },

    /** relative position of the arrow on its axis
     *
     * may be "left,right,center,top,bottom, a percentage of the axis size or a pixel value (relative to axis start)
     */
    relativeArrowPosition : {
      init: "left",
      nullable: true
    },

    /** optional reference to widget that triggers show/hide of this overlay */
    trigger : {
      check: "unify.ui.core.Widget",
      init: null,
      nullable: true
    },

     /** optional strategy to ponsition overlay relative to trigger
      * must be a map containing a value for x and y axis
      * the value can be "left,right,center,top,bottom, a percentage of the axis size or a pixel value (relative to axis start)
      */
    relativeTriggerPosition : {
      init: {x:"bottom",y:"center"},
      nullable: true
    }

  },

  
  /**
   * @param noArrow {Boolean?} set to true if overlay should not have an arrow element
   */
  construct : function(noArrow) {
    this.base(arguments, new unify.ui.layout.special.OverlayLayout());
    
    this._showChildControl("container");
    this.setHasArrow(!noArrow);//applyHasArrow creates the arrow if required
  },
  
  members : {

    /**
     * Gets inner content container
     *
     * @return {unify.ui.core.Widget} Content widget
     */
    getChildrenContainer : function() {
      return this.getChildControl("container");
    },

    /**
     * Returns child control widget identified by id
     *
     * @param id {String} ID of child widget
     * @return {unify.ui.core.Widget} Content widget
     */
    _createChildControlImpl : function(id) {
      var control;
      
      if (id == "arrow") {
        control = new unify.ui.other.Arrow();
        this._addAt(control, 1, {
          type: "arrow"
        });
      } else if (id == "container") {
        control = new unify.ui.container.Composite(new unify.ui.layout.Canvas());
        this._addAt(control, 0);
      }
      
      return control || this.base(arguments, id);
    },

    /**
     * shows/hides the arrow element depending on value
     * @param value {Boolean} new hasArrow value
     */
    __applyHasArrow : function(value) {
      if (value) {
        this._showChildControl("arrow");
      } else {
        this._excludeChildControl("arrow");
      }
    },
    //overridden, calculate overlaysize as content size + arrow size depending on arrow direction
    _computeSizeHint: function(){
      var hint=this.getChildrenContainer().getSizeHint();
      if(this.getHasArrow()){
        var arrow=this.getChildControl("arrow");
        var arrowHint=arrow.getSizeHint();
        var direction=arrow.getDirection();
        if(direction=="left"||direction=="right"){
          hint.width+=arrowHint.width;
        } else if(direction=="top"||direction=="bottom"){
          hint.height+=arrowHint.height;
        }
      }
      return hint;
    },
    
    /**
     * Calculates a position hint to align overlay to trigger widget
     *
     * if the overlay has an arrow, the arrows pointing edge is used as reference
     */
    __getPositionHint : function() {
      qx.ui.core.queue.Manager.flush();//make sure appearance is applied
      var left = 0;
      var top = 0;
      var trigger=this.getTrigger();
      var relativeTriggerPosition=this.getRelativeTriggerPosition();

      if(trigger && relativeTriggerPosition){
        var triggerPoint=this.__resolveRelative(trigger.getPositionInfo(),relativeTriggerPosition);
        left = triggerPoint.left;
        top=triggerPoint.top;
      }
      var arrow=this.getChildControl("arrow");
      if(arrow){
        var thisSize=this.getSizeHint();
        var arrowPosition=this.calculateArrowPosition(thisSize.height,thisSize.width);

        left-=arrowPosition.left;
        top-=arrowPosition.top;
        var arrowDirection=arrow.getDirection();

        //now account for arrow pointing edge offset
        //TODO at the moment we assume the pointing edge is in the middle, refactor into arrow class to allow arbitraty points
        var arrowSize=arrow.getSizeHint();
        if(arrowDirection=="left"||arrowDirection=="right"){
          top-=Math.round(arrowSize.height/2);
        } else if (arrowDirection=="bottom"||arrowDirection=="top"){
          left-=Math.round(arrowSize.width/2);
        }
      }


      return {
        left: left,
        top: top
      };
    },

    /**
     * calculate the left/top position of the arrow element on the overlay .
     *
     * this function is used by the layout and by __getPositionHint
     * @param height {Number} height of the overlay content
     * @param width {Number} width of the overlay content
     */
    calculateArrowPosition : function(height,width){
      var GAP = 6;//TODO use border width +1?
      var arrow = this.getChildControl("arrow");
      var arrowLeft=0;
      var arrowTop=0;

      if(arrow)
      var arrowWidth=arrow.getWidth();
      var arrowHeight=arrow.getHeight();
      var arrowDirection=arrow.getDirection();
      var arrowPosition=this.getRelativeArrowPosition();
      var relativeOffset=this.__toPixelValue(height,arrowPosition);
      if(arrowDirection=="left" || arrowDirection=="right"){
        if(arrowPosition=="top"){
          arrowTop=GAP;
        } else if(arrowPosition=="bottom"){
          arrowTop = height - arrowHeight - GAP;
        } else if(arrowPosition=="center"){
          arrowTop = Math.round(height / 2 - arrowHeight/2);
        } else {
          arrowTop = relativeOffset - Math.round(arrowHeight/2);
        }
      } else if (arrowDirection=="top" || arrowDirection=="bottom"){
        if(arrowPosition=="left"){
          arrowLeft=GAP;
        } else if(arrowPosition=="right"){
          arrowLeft = width - arrowWidth - GAP;
        } else if(arrowPosition=="center"){
          arrowLeft = Math.round(width / 2 - arrowWidth/2);
        } else {
          arrowLeft = relativeOffset - Math.round(arrowWidth/2);
        }
      }
      return {
        left: arrowLeft,
        top: arrowTop
      }
    },

    /**
     * helper function that calculates the absolute position values of a relativePos in elemPos
     * @param elemPos {Object}  a map containing the elements current position and dimensions (top,left,width,height)
     * @param relativePos {Object} a map containing relative position values as keys x and y e.g. {x:"center",y:"bottom"}
     */
    __resolveRelative: function(elemPos,relativePos){
      return {
        top: (elemPos.top||0)+this.__toPixelValue(elemPos.height,relativePos.x),
        left:(elemPos.left||0)+this.__toPixelValue(elemPos.width,relativePos.y)
      }
    },

    __toPixelValue : function(baseSize,value){
      if(value=="left" || value == "top"){
        return 0;
      } else if (value == "center"){
        return Math.round(baseSize/2);
      } else if (value=="right" || value == "bottom"){
        return baseSize;
      } else if(typeof value == "string"){
        if(value.substring(value.length-1)=="%"){
          return Math.round(baseSize*(parseInt(value,10)/100));
        } else if(value.substring(value.length-2)=="px"){
          return parseInt(value,10);
        } else {
          //value is a string but cannot be parsed
          this.error("invalid relative value: "+value);
          return 0;
        }
      } else if(typeof value == "number") {
        return value;
      }
    },
    
    /**
     * Shows overlay
     */
    show : function() {
      this.base(arguments);
      var posHint = this.__getPositionHint();
      this.getLayoutParent().add(this, posHint);
      this.fireEvent("shown");
    },
    
    /**
     * Hides overlay
     */
    hide : function() {
      this.base(arguments);
      this.fireEvent("hidden");
    }
  }
});