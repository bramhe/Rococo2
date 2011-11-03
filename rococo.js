

//Rococo JS Framework
UI = {
	instances:{},components:{},classes:{},references:{},logs:[],CMPID:0,instancesByComp:{},
	awake:function($n){
		$n.find('.awakable').each(function(){
			var comp = $(this).attr('data-awake');
			if (!comp) throw('Invalid component ID');
			var c = UI.components[comp].createNew( $(this) );
			if (!c) throw('Invalid createNew() function on '+comp+', should return object! ');
			c.$node = $(this);
			c.$nodes = $(this).add( $(".connected[data-belongsto\"="+$(this).attr("id")+"\"]") );
			var cfg = [];
			c.$nodes.each(function(){
				if ($(this).attr('data-config')) {
					var addCfg = $(this).attr('data-config').split(',');
					for(var j in addCfg) {
						cfg.push(addCfg[j]);
					}
				}
				c.config = cfg;	
			});
			
			var compID = 'CMPID'+(++UI.CMPID);
			if ($(this).attr('id')) {
				compID = $(this).attr('id');
			}
			UI.instances[compID] = c;
			if (!UI.instancesByComp[comp]) UI.instancesByComp[comp] = [];
			UI.instancesByComp[comp][compID] = c;
			
			c.delegate = UI.references[$(this).attr('data-delegate')];
			if (c.delegate) c.delegate.component = c;
			
			c._get = function( p){
				return c.$node.attr('data-'+p);
			}
			c._getI = function( p) {
				return UI.instances[ c._get( p) ];
			}
			c._d = function( f){
				if (c.delegate && c.delegate[f]) {
					return c.delegate[f];	
				}
				else {
					return new Function();
				}
			}
			if (c.init) {
				c.init();
			}
			$(this).removeClass('awakable');
		});
	}	
}

$(document).ready(function(){
	UI.awake($('body'));
});