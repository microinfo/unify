/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/** 
 * #asset(unify/android/halo/textfield-underline.png)
 * #asset(unify/android/halo/textfield-underline-gray.png)
 * #asset(unify/android/halo/button-focused.png)
 * #asset(unify/android/halo/button-pressed.png)
 * #asset(unify/android/halo/button-normal.png)
 */

(function() {

	var BU = 4;

	core.Class("unify.theme.AndroidHaloDark", {
		include : [unify.theme.Theme],
		
		construct : function() {
			unify.theme.Theme.call(this, {
				name : "unify.AndroidHaloDark",
				
				include : new unify.theme.Base(),
				
				colors: {
					"android_bg_black" : "#000000",
					"android_bg_gray"  : "#272C33",
					"android_bg_darkgray" : "#3D3D3D",
					"android_bg_highlight" : "rgb(44, 159, 201)",
					"android_bg_focus" : "rgba(44, 159, 201, 0.5)",
					"android_section_border" : "#393939",
					"android_head_text" : "#B9B9B9",
					"android_text" : "#FFFFFF",
					"android_text_mute": "#393939",
					"transparent": "transparent"
				},
				fonts: {
				},
				styles: {
					"view" : {
						style : function() {
							return {
								background: "none"
							};
						}
					},
					
					"viewmanager" : {
						style : function() {
							return {
								backgroundImage: unify.bom.Gradient.createGradient({
									colorStops: [
										{position: 0, color: unify.theme.Manager.get().resolveColor("android_bg_black")}, 
										{position: 1, color: unify.theme.Manager.get().resolveColor("android_bg_gray")}
									]
								})
							}
						}
					},
					
					"label" : {
						style : function() {
							return {
								marginTop: BU + "px",
								marginBottom: BU + "px",
								marginLeft: (BU * 4 - 2) + "px",
								marginRight: (BU * 4 - 2) + "px",
								paddingTop: "8px",
								color: "android_head_text"
							};
						}
					},
					
					"label_section" : {
						include : "label",
						style : function() {
							return {
								color: "android_head_text",
								height: (BU * 8) + "px",
								marginTop: (BU * 4) + "px",
								marginLeft: (BU * 4 - 2) + "px",
								marginRight: (BU * 4 - 2) + "px",
								paddingLeft: "8px",
								paddingTop: "6px",
								borderBottom: "2px solid",
								borderColor: "android_section_border"
							};
						}
					},
					
					"input" : {
						style : function(state) {
							var url;
							var color;
							
							if (state.active) {
								url = jasy.Asset.toUri("unify/android/halo/textfield-underline.png");
							} else {
								url = jasy.Asset.toUri("unify/android/halo/textfield-underline-gray.png");
							}
							
							if (state.placeholder) {
									color = "android_text_mute";
							} else {
									color = "android_text";
							}
							
							return {
								color: color,
								background: "none",
								borderBottom: "5px",
								borderLeft: "2px",
								borderTop: "0px",
								borderRight: "2px",
								borderColor: "transparent",
								borderImage: "url("+url+") 0 2 5 2",
								marginTop: BU + "px",
								marginBottom: BU + "px",
								marginLeft: (BU * 4 - 2) + "px",
								marginRight: (BU * 4 - 2) + "px",
								height: (BU * 10) + "px",
								paddingLeft: "7px"
							};
						}
					},
					
					/**
					 * #asset(unify/android/halo/radio-*)
					 */
					"radio" : {
						style : function(state) {
							var imagename = ["radio"];
							
							if (state.checked) {
								imagename.push("checked");
							} else {
								imagename.push("unchecked");
							}
							
							if (state.disable) {
								imagename.push("disabled");
							}
							
							if (state.pressed && (!state.disable)) {
								imagename.push("pressed");
							} else if (state.active)  {
								imagename.push("focused");
							}
							
							var url = "unify/android/halo/" + imagename.join("-") + ".png";
							
							return {
								properties : {
									image: url
								}
							};
						}
					},
					
					"radio/image" : {
						style : function() {
							return {
								width: 34,
								height: 34
							}
						}
					},
					
					"radio/label" : {
						include: "label",
						style : function() {
							return {
								marginLeft: "0px",
								paddingTop: "0px",
								color: "android_head_text"
							};
						}
					},
					
					"button" : {
						style : function(state) {
							var url, backgroundColor;
							
							if (state.pressed) {
								backgroundColor = "android_bg_highlight";
								url = jasy.Asset.toUri("unify/android/halo/button-pressed.png");
							} else if (state.active || state.hover) {
								backgroundColor = "android_bg_focus";
								url = jasy.Asset.toUri("unify/android/halo/button-focused.png");
							} else {
								backgroundColor = "android_bg_darkgray";
								url = jasy.Asset.toUri("unify/android/halo/button-normal.png");
							}
							
							return {
								borderTop: "6px",
								borderRight: "6px",
								borderBottom: "6px",
								borderLeft: "6px",
								borderImage: "url("+url+") 6",
								backgroundColor: backgroundColor,
								backgroundImage: "none",
								backgroundClip: "padding-box",
								marginTop: BU + "px",
								marginBottom: BU + "px",
								marginLeft: (BU * 4 - 6) + "px",
								marginRight: (BU * 4 - 6) + "px",
								height: (BU * 10) + "px"
							};
						}
					},
					
					"button/label" : {
						style : function() {
							return {
								paddingTop: "2px",
								font: "default"
							};
						}
					},
					
					"navigationbar/parent" : {
						style : function() {
							return {
								backgroundColor: "android_bg_highlight"
							};
						}
					}
				}
			});
		}
	});

})();