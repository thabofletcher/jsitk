(function (appid, options) {
	if (document.getElementById(appid))
	    return;

	if (!document.head)
	    document.documentElement.appendChild(document.createElement('head'));

	options = options || {}
	var jqhost = options.jqhost || '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'

	var require = function(scripts, callback) {
        var count = 0;
        var total = scripts.length

    	var loaded = function() {
    		count++;
    		if (count == total)
    			callback()
    	}

        var loadscr = function(src) {
	        var scr = document.createElement('script')
	        scr.async = true
	        scr.src = src
	        scr.addEventListener('load', loaded, false)
	        document.head.appendChild(scr)
	    }

        for (var i = 0; i < total; i++) {
            loadscr(scripts[i])
        }
    }

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

	    if (options.onembed) try { options.onembed($, require, unembed) } catch(e) { }
	}

	var inject = function (retried) {
		var jq = document.createElement('script')
		jq.setAttribute('src', jqhost)
		jq.setAttribute('id', appid)
		jq.onload = function () {
			try {
				jQuery.noConflict()
				jQuery(document).ready(function ($) {
					var uninject = function() {	$('#'+appid).remove() }

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
})();