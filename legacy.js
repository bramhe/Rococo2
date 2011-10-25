
Legacy = {
	/**
	 * Namespace reserved for delegate instances
	 */
	references : {	},
	/**
	 * Namespace reserved for classes
	 */
	classes: {	},
	/**
	 * Namespace reserved for UI-scoped function definitions
	 */
	functions: {
		noNAN : function(n) {
			var out = 0;
			if (isNaN(n) || n < 0) n = 0;
			return n;
		}
	},
	/**
	 * Namespace reserved for everything else
	 */
	xchng: {	},
	/**
	 * Generic init code for UI
	 */
	init: function() {	},
	/**
	 * Tools, collection of simple tools for UI development
	 */
	tools: {
		/**
		 * Tool UI Init, preselect for selectboxes
		 */
		initUI:function(){
			$("[preselect]").each(function(){ $(this).val($(this).attr("preselect")); });
		},
		/**
		 * Find the base component of a node
		 *
		 * @param $startNode
		 * @param compID
		 */
		findComponent: function($startNode, compID) {
			var $comp = $startNode.parents("#"+compID);
			if ($comp.size()>0) return $comp;
			$relation = $startNode.parents("[data-belongsto]");
			if ($relation.size()<1) return null;
			var belongs = $relation.attr("data-belongsto");
			var $comp = $("#"+belongs);
			if ($comp.size()>0) return $comp;
			return null;
		},
		/**
		 * Simple Translation function
		 * @param word
		 * @param language
		 */
		translate: function(word, language) {
			var key = word.toLowerCase();
			if (!UI.dictionary[language]) return word;
			if (!UI.dictionary[language][key]) return word;
			return UI.dictionary[language][key];
		},
		instances: {
		}
	},
	/**
	 * Namespace reserved for dictionaries
	 */
	dictionary: {
		"nl_nl": {
		},
		"us_en": {
		}
	},
	/**
	 * Class Todo
	 * Represents a todo list
	 * A todo list is a very useful class that can be used to postpone actions.
	 */
	Todo: {
		/**
		 * Static property tasks, contains tasks in the todo list.
		 */
		tasks: {},
		/**
		 * Adds a task to the todo list
		 * @param n name of the list
		 * @param t function to add to the list
		 */
		add: function(n,t){ UI.Todo.tasks[n].push(t); },
		/**
		 * Runs item n in the todo list
		 * @param n
		 */
		run: function(n){ for(var i in UI.Todo.tasks[n]){ UI.Todo.tasks[n][i]() } UI.Todo.create(n); },
		/**
		 * Creates a new list
		 * @param n
		 */
		create: function(n){ UI.Todo.tasks[n]=[]; }
	},
	/**
	 * Date picker
	 */
	DatePicker : {
		/**
		 * Applies the datapicker (standard jQuery Date picker plugin)
		 */
		applyDatePickers: function() { if (!$.datepicker) return;
			$("input.date").each(function() {
				
				var minDate = new Date($(this).attr('data-minDate'));
				
				$(this).datepicker({
					"dateFormat":"yy-mm-dd",
					"minDate": minDate,
					"buttonImage":"/static/source/shared/img/calendar.gif",
			 		showOn: "button",
					buttonImageOnly: true
				});
			});
		}
	},
	/**
	 * Logger, can be used to log information about
	 * script execution and errors. Also makes sure console.log - will
	 * not cause problems in browsers that do not support the console feature.
	 */
	Logger: {
		initLogger: function(){
			if (window.console && window.console.log) return;
			console = { 
				logs:[],
				log: function(msg){ 
					console.logs.push(msg);
					
				}
			}
		}	
	
	},
	
	UIObject: {
		
		createNew: function( bundle ) {
			
			var obj = {};
			var protected = bundle;
			protected.delegate = null;
			
			protected.delegateID = protected.$targetNode.attr("data-delegate");
			if (UI.references[protected.delegateID]) {
				protected.delegate = UI.references[protected.delegateID];
			}
			
			protected.callDelegate = function( method, args ) { 
				if (protected.delegate && protected.delegate[method]) {
					return protected.delegate[method].apply(protected.delegate,args);
				}
				else {
					return null;
				}
			}
			
			return obj;
		}
		
	},
	
	Component: {
		
		createNew: function( bundle ) {
			
			var obj = UI.UIObject.createNew( bundle );
			var protected = bundle;
			
			if (protected.$targetNode.attr("data-config")) {
				protected.config = protected.$targetNode.attr("data-config").toString().split(",");
			}
			else {
				protected.config = [];
			}
			

			
			obj.hasConfig = function( item ) {
				for(var i in protected.config) {
					
					if (protected.config[i]==item) return true;
				}
				return false;
			}
			
			return obj;
			
		}
		
	},
	
	/**
	 * Represents the server
	 */
	Server: {
		/**
		 * Namespace for instances of Server
		 */
		instances: {},
		/**
		 * Creates a new server. Just like anything else a server is connected
		 * to a node.
		 * @param $node
		 */
		createNew: function($node){
			var obj = {};
			var $targetNode = $node;
			if ($targetNode.attr("id")) UI.Server.instances[ $targetNode.attr("id") ] = obj;
			return obj;
		},
		/**
		 * Applies servers
		 */
		applyServers: function() {
			$(".server").each(function(){
				UI.Server.createNew( $(this) );
			});

			$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError){
				if (UI.Server.flags.userAbort) { UI.Server.flags.userAbort=0; return; }
				notification("error","Request has failed. Try again or call support.");
				$("#spinner").remove();
				UI.Server.flags.busy = 0;
			});
			$(document).ajaxSend(function(e, jqxhr, settings){
				//if (UI.Server.flags.busy) {
				//	jqxhr.abort();alert(1);
			//		return false;
				//}

				UI.Server.flags.busy = 1;
				UI.Server.flags.timer = setTimeout(function(){
					if ($("#spinner").size()==0 && UI.Server.flags.busy) $("body").append("<img id='spinner' style='position:fixed;left:50%;top:45%' src='/static/source/shared/img/spinner.gif?123'>");
					
				},500);
			});
			$(document).ajaxComplete(function(e,xhr){


				UI.Server.flags.busy = 0;
				$("#spinner").remove();
			});
			$(document).ajaxSuccess(function(e,xhr){
				UI.Server.flags.busy = 0;
				$("#spinner").remove();
				if (xhr.responseText.indexOf('<!DOCTYPE')===0) {
					//loading HTML tag? that cannot be good.
					document.location.href='/';
				}
			});
		},
		
		flags: { userAbort:0,busy:0,timer:0 }
		
	},

	applyFixedFormats: function(){
		$(".fixformat2dec").each(function(){
			if ($(this).attr("data-processed")=="yes") return;
			$(this).attr("data-processed","yes");
			$(this).change(function(){
				var cellValue = $(this).val();
				cellValue = cellValue.toString().replace(",",".");
				var v = parseFloat( cellValue,10 );
				if (v==NaN) {
					v=0;
				}
				var newVal = v.toFixed(2);
				if (isNaN(newVal)) newVal = 0;
				$(this).val(newVal);
			});
		});
	}
};


for(var i in Legacy) {
	UI[i] = Legacy[i];
}

