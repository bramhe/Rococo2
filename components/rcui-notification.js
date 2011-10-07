
UI.components.NotificationCenter = {
	getInstance: function(){
		var _createNew = function() {
			var signalMap = {};
			var obj = {};
			obj.signal = function( signal, sender ) {
				var listeners = signalMap[signal];
				for(var i in listeners) {
					listeners[i].onEvent( signal, sender );
				}
			}
			obj.listenFor = function( signal, listener ) {
				if (!signalMap[signal]) {
					signalMap[signal] = [];
				}
				signalMap[signal].push(listener);
			}
			return obj;
		}
		if (!UI.components.NotificationCenter.inst)	{
			UI.components.NotificationCenter.inst = _createNew();
		}
		return UI.components.NotificationCenter.inst;
	}
}