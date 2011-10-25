/**
 * Rococo2 Component Class: ActionButton
 * Defines default behaviours for an action button.
 */
UI.components.ActionButton = {
		createNew: function() {
			var obj = {};
			var jsonData = {};
			obj.getJsonData = function() {
				return jsonData;
			}
			obj.init = function() {
				obj.$node.unbind().click(function(){
					//Buttons can have a warning popup
					if (obj.$node.attr("data-warning")) {
						return UI.components.Dialog.show(obj.$node.attr("data-warning"),obj.$node);
					}
					if (obj.$node.attr("data-oldwarning")) {
						obj.$node.attr("data-warning", obj.$node.attr("data-oldwarning"));
						obj.$node.removeAttr("data-oldwarning");
					}
					//If delegate then call action on delegate
					if (obj.delegate)	obj.delegate[obj._get('action')](obj);
					//If connect, then execute server request
					var conn = obj._get('connect');
					if (conn) {
						var dataForSending = null;
						//Do we need to send along some data?
						var dataToSend = obj._get('form');
						if (dataToSend) {
							var $forms = $(dataToSend);
							//Bail out if form does not validate
							if (!$forms.valid(true)) return;
							dataForSending = $forms.serializeArray();
						}

						$.post(conn,dataForSending,function(d){
							var d = $.parseJSON(d);
							if (d) {
								jsonData = d;
								if (d.status && d.message) {
									notification(d.status,d.message);
								}
								if (d.status=='success') {
									var successTarget = obj._get('successtarget');
									if (successTarget) {
										if (UI.components.Panel && UI.components.Panel.panels) UI.components.Panel.panels[successTarget].activate();
										if (UI.Panel && UI.Panel.panels) UI.Panel.panels[successTarget].activate(); //legacy -- remove this one when no longer using RC1
									}
								}
							}
						});

					}
				});
			}
			return obj;
		}
}