
UI.components.ContextHelp = {
	createNew: function(n) {
		var obj = {};
		var $node = n;
		obj.onEvent = function(signal,sender) {
			var $contextHelp;
			if (signal=='tab-switch') {
				$contextHelp = sender.getPanes()[0].find('.tab.active[data-contexthelp]');
				setTimeout(function(){ $node.attr('ready','yes'); },10);
			}
			else if (signal=='panel-switch') {
				var targetId = sender.getPane().attr('id');
				$contextHelp = $('[data-target='+targetId+']').filter('[data-contexthelp]:first');
				setTimeout(function(){ $node.attr('ready','yes'); },10);
			}
			if ($contextHelp.size()>0) {
				var helpText = $contextHelp.attr('data-contexthelp');
				if (helpText.trim) helpText = helpText.trim();
				var helpTextParts = helpText.split('|');
				$node.find('.body').html(helpTextParts[1]);
				$node.find('.subjectline').html(helpTextParts[0]);
				$node.show();
			}
			else {
				if ($node.attr('ready','yes')) $node.removeAttr('ready');
				$node.hide();
			}
		}
		obj.init = function() {
			var nc = UI.components.NotificationCenter.getInstance();
			nc.listenFor('panel-switch',obj);
			nc.listenFor('tab-switch',obj);
		}
		return obj;
	}
}