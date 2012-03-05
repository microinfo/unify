/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Wrapper for qooxdoo layout class
 */
core.Class("unify.ui.layout.VBox", {
  include : [unify.ui.layout.Base],
  
  properties : {
    alignX: {
      init: "left"
    },
    alignY: {
      init: "top"
    },
    spacing : {}
  },
  
  members : {
    __childrenCache : null,
    
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var top = 0;
      var hasFlex = this.__hasFlex;
      var hasNoFlex = this.__hasNoFlex;
      var sizeCache = this.__sizeCache;
      var cache = this.__childrenCache;
      var i, ii;
      
      if (hasFlex.length > 0) {
        var overallFlex = this.__overallFlex;
        var usedNoFlexHeight = 0;
        var e;
        
        for (i=0,ii=hasNoFlex.length; i<ii; i++) {
          e = sizeCache[hasNoFlex[i]];
          console.log("NO FLEX: ", e.widget.constructor);
          e.size.height = e.size.minHeight;
          usedNoFlexHeight += e.size.height;
        }
        
        var flexUnit = (availHeight - usedNoFlexHeight) / overallFlex;
        
        for (i=0,ii=hasFlex.length; i<ii; i++) {
          e = sizeCache[hasFlex[i]];
          
          e.size.height = Math.round(flexUnit * e.flex);
          console.log("VBOX ", hasFlex.length, overallFlex, e.size.height);
        }
      }
      
      for (i=0,ii=cache.length; i<ii; i++) {
        var element = sizeCache[i];
        var widget = element.widget;
        var calc = element.properties;
        var size = element.size;
        
        var alignX = widget.getAlignX();
        var left;
        var width = availWidth;
        var height = size.height;
        console.log(widget.constructor, size.width, size.maxWidth, widget.getAllowGrowX());
        if (size.maxWidth && width > size.maxWidth) {
          width = size.maxWidth;
        }
        
        if (alignX == "left") {
          left = 0;
        } else if (alignX == "center") {
          left = Math.round(availWidth / 2 - width / 2);
        } else {
          left = availWidth - width;
        }
        
        var topGap = unify.ui.layout.Util.calculateTopGap(widget);
        var bottomGap = unify.ui.layout.Util.calculateBottomGap(widget);
        
        top += topGap;
        widget.renderLayout(left, top, width, height);
        
        top += height + bottomGap;
      }
    },
    
    _computeSizeHint : function() {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var cache = this.__childrenCache;
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
      }
      
      return null;
    },
    
    __rebuildChildrenCache : function() {
      var children = this.__childrenCache = this._getLayoutChildren();
      var flex = this.__hasFlex = [];
      var noFlex = this.__hasNoFlex = [];
      var sizes = this.__sizeCache = [];
      var overallFlex = 0;
      
      for (var i=0,ii=children.length; i<ii; i++) {
        var child = children[i];
        var props = child.getLayoutProperties();

        var flexState = props.flex;
        if (flexState) {
          flex.push(i);
          overallFlex += flexState;
          sizes.push({widget: child, properties: props, flex: flexState, size: child.getSizeHint()});
        } else {
          noFlex.push(i);
          sizes.push({widget: child, properties: props, flex: false, size: child.getSizeHint()});
        }
      }
      
      this.__overallFlex = overallFlex;
    }
  }
});