
UI.components.ContextHelp = {

	createNew: function(n) {

		var obj = {};
		var $node = n;

		obj.init = function(){
			$('body').click(function(e){
				$target = $(e.target);
				if (!$target.is('a') && !$target.is('.tab')) return;
				var $contextHelp = null;
				if ($target.attr('data-contexthelp')) {
					$contextHelp = $target;
				}
				else {
					$contextHelp = $target.parents('[data-contexthelp]');
				}
				if ($contextHelp.attr('data-contexthelp')) {
					var helpText = $contextHelp.attr('data-contexthelp');
					if (helpText.trim) helpText = helpText.trim();
					var helpTextParts = helpText.split('|');
					$node.find('.body').html(helpTextParts[1]);
					$node.find('.subjectline').html(helpTextParts[0]);
					$node.show();
				}
				else {
					$node.hide();
				}
			});
			var d = obj._get('default');
			if (d) {
				var $contextHelp = $('#'+d);
				if ($contextHelp) {
					if ($contextHelp.attr('data-contexthelp')) {
						var helpText = $contextHelp.attr('data-contexthelp');
						if (helpText.trim) helpText = helpText.trim();
						var helpTextParts = helpText.split('|');
						$node.find('.body').html(helpTextParts[1]);
						$node.find('.subjectline').html(helpTextParts[0]);
					}
					else {
						$node.hide();
					}
				}
			}
		}
		return obj;
	}
	
}