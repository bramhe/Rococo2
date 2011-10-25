/**
 * Rococo2 Component Class: Dialog
 * Defines default behaviours for a modal dialog.
 */
UI.components.Dialog = {
		show: function( ID, node ) { 
			var $callNode = $(node);
			var $dialog = $("#"+ID).clone();
			$("body").append($dialog);
			$dialog.show();
			$dialog.find("[data-means=no]").click(function(){ $dialog.hide(); });
			$dialog.find("[data-means=yes]").click(function(){
				$dialog.hide();
				$callNode.attr("data-oldwarning", $callNode.attr("data-warning"));
				$callNode.removeAttr("data-warning");
				$callNode.click();
		});
	}
}