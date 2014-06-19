(function (appid, options) {
	if (document.getElementById(appid))
	    return;

	if (!document.head)
	    document.documentElement.appendChild(document.createElement('head'));

	options = options || {}
	var jqhost = options.jqhost || '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'

	var embed = function ($, uninject) {
		var dimmed = [];
		var dim = function () {
	        $('body').children().each(function (i, e) {
	            var oo = $(e).css('opacity') || 1
	            dimmed.push({ jqe: $(e), op: oo })
	            $(e).css('opacity', oo * options.opacity || .2)
	        })
	    }

		var undim = function () {
			for (var i = 0; i < dimmed.length; i++) {
				dimmed[i].jqe.css('opacity', dimmed[i].op)
			}
		}

	    dim()
	    var jqc = $(options.content)
	    $('body').append(jqc)

		var unembed = function() {
			jqc.remove()
			undim()
			uninject()
		}

	    if (options.onembed) try { options.onembed($, unembed) } catch(e) { }
	}

	var inject = function (retried) {
		var jq = document.createElement('script')
		jq.setAttribute('src', jqhost)
		jq.setAttribute('id', appid)
		jq.onload = function () {
			try {
				jQuery.noConflict()
				jQuery(document).ready(function ($) {
					var uninject = function() {
						$('#'+appid).remove();
					}

					if (options.oninject) try { options.oninject($, uninject) } catch(e) { }
					if (options.content) embed($, uninject)
				});
			}
			catch(e) {
				if (!retried) 
					inject(true)
			}
		}
		document.head.appendChild(jq)
	}

	inject()
})(
	'569af2a32a544bfd8a0532f556f74098', 
	{ 
		'content' : '<div id="obchat" style="position: fixed; right: 10px; bottom: 10px; z-index: 9999; width: 300px; background-color:black; color: white; margin:10px; padding: 6px;"> \
			<hr/><span><h1 style="color:white; font-family: sans-serif; font-size: 18px; display:inline; float: right; cursor:default">x</h1></span><hr style="clear:both;"/> \
			<div><input style="width:280px" /></div><hr/><div id="chats"></div><hr/>', 
		'oninject' : function($, uninject) { console.log('inject') },
		'onembed' : function($, unembed) { 
			console.log('embed') 
			$('#obchat h1')[0].addEventListener("click", function () {
            	unembed();
        	}, false);
		}
	}
);