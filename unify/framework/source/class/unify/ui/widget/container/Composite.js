/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Generic composite container widget
 */
qx.Class.define("unify.ui.widget.container.Composite", {
  extend : unify.ui.widget.core.Widget,
  
  include : [
    qx.ui.core.MChildrenHandling,
    qx.ui.core.MLayoutHandling
  ],
  
  construct : function(layout) {
    this.base(arguments);
    
    if (layout) {
      this._setLayout(layout);
    }
  },
  
  members : {
    _createElement : function() {
      return document.createElement("div");
    }
  },
  
  defer : function(statics, members) {
    qx.ui.core.MLayoutHandling.remap(members);
    qx.ui.core.MChildrenHandling.remap(members);
  }
});
