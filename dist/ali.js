/*!
 * --------------------------------------------------------------------------
 * Ali - Accessible Learning Interactions (
 * Copyright 2016 Jer Brand / Irresponsible Art
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
window.ali = {
    EVENT : {
        ready : 'ali:ready',
        complete : 'ali:complete'
    },

    STATUS : {
        complete : 'complete',
        correct : 'correct',
        incorrect : 'incorrect',
        unanticipated : 'unanticipated',
        incomplete : 'incomplete'
    },

    TYPE : {
        choice : 'choice',
        performance : 'performance',
        sequencing : 'sequencing',
        numeric : 'numeric',
        shortAnswer : 'fill-in',
        longAnswer : 'long-fill-in',
        other : 'other'
    },
    Interaction : null,
    transitionEnd : 'bsTransitionEnd aliTransitionEnd'
};

jQuery(function ($) {
    "use strict";
    if (window.ali_AutolInit !== false) {
        $('[data-ali="card"]').card();
        $('[data-ali="accordion"]').accordion();
        $('[data-ali="tab-control"]').tabcontrol();
        $('[data-ali="answer-set"]').answerset();
        $('[data-ali="multiple-choice"]').multiplechoice();
        $('[data-ali="ordered-items"]').ordereditems();
        $('[data-ali="thinking-question"]').thinkingquestion();
        $('[data-ali="card-carousel"]').cardcarousel();
    } 
});
;

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
(function defineMustache(global,factory){if(typeof exports==="object"&&exports&&typeof exports.nodeName!=="string"){factory(exports)}else if(typeof define==="function"&&define.amd){define(["exports"],factory)}else{global.Mustache={};factory(global.Mustache)}})(this,function mustacheFactory(mustache){var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)==="[object Array]"};function isFunction(object){return typeof object==="function"}function typeStr(obj){return isArray(obj)?"array":typeof obj}function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function hasProperty(obj,propName){return obj!=null&&typeof obj==="object"&&propName in obj}var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string)}var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string)}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};function escapeHtml(string){return String(string).replace(/[&<>"'`=\/]/g,function fromEntityMap(s){return entityMap[s]})}var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)return[];var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)delete tokens[spaces.pop()]}else{spaces=[]}hasTag=false;nonSpace=false}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile==="string")tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)throw new Error("Invalid tags: "+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+"\\s*");closingTagRe=new RegExp("\\s*"+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp("\\s*"+escapeRegExp("}"+tagsToCompile[1]))}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length)}else{nonSpace=true}tokens.push(["text",chr,start,start+1]);start+=1;if(chr==="\n")stripSpace()}}if(!scanner.scan(openingTagRe))break;hasTag=true;type=scanner.scan(tagRe)||"name";scanner.scan(whiteRe);if(type==="="){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe)}else if(type==="{"){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type="&"}else{value=scanner.scanUntil(closingTagRe)}if(!scanner.scan(closingTagRe))throw new Error("Unclosed tag at "+scanner.pos);token=[type,value,start,scanner.pos];tokens.push(token);if(type==="#"||type==="^"){sections.push(token)}else if(type==="/"){openSection=sections.pop();if(!openSection)throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section "'+openSection[1]+'" at '+start)}else if(type==="name"||type==="{"||type==="&"){nonSpace=true}else if(type==="="){compileTags(value)}}openSection=sections.pop();if(openSection)throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens))}function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==="text"&&lastToken&&lastToken[0]==="text"){lastToken[1]+=token[1];lastToken[3]=token[3]}else{squashedTokens.push(token);lastToken=token}}}return squashedTokens}function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case"#":case"^":collector.push(token);sections.push(token);collector=token[4]=[];break;case"/":section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token)}}return nestedTokens}function Scanner(string){this.string=string;this.tail=string;this.pos=0}Scanner.prototype.eos=function eos(){return this.tail===""};Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)return"";var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string};Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail="";break;case 0:match="";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index)}this.pos+=match.length;return match};function Context(view,parentContext){this.view=view;this.cache={".":this.view};this.parent=parentContext}Context.prototype.push=function push(view){return new Context(view,this)};Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name]}else{var context=this,names,index,lookupHit=false;while(context){if(name.indexOf(".")>0){value=context.view;names=name.split(".");index=0;while(value!=null&&index<names.length){if(index===names.length-1)lookupHit=hasProperty(value,names[index]);value=value[names[index++]]}}else{value=context.view[name];lookupHit=hasProperty(context.view,name)}if(lookupHit)break;context=context.parent}cache[name]=value}if(isFunction(value))value=value.call(this.view);return value};function Writer(){this.cache={}}Writer.prototype.clearCache=function clearCache(){this.cache={}};Writer.prototype.parse=function parse(template,tags){var cache=this.cache;var tokens=cache[template];if(tokens==null)tokens=cache[template]=parseTemplate(template,tags);return tokens};Writer.prototype.render=function render(template,view,partials){var tokens=this.parse(template);var context=view instanceof Context?view:new Context(view);return this.renderTokens(tokens,context,partials,template)};Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate){var buffer="";var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==="#")value=this.renderSection(token,context,partials,originalTemplate);else if(symbol==="^")value=this.renderInverted(token,context,partials,originalTemplate);else if(symbol===">")value=this.renderPartial(token,context,partials,originalTemplate);else if(symbol==="&")value=this.unescapedValue(token,context);else if(symbol==="name")value=this.escapedValue(token,context);else if(symbol==="text")value=this.rawValue(token);if(value!==undefined)buffer+=value}return buffer};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate){var self=this;var buffer="";var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials)}if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate)}}else if(typeof value==="object"||typeof value==="string"||typeof value==="number"){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate)}else if(isFunction(value)){if(typeof originalTemplate!=="string")throw new Error("Cannot use higher-order sections without the original template");value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate)}return buffer};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate){var value=context.lookup(token[1]);if(!value||isArray(value)&&value.length===0)return this.renderTokens(token[4],context,partials,originalTemplate)};Writer.prototype.renderPartial=function renderPartial(token,context,partials){if(!partials)return;var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null)return this.renderTokens(this.parse(value),context,partials,value)};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return value};Writer.prototype.escapedValue=function escapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return mustache.escape(value)};Writer.prototype.rawValue=function rawValue(token){return token[1]};mustache.name="mustache.js";mustache.version="2.2.1";mustache.tags=["{{","}}"];var defaultWriter=new Writer;mustache.clearCache=function clearCache(){return defaultWriter.clearCache()};mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags)};mustache.render=function render(template,view,partials){if(typeof template!=="string"){throw new TypeError('Invalid template! Template should be a "string" '+'but "'+typeStr(template)+'" was given as the first '+"argument for mustache#render(template, view, partials)")}return defaultWriter.render(template,view,partials)};mustache.to_html=function to_html(template,view,partials,send){var result=mustache.render(template,view,partials);if(isFunction(send)){send(result)}else{return result}};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer});


;
/*
 * --------------------------------------------------------------------------
 * Ali: transition.js
 * --------------------------------------------------------------------------
 * Adapted from: https://github.com/twbs/bootstrap/
 * Copyright 2011-2016 Twitter, Inc.
 * License: https://github.com/twbs/bootstrap/blob/master/LICENSE
 */

(function ($) {
    'use strict';

    // Check to see if Bootstrap has been installed --
    // no need to add this twice.
    if ($.type($.support.transition) !== 'undefined') {
        return;
    }

    // The remainder is pulled straight from twbs
    function transitionEnd() {
        var el = document.createElement('someelement');

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition : 'transitionend',
            OTransition : 'oTransitionEnd otransitionend',
            transition : 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end : transEndEventNames[name] };
            }
        }
        return false;
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false;
        var $el = this;
        $(this).one('aliTransitionEnd', function () { called = true; });
        var callback = function () {
            if (!called) {
                $($el).trigger($.support.transition.end);
            }
        };
        setTimeout(callback, duration);
        return this;
    };

    $(function () {
        $.support.transition = transitionEnd();

        if (!$.support.transition) {
            return;
        }

        $.event.special.aliTransitionEnd = {
            bindType : $.support.transition.end,
            delegateType : $.support.transition.end,
            handle : function (e) {
                if ($(e.target).is(this)) {
                    return e.handleObj.handler.apply(this, arguments);
                }
            }
        };
    });
})(jQuery);
;
/*
 * --------------------------------------------------------------------------
 * Ali: aria.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 *
 * jQuery.aria
 * A simple jQuery plugin that helps quickly and easily add aria roles, states and properties
 * to any jQuery-wrapped DOM element or collection. A fairly thin wrapper around jQuery's
 * <code>attr()</code>, the aria method restricts property values to current aria properties,
 *
 * Also, you don't have to type "aria-" all the time ;)
 *
 * Example:
 *
 * $('ul.tab-container').aria( 'role', 'tablist' );
 *
 * $('li.tab').aria( {
 *      'role' : 'tab',
 *      'selected' : 'false',
 *      'expanded' : 'false',
 *      'tabindex' : -1
 * } );
 */
///TODO: Extend behavior to allow for near-automatic component creation such as:
///TODO: $('li.tab').aria.init('tab') ;
///TODO: Allow for overridding the defaults, like
///TODO: $('li.tab:first').aria.init('tab', {'selected' : true, 'expanded' : 'true', 'tabindex' : 0 }


(function ( $ ) {
	"use strict";
	var _attrs = [
		'role',
		'tabindex',
		'activedescendant',
		'atomic',
		'autocomplete',
		'busy',
		'checked',
		'controls',
		'describedby',
		'disabled',
		'dropeffect',
		'expanded',
		'flowto',
		'grabbed',
		'haspopup',
		'hidden',
		'invalid',
		'label',
		'labelledby',
		'level',
		'live',
		'multiline',
		'multiselectable',
		'orientation',
		'owns',
		'posinset',
		'pressed',
		'readonly',
		'relevant',
		'required',
		'selected',
		'setsize',
		'sort',
		'valuemax',
		'valuemin',
		'valuenow',
		'valuetext'
	];

	function _addARIA( prop ) {
		prop = ('' + prop).toLowerCase().trim();
		return ( prop !== 'role' && prop !== 'tabindex' ) ? 'aria-' + prop : prop;
	}

	function _isValidAria( prop ) {
		return _attrs.indexOf( prop ) > - 1;
	}

	$.fn.aria = function ( prop, value ) {
		if ( 'object' === $.type( prop ) ) {
			for ( var i in prop ) {
				if ( prop.hasOwnProperty( i ) ) {
					this.aria( i, prop[ i ] );
				}
			}
		} else if ( undefined !== prop && undefined !== value ) {
			this.each( function () {
				if ( _isValidAria( prop ) ) {
					var $el = $( this );
					var attr = _addARIA( prop );
					$el.attr( attr, value );

					// special cases...
					if ( prop === 'disabled' ) {
						$el.attr( 'disabled', value );
					}
				}
			} );
		} else if ( undefined !== prop ) {
			return this.attr( _addARIA( prop ) );
		}
		return this;
	};
})( jQuery );
;
var htmlTemplates = {};

htmlTemplates["feedback"] = "<div class=\"feedback\" aria-labelledby=\"feedback-{{count}}\" tabindex=\"-1\">\n" +
   "	<div class=\"feedback-inner\">{{{content}}}</div>\n" +
   "</div>";

htmlTemplates["feedbackContainer"] = "<div role=\"status\" aria-live=\"assertive\" aria-atomic=\"true\"></div>";

htmlTemplates["dialog"] = "<div class=\"dialog\" role=\"alertdialog\" tabindex=\"0\" aria-label=\"{{label}}\" aria-describedby=\"dialog-window\">\n" +
   "	<div id=\"dialog-window\" class=\"dialog-window\" role=\"document\" >\n" +
   "		<div class=\"dialog-window-inner\">{{{content}}}</div>\n" +
   "		<div class=\"dialog-window-actions\">\n" +
   "			<button type=\"button\" class=\"dialog-window-actions-close\">OK</button>\n" +
   "		</div>\n" +
   "	</div>\n" +
   "</div>";

;
/*
 * --------------------------------------------------------------------------
 * Ali: feedback.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function ( $ ) {
	"use strict";

	/**
	 * Template local
	 */
	var _t = window.htmlTemplates;


	Mustache.parse( _t.feedback );
	Mustache.parse( _t.feedbackContainer );

	var FEEDBACK_CONTENT = '.feedback-content';

	/**
	 * Reusable Dialog object
	 * @type {{_instance: jQuery, show: ali.Dialog.show, hide: ali.Dialog.hide}}
	 */
	window.ali.Feedback = {
		_count : 0,

		/**
		 * Initializes an interaction,  adding an element with the role "status" and
		 * aria-live so that it is read for assistive technology.
		 * @param $control
		 */
		initInteraction : function ( $control ) {
			if ( $control.length > 0 ) {
				$control.append( _t.feedbackContainer );
			}
		},

		/**
		 * Returns a jQuery set of any feedback content elements.
		 * @param $el {jQuery} An interaction
		 * @returns {jQuery} a set of jQuery feedback elements.
		 */
		getFeedbackElements : function ( $el ) {
			return $( FEEDBACK_CONTENT, $el );
		},

		/**
		 * Returns true if the interaction contains an feedback element
		 * @param $el
		 * @returns {boolean}
		 */
		hasFeedback : function ( $el ) {
			return this.getFeedbackElements( $el ).length > 0;
		},

		/**
		 * Returns a feedback content element for this interaction with the given className, if available.
		 * @param $el an interaction
		 * @param className a className
		 * @returns {jQuery}
		 */
		getFeedbackContent : function ( $el, className ) {
			var $content = this.getFeedbackElements( $el );
			if ( className === undefined || $content.length === 1 ) {
				return $( $content[ 0 ] );
			} else {
				for ( var i = 0; i < $content.length; i ++ ) {
					var $fc = $( $content.get( i ) );
					if ( $fc.is( "." + className ) ) {
						return $fc;
					}
				}
			}
		},

		/**
		 * Finds and displays the appropriate feedback
		 * @param $el
		 * @param className
		 * @returns {boolean}
		 */
		showFeedback : function ( $el, className ) {
			if ( this.hasFeedback( $el ) ) {
				var $content = this.getFeedbackContent( $el, className );

				if ( $content.length > 0 ) {
					this.show( $content, $el );
					return true;
				}
			}
			return false;
		},

		/**
		 * Displays the feedback
		 * @param $content
		 * @param $el
		 */
		show : function ( $content, $el ) {
			var $instance = $( Mustache.render( _t.feedback, { count : ++ this._count, content : $content.html() } ) );
			var cl = $content[ 0 ].classList;
			for ( var i = 0; i < cl.length; i ++ ) {
				if ( cl.item( i ).indexOf( 'feedback' ) < 0 ) {
					$instance.addClass( cl.item( i ) );
				}
			}
			$( '[role="status"]', $el ).append( $instance );
			this.scrollToAndFocus( $instance );
		},

		/**
		 * Animates scrolling the browser window to the feedback element and sets the
		 * focus on the element once in position.
		 * @param $el
		 */
		scrollToAndFocus : function ( $el ) {
			$( 'html,body' ).animate(
				{
					scrollTop : $el.offset().top
				},
				{
					duration : 1000,
					easing   : '',
					complete : function () {
						$el.trigger( 'focus' );
					}
				}
			);
		}
	};

})( jQuery );
;
/*
 * --------------------------------------------------------------------------
 * Ali: interaction.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ( $ ) {
	"use strict";

	// Make the global object available and abort if this file is used without it.
	var ali = window.ali;
	if ( $.type( ali ) !== 'object' ) {
		return;
	}

	var NOTICE_DATA = "data-ali-notice-";


	/**
	 *  The parent class for all interactions.
	 * @param element : DOMElement
	 * @param type : string
	 * @param description : string
	 * @constructor
	 */
	ali.Interaction = function ( element, type, description ) {
		var d = new Date();
		this.$el = $( element );
		if ( 'string' === $.type( type ) ) {
			this.data.type = type;
		}
		if ( 'string' === $.type( description ) ) {
			this.data.description = description;
		}
		if ( ali.Feedback.hasFeedback( this.$el ) ) {
			ali.Feedback.initInteraction( this.$el );
		}

		this.data.start = d.getTime();
	};

	/**
	 * Event data sent with each event.
	 * @type {{id: string, start: number, type: string, correct_responses: Array, learner_response: Array, result:
     *     string, latency: number, description: string}}
	 */
	ali.Interaction.prototype.data = {
		'id'                : '',
		'start'             : 0,
		'type'              : ali.TYPE.other,
		'correct_responses' : [],
		'learner_response'  : [],
		'result'            : ali.STATUS.incomplete,
		'latency'           : 0,
		'description'       : 'Ali Interaction'
	};

	/**
	 * The timestamp of the completion of the last item. Used only for multi-part interactions.
	 * @type {number}
	 * @private
	 */
	ali.Interaction.prototype.__last = 0;

	/**
	 * Reference to dialog instance. Should only ever hold one element.
	 * @type {jQuery|undefined}
	 */
	ali.Interaction.prototype.$dialog = undefined;

	/**
	 * Utility function that creates an ID using the the ID of the passed element or the text of the passed element.
	 * @param $el Element used to define the ID.
	 * @returns {string} Target ID for use with `aria-controls`
	 */
	ali.Interaction.prototype.makeTargetID = function ( $el ) {
		var str = $el.attr( 'id' );
		if ( str === undefined ) {
			str = $el.text().replace( /[\W_]+/g, "" ).toLowerCase();
			if ( str.length > 10 ) {
				str = str.substring( 0, 10 );
			}
		} else {
			str += '-target';
		}
		return str;
	};

	/**
	 * Because javascript and the LMS I work with on occasion don't agree on what true means
	 * Used sparingly...
	 * @param string {string|boolean}
	 * @returns {boolean}
	 */
	ali.Interaction.prototype.truthy = function ( string ) {
		return string === true || string === "true" || string === "t";
	};

	/**
	 * Allows a method to be called later, just before the next UI paint.
	 * @param callback
	 */
	ali.Interaction.prototype.defer = function ( callback ) {
		var func = function () {
			callback.apply( this );
		};
		requestAnimationFrame( func.bind( this ) );
	};

	/**
	 * Allows interactions to set their learner responses for this interaction.
	 * @param responses : array An array of responses specific to the interaction
	 */
	ali.Interaction.prototype.setLearnerResponses = function ( responses ) {
		if ( 'array' === $.type( responses ) ) {
			this.data.learner_response = responses;
		}
	};

	/**
	 * Allows interactions to set their correct responses for this interaction.
	 * @param responses : {array} An array of responses specific to the interaction
	 */
	ali.Interaction.prototype.setCorrectResponses = function ( responses ) {
		if ( 'array' === $.type( responses ) ) {
			this.data.correct_responses = responses;
		}
	};

	/**
	 * Complete event. Fired when all unique user actions have been performed for this interaction.
	 * This could be once all items have been viewed, or when the question or questions have been judged.
	 * @param status : string From the ali.STATUS constant; Should indicate the status of the interaction, including
	 * correct or incorrect, if appropriate.
	 */
	ali.Interaction.prototype.complete = function ( status ) {
		var e, d = new Date();
		if ( 'undefined' === $.type( status ) || '' === status.trim() ) {
			status = 'complete';
		}
		this.data.id = this.$el.attr( 'id' );
		this.data.result = status;
		this.data.latency = d.getTime() - this.data.start;
		this.doFeedback( status );
		e = new jQuery.Event( 'ali:complete' );
		this.$el.trigger( e, [ this.data ] );
	};

	/**
	 *
	 * @param status
	 */
	ali.Interaction.prototype.doFeedback = function ( status ) {
		if ( ! ali.Dialog.showDialog( this.$el, status ) && ! ali.Feedback.showFeedback( this.$el, status ) ) {
			this.showNotice( status );
		}
	};

	/**
	 * Event trigger method to indicate that an item has been selected.
	 * @param $item : jQuery object for the element selected.
	 */
	ali.Interaction.prototype.itemSelected = function ( $item ) {
		var clonedData = jQuery.extend( true, {}, this.data );
		clonedData.id = $item.attr( 'id' );
		var e = new jQuery.Event( 'ali:itemSelected' );
		this.$el.trigger( e, [ clonedData, $item ] );
	};

	/**
	 * Event trigger method to indicate that an item has been completed.
	 * @param status : string From the ali.STATUS constant; Should indicate the status of the interaction, including
	 * correct or incorrect, if appropriate.
	 * @param $item : jQuery object for the element selected.
	 */
	ali.Interaction.prototype.itemComplete = function ( status, $item ) {
		if ( 'undefined' === $.type( status ) || '' === status.trim() ) {
			status = ali.STATUS.complete;
		}
		if ( 'undefined' === $.type( $item ) || 0 === $item.length ) {
			$item = this.$el;
		}

		var clonedData = jQuery.extend( true, {}, this.data );
		clonedData.id = $item.attr( 'id' );
		var d = new Date();
		var e = new jQuery.Event( 'ali:itemComplete' );
		clonedData.result = status;
		clonedData.latency = d.getTime() - this.__last;
		this.__last = d.getTime();
		this.$el.trigger( e, [ clonedData, $item ] );
	};

	/**
	 *
	 * @param message
	 * @param cls
	 */
	ali.Interaction.prototype.showNotice = function ( status ) {
		var noticeAttr = NOTICE_DATA + status;
		var noticeText = this.$el.attr( noticeAttr );
		if ( undefined !== noticeText && '' !== noticeText.trim() ) {
			var $container = $( '<div>' )
				.addClass( 'notice-container' )
				.aria( { 'live' : 'assertive' } )
				.appendTo( this.$el );
			var cls = 'notice ' + status;
			var $notice = $( '<div>' ).aria( 'hidden', 'true' ).addClass( cls ).html( noticeText );
			$container.append( $notice );
			setTimeout( function () {
				$notice.aria( 'hidden', 'false' );
			}, 100 );
		}
	};
})( jQuery );
;
/*
 * --------------------------------------------------------------------------
 * Ali: dialog.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ( $ ) {
	"use strict";

	var DIALOG_CONTENT = '.dialog-content';

	/**
	 * Template local
	 */
	var _t = window.htmlTemplates;

	/**
	 * Reusable Dialog object
	 * @type {{_instance: jQuery, show: ali.Dialog.show, hide: ali.Dialog.hide}}
	 */
	window.ali.Dialog = {

		_instance : undefined,

		/**
		 * Returns a jQuery set of dialog content elements.
		 * @param $el
		 * @returns {jQuery}
		 */
		getDialogElements : function ( $el ) {
			return $( DIALOG_CONTENT, $el );
		},

		/**
		 * Returns true if the current interaction has dialog content.
		 * @param $el
		 * @returns {boolean}
		 */
		hasDialog : function ( $el ) {
			return this.getDialogElements( $el ).length > 0;
		},

		/**
		 * Returns the correct dialog content corresponding to the provided className.
		 * @param $el
		 * @param className
		 * @returns {*|HTMLElement}
		 */
		getDialogContent : function ( $el, className ) {
			var $dialogContent = this.getDialogElements( $el );
			if ( className === undefined || $dialogContent.length === 1 ) {
				return $( $dialogContent[ 0 ] );
			} else {
				for ( var i = 0; i < $dialogContent.length; i ++ ) {
					var $fc = $( $dialogContent.get( i ) );
					if ( $fc.is( className ) ) {
						return $fc;
					}
				}
			}
		},

		/**
		 * Opens a dialog if dialog content exists.
		 * @param $el
		 * @param className
		 * @returns {boolean}
		 */
		showDialog : function ( $el, className ) {
			if ( this.hasDialog( $el ) ) {
				var $dialogContent = this.getDialogContent( $el, "." + className );
				if ( $dialogContent.length > 0 ) {
					this.show( $dialogContent );
					return true;
				}
			}
			return false;
		},

		/**
		 * Displays a dialog window, moving the content contained in `$el` into the primary content of the dialog.
		 * This method will also copy any classes on `$el` over to the dialog itself.
		 * @param $el content for the dialog.
		 * @param title Accessible title of this dialog.
		 */
		show : function ( $el, title ) {
			if ( 'undefined' === $.type( _t.dialog ) ) {
				Mustache.parse( _t.dialog );
			}
			this._instance = $( Mustache.render( _t.dialog, { label : title, content : $el.html() } ) );
			var cl = $el[ 0 ].classList;
			for ( var i = 0; i < cl.length; i ++ ) {
				if ( cl.item( i ).indexOf( 'dialog' ) < 0 ) {
					this._instance.addClass( cl.item( i ) );
				}
			}
			$( 'body' ).append( this._instance ).addClass( 'dialog-open' );
			$( document ).off( 'focusin.ali' ).on( 'focusin.ali', this._handleFocus.bind( this ) );
			$( '.dialog-window-actions-close', this._instance ).off( 'click.ali' ).on( 'click.ali', this.hide.bind( this ) );
			this._instance.trigger( 'focus' );
		},

		/**
		 * Hides the current dialog. Primarily intended as a callback method for the close button.
		 * @param e {Event}
		 */
		hide         : function ( e ) {
			if ( 'object' === $.type( e ) ) {
				e.preventDefault();
				e.stopPropagation();
			}

			if ( $.type( this._instance ) !== 'undefined' ) {
				$( '.dialog-window-actions-close', this._instance ).off( 'click.ali' );
				this._instance.remove();
				this._instance = undefined;
			}
			$( document ).off( 'focusin.ali' );
			$( 'body' ).removeClass( 'dialog-open' );
		},
		/**
		 * Callback method used to keep focus on the dialog while it's open.
		 * @param e
		 * @private
		 */
		_handleFocus : function ( e ) {
			if ( document !== e.target && this._instance[ 0 ] !== e.target && ! this._instance.has( e.target ).length ) {
				this._instance.trigger( 'focus' );
			}
		}

	};

})( jQuery );
;
/*
 * --------------------------------------------------------------------------
 * Ali: card.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function ( $ ) {
	"use strict";

	// Make the global object available and abort if this file is used without it.
	var ali = window.ali;
	if ( $.type( ali ) !== 'object' ) {
		return;
	}

	var DESCRIPTION = 'A card-based multiple choice interaction.';
	var TYPE = ali.TYPE.choice;

	ali.Card = function ( element ) {
		this.$el = $( element );
		if ( $( '.card-front select', this.$el ).length > 0 ) {
			ali.Interaction.call( this, element, TYPE, DESCRIPTION );
		}

		this.$el.aria('tabindex', "-1");

		// initialize the turn-to-back functionality
		$( '.show-back', this.$el )
			.aria( 'controls', this.$el.attr( 'id' ) )
			.off( 'click.ali' ).on( 'click.ali', this.showBack.bind( this ) );

		// initialize the turn-to-front functionality
		$( '.show-front', this.$el )
			.aria( 'controls', this.$el.attr( 'id' ) )
			.off( 'click.ali' ).on( 'click.ali', this.showFront.bind( this ) );

		$( '.evaluate-card', this.$el )
			.aria( 'controls', this.$el.attr( 'id' ) )
			.off( 'click.ali' ).on( 'click.ali', this.evaluate.bind( this ) );

		$( '.card-back', this.$el ).aria( 'hidden', 'true' );
		$( '.card-front', this.$el ).aria( 'hidden', 'false' );
	};

	// Inherits from ali.Interaction
	ali.Card.prototype = Object.create( ali.Interaction.prototype );
	ali.Card.prototype.constructor = ali.Card;


	ali.Card.prototype.showBack = function ( e ) {
		if ( e ) {
			e.preventDefault();
			e.stopPropagation();
		}
		$( '.card-front', this.$el ).aria( 'hidden', 'true' );
		$( '.card-back', this.$el ).aria( 'hidden', 'false' );

		this.$el.focus();
	};

	ali.Card.prototype.showFront = function ( e ) {
		if ( e ) {
			e.preventDefault();
			e.stopPropagation();
		}
		$( '.card-back', this.$el ).aria( 'hidden', 'true' );
		$( '.card-front', this.$el ).aria( 'hidden', 'false' );

		this.$el.focus();
	};

	ali.Card.prototype.evaluate = function ( e ) {
		if ( e ) {
			e.preventDefault();
			e.stopPropagation();
		}
		var $select = $( '.card-front select', this.$el );
		var selected = parseInt( $select[ 0 ].selectedIndex, 10 );
		var correct = parseInt( $select.attr( 'data-ali-correct' ), 10 ) - 1;
		var is_correct = selected == correct;

		this.$el.removeClass( 'correct incorrect' ).addClass( is_correct ? 'correct' : 'incorrect' );

		this.setCorrectResponses( [ $select.val() ] );
		this.setLearnerResponses( [ $( 'option:selected', $select ).val() ] );
		this.complete( is_correct ? ali.STATUS.correct : ali.STATUS.incorrect );
		this.showBack();
	};

	/*
	 * jQuery Plugin
	 */
	function Plugin( option ) {
		return this.each( function () {
			var $this = $( this );
			var data = $this.data( 'ali.card' );
			var options = $.extend( {}, $this.data(), typeof option == 'object' && option );

			if ( ! data ) {
				$this.data( 'ali.card', (data = new ali.Card( this )) );
			}

			if ( $.type( option ) === 'string' ) {
				option = option.toLowerCase();
			}

			if ( options.showFront || option === 'showfront' ) {
				data.showFront();
			} else if ( options.showBack || option === 'showback' ) {
				data.showBack();
			} else if ( options.evaluate || option === 'evaluate' ) {
				data.evaluate();
			}
		} );
	}


	var old = $.fn.card;
	$.fn.card = Plugin;
	$.fn.card.Constructor = ali.Card;

	$.fn.card.noConflict = function () {
		$.fn.card = old;
		return this;
	};

})( jQuery );
;
/*
 * --------------------------------------------------------------------------
 * Ali: accordion.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ($) {
    "use strict";

    // Make the global object available and abort if this file is used without it.
    var ali = window.ali;
    if ($.type(ali) !== 'object') {
        return;
    }

    var DESCRIPTION = 'Accordion interaction.';
    var TYPE = ali.TYPE.other;

    /*
     * Saved queries
     */
    var TAB = '.accordion-tab';
    var OPEN_TAB = '.accordion-tab[aria-expanded="true"]';
    var PANEL = '.accordion-panel';

    /**
     * Accordion Interaction
     * @param element DOMElement
     * @constructor
     */
    ali.Accordion = function (element) {
        ali.Interaction.call(this, element, TYPE, DESCRIPTION);
        this.init();
    };

    // Inherits from ali.Interaction
    ali.Accordion.prototype = Object.create(ali.Interaction.prototype);
    ali.Accordion.prototype.constructor = ali.Accordion;

    /**
     * Saved jQuery reference to the tabs in this interaction.
     * @type {jQuery}
     */
    ali.Accordion.prototype.$tabs = undefined;

    /**
     * Initializes the Interaction. Called from constructor.
     */
    ali.Accordion.prototype.init = function () {
        var $initOpen = $(OPEN_TAB);
        this.$tabs = $(TAB, this.$el);
        this.$tabs.each(this.initTab.bind(this));
        // If there was an expanded tab set by the user, expand that tab.
        // Otherwise, just make the first element in the list active
        if ($initOpen.length > 0) {
            /// DIRTY HACK: deferring this "show" call so that event handlers have a chance to be attached
            /// before it fires.
            this.defer((function () {
                this.show($($initOpen[0]));
            }).bind(this));
        } else {
            this.getFirstTab().aria('tabindex', 0);
        }
        // set a debounced resize event handler.
        $(window).on('resize', this._requestResize.bind(this));
    };

    /**
     * jQuery each callback; Initializes the tab/panel pair
     * @param i : {number} index of current element
     * @param el {jQuery} tab to operate on.
     */
    ali.Accordion.prototype.initTab = function (i, el) {
        var $tab, $panel, id;
        $tab = $(el);
        id = this.makeTargetID($tab);
        $panel = $tab.next(PANEL);
        $tab.aria(
            {
                'role' : "tab",
                'tabindex' : "0",
                'expanded' : "false",
                'controls' : id
            })
            .off('click.ali').on('click.ali', this.tab_onClick.bind(this))
            .off('keydown.ali').on('keydown.ali', this.tab_onKeyDown.bind(this));

        $panel.aria(
            {
                'role' : "tabpanel",
                'tabindex' : "-1",
                'hidden' : "true"
            }
        ).attr(
            {
                'id' : id,
                'data-height' : this._getMeasuredHeight($panel)
            }
        ).off('keydown.ali').on('keydown.ali', this.panel_onKeyDown.bind(this));
    };

    /**
     * Hides the panel corresponding to the provided tab and sets that tab to unexpanded.
     * @param $tab
     */
    ali.Accordion.prototype.hide = function ($tab) {
        this.getPanelFromTab($tab).aria(
            {
                'hidden' : 'true',
                'tabindex' : "-1"
            }
        ).removeAttr('style');
        $tab.aria('expanded', 'false');
    };

    /**
     *  Hides all panels
     */
    ali.Accordion.prototype.hideAll = function () {
        this.$tabs.each((function (i, el) {
            this.hide($(el));
        } ).bind(this));
    };

    /**
     * Shows the panel corresponding to the provided $tab and fires an `ali:itemSelected`.
     * If all tabs have been viewed, fires an `ali:complete` event.
     * @param $tab
     */
    ali.Accordion.prototype.show = function ($tab) {
        var $panel = this.getPanelFromTab($tab);
        var panelHeight = parseInt($panel.attr('data-height'));
        this.hideAll();
        $panel.aria(
            {
                'hidden' : 'false',
                'tabindex' : "0"
            }
        );
        if (panelHeight > 0) {
            $panel.css('max-height', panelHeight + 'px');
        }
        $tab.aria(
            {
                'expanded' : 'true',
                'tabindex' : '0'
            }
        ).addClass('viewed').focus();

        this.itemSelected($tab);

        if ($('.viewed', this.$el).length === this.$tabs.length && this.data.result === ali.STATUS.incomplete) {
            this.complete();
        }
    };

    /**
     * Overrides the default method - does nothing.
     * @override
     */
    ali.Accordion.prototype.doFeedback = function () {
        //noop
    };

    /**
     * Returns a panel controlled by the provided tab.
     * @param $tab : jQuery
     * @returns jQuery object for the panel.
     */
    ali.Accordion.prototype.getPanelFromTab = function ($tab) {
        return $('#' + $tab.aria('controls'));
    };

    /**
     * Returns a tab that controls the provided panel.
     * @param $panel : jQuery
     * @returns jQuery object for the tab
     */
    ali.Accordion.prototype.getTabFromPanel = function ($panel) {
        return $(TAB + '[aria-controls="' + $panel.attr('id') + '"]');
    };


    /**
     * Iterates through all siblings following the provided tab until another tab is found.
     * If no tab is found, returns an empty jQuery object.
     * @param $tab
     * @returns {jQuery}
     * @note Maximum iterations is 2 * {number of tabs}
     * @private
     */
    ali.Accordion.prototype._nextTab = function ($tab) {
        var $next = $tab.next();
        var count = this.$tabs.length * 2;
        while ($next.length > 0 && !$next.is(TAB) && count-- !== 0) {
            $next = $next.next();
        }
        return $next;
    };

    /**
     * Returns the next tab in the accordion or the first tab if no next tab can be found.
     * @param $tab
     * @returns {jQuery}
     */
    ali.Accordion.prototype.getNextTab = function ($tab) {
        var $next = this._nextTab($tab);
        if ($next.length === 0) {
            return this.getFirstTab();
        } else {
            return $next;
        }
    };


    /**
     * Iterates over all siblings preceding the provided tab until another tab is found.
     * If no tab is found, returns an empty jQuery object.
     * @param $tab
     * @returns {jQuery}
     * @note Maximum iterations is 2 * {number of tabs}
     * @private
     */
    ali.Accordion.prototype._previousTab = function ($tab) {
        var $prev = $tab.prev();
        var count = this.$tabs.length * 2;
        while ($prev.length > 0 && !$prev.is(TAB) && count-- !== 0) {
            $prev = $prev.prev();
        }
        return $prev;
    };

    /**
     * Returns the previous tab in the accordion or the last tab if no previous tab can be found.
     * @param $tab
     * @returns {jQuery}
     */
    ali.Accordion.prototype.getPreviousTab = function ($tab) {
        var $prev = this._previousTab($tab);
        if ($prev.length === 0) {
            return this.getLastTab();
        } else {
            return $prev;
        }
    };


    /**
     * Gets the first tab in the list.
     * @returns {jQuery}
     */
    ali.Accordion.prototype.getFirstTab = function () {
        return this.$tabs.first();
    };

    /**
     * Gets the last tab in the list.
     * @returns {jQuery}
     */
    ali.Accordion.prototype.getLastTab = function () {
        return this.$tabs.last();
    };


    /**
     * Keyboard event handler for when keyboard focus in on the tabs.
     * @private
     */
    ali.Accordion.prototype.tab_onKeyDown = function (e) {
        switch (e.which) {
            case 13: // ENTER
            case 32: // SPACE
                e.preventDefault();
                e.stopPropagation();
                this.tab_onClick(e);
                break;
            case 37: // LEFT
            case 38: // UP
                e.preventDefault();
                e.stopPropagation();
                this.show(this.getPreviousTab($(e.currentTarget)));
                break;
            case 39: // RIGHT
            case 40: // DOWN
                e.preventDefault();
                e.stopPropagation();
                this.show(this.getNextTab($(e.currentTarget)));
                break;
            case 35: // END
                e.preventDefault();
                e.stopPropagation();
                this.show(this.getLastTab());
                break;
            case 36: // HOME
                e.preventDefault();
                e.stopPropagation();
                this.show(this.getFirstTab());
                break;
        }
    };

    /**
     * Tab click event
     * @private
     */
    ali.Accordion.prototype.tab_onClick = function (e) {
        var $target = $(e.target);
        if ($target.aria('expanded') !== 'true') {
            this.show($target);
        } else {
            this.hide($target);
        }
    };

    /**
     * Keyboard event handler for when keyboard focus is in a panel.
     * @private
     */
    ali.Accordion.prototype.panel_onKeyDown = function (e) {
        if ((e.ctrlKey || e.metaKey) && e.currentTarget) {
            var $tab, $newTab;
            var $panel = $(e.currentTarget);
            switch (e.which) {
                case 38: // UP
                    e.preventDefault();
                    e.stopPropagation();
                    this.getTabFromPanel($panel).focus();
                    break;
                case 33: // PAGE UP
                    e.preventDefault();
                    e.stopPropagation();
                    $tab = this.getFirstTab();
                    if ($tab.aria('expanded') === 'false') {
                        this.show($tab);
                    }
                    $tab.focus();
                    break;
                case 40: //  DOWN
                    e.preventDefault();
                    e.stopPropagation();
                    $tab = this.getLastTab();
                    if ($tab.aria('expanded') === 'false') {
                        this.show($tab);
                    }
                    $tab.focus();
                    break;
            }
        }
    };


    /**
     * Window resize handler.
     * @param e
     */
    ali.Accordion.prototype.onResize = function (e) {
        this._requestResize();
    };

    /**
     * Requests a resize event if the current control is not currently performing a resize event.
     * Events are handled before the next paint and debounced using requestAnimationFrame
     * @private
     */
    ali.Accordion.prototype._requestResize = function () {
        if (!this._resizing) {
            requestAnimationFrame(this._resizePanels.bind(this));
            this._resizing = true;
        }
    };

    /**
     * Callback passed to requestAnimationFrame; sets the max-height for each panel, adjusting the height
     * for any panel currently open.
     * @private
     */
    ali.Accordion.prototype._resizePanels = function () {
        this.$tabs.each((function (i, el) {
            var $panel = $(el).next(PANEL);
            $panel.attr('data-height', this._getMeasuredHeight($panel));
            if ($panel.aria('hidden') === 'false') {
                $panel.css('min-height', this._getMeasuredHeight($panel) + 'px');
            }
        }).bind(this));
        this._resizing = false;
    };

    /**
     * Creates an clone element on the DOM of the provided panel and measures it's height.
     * @param $panel
     * @returns {int} height of element
     * @private
     */
    ali.Accordion.prototype._getMeasuredHeight = function ($panel) {
        var $div = $('<div id="ali-temp" aria-hidden="true" style="overflow:hidden;height:1px;width:100%;visibility: hidden"></div>').appendTo(this.$el);
        var $tmp = $('<dd class="accordion-panel"></dd>').html($panel.html()).appendTo($div);
        var h = $tmp.height();
        $div.remove();
        return h;
    };

    /*
     * jQuery Plugin
     */
    function Plugin() {
        return this.each(function () {
            new ali.Accordion(this);
        });
    }

    var old = $.fn.accordion;
    $.fn.accordion = Plugin;
    $.fn.accordion.Constructor = ali.Accordion;

    $.fn.accordion.noConflict = function () {
        $.fn.accordion = old;
        return this;
    };

})(jQuery);
;
/*
 * --------------------------------------------------------------------------
 * Ali: tab-control.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ($) {
    "use strict";

    // Make the global object available and abort if this file is used without it.
    var ali = window.ali;
    if ($.type(ali) !== 'object') {
        return;
    }

    var DESCRIPTION = 'Tab Control interaction.';
    var TYPE = ali.TYPE.other;
    /*
     * Saved queries
     */
    var TABLIST = '.tab-control-tablist';
    var TABS = TABLIST + ' li';
    var SELECTED_TAB = TABS + '[aria-selected="true"]';
    var PANELS = '.tab-control-panel';

    /**
     * Tab Control Interaction
     * @param element DOMElement
     * @constructor
     */
    ali.TabControl = function (element) {
        ali.Interaction.call(this, element, TYPE, DESCRIPTION);
        this.init();
    };

    // Inherits from ali.Interaction
    ali.TabControl.prototype = Object.create(ali.Interaction.prototype);
    ali.TabControl.prototype.constructor = ali.TabControl;

    /**
     * Saved jQuery reference to the tabs in this interaction.
     * @type {jQuery}
     */
    ali.TabControl.prototype.$tabs = undefined;

    /**
     * Saved jQuery reference to the visual indicator for this interaction.
     * @type {jQuery}
     */
    ali.TabControl.prototype.$vi = undefined;
    ali.TabControl.prototype.__activeTab = undefined;

    /**
     * Initializes the Interaction. Called from constructor.
     */
    ali.TabControl.prototype.init = function () {
        var $tablist = $(TABLIST, this.$el);
        this.$tabs = $(TABS, this.$el);
        var $selected = $(SELECTED_TAB, this.$el);
        var $panels = $(PANELS, this.$el);
        var id = this.$el.attr('id');
        $panels.each((function (i, el) {
            var $panel = $(el);
            $panel.attr('id', id + '-panel-' + i)
                .aria({
                          'role' : 'tabpanel',
                          'hidden' : 'true',
                          'tabindex' : '-1',
                          'labeledby' : id + '-tab-' + i
                      })
                .off('keydown.ali')
                .on('keydown.ali', this.panel_onKeyDown.bind(this));
        }).bind(this));

        $tablist.aria({
                          'role' : 'tablist',
                          'hidden' : 'true'
                      });

        this.$tabs.each((function (i, el) {
            var $tab = $(el);
            $tab.attr('id', id + '-tab-' + i)
                .aria({
                          'role' : 'tab',
                          'controls' : id + '-panel-' + i,
                          'tabindex' : '-1',
                          'selected' : 'false'
                      })
                .off('click.ali').on('click.ali', this.tab_onClick.bind(this))
                .off('keydown.ali').on('keydown.ali', this.tab_onKeyDown.bind(this));
        } ).bind(this));

        this.$vi = $('<span class="vi" role="presentation"></span>');
        $tablist.append(this.$vi);

        if ($selected.length > 0) {
            $selected = $($selected[0]);
        } else {
            $selected = $(this.$tabs[0]);
        }

        $(window).on('resize', this._requestResize.bind(this));

        this.defer((function () {
            $tablist.aria('hidden', 'false');
            this.show($selected);
        }).bind(this));
    };


    /**
     * Hides the panel corresponding to the provided tab and sets that tab to unexpanded.
     * @param $tab
     */
    ali.TabControl.prototype.hide = function ($tab) {
        this.getPanelFromTab($tab).aria(
            {
                'hidden' : 'true',
                'tabindex' : "-1"
            }
        );
        $tab.aria({
                      'selected' : 'false',
                      'tabindex' : "-1"
                  });
    };

    /**
     *  Hides all panels
     */
    ali.TabControl.prototype.hideAll = function () {
        this.$tabs.each((function (i, el) {
            this.hide($(el));
        } ).bind(this));
    };

    /**
     * Shows the panel corresponding to the provided $tab and fires an `ali:itemSelected`.
     * If all tabs have been viewed, fires an `ali:complete` event.
     * @param $tab
     */
    ali.TabControl.prototype.show = function ($tab) {
        var $panel = this.getPanelFromTab($tab);
        this.hideAll();
        $panel.aria(
            {
                'hidden' : 'false',
                'tabindex' : "0"
            }
        );

        $tab.aria(
            {
                'selected' : 'true',
                'tabindex' : '0'
            }
        ).addClass('viewed').focus();

        this.itemSelected($tab);
        this.updateVI($tab);

        if ($('.viewed', this.$el).length === this.$tabs.length && this.data.result === ali.STATUS.incomplete) {
            this.complete();
        }
    };

    /**
     * Overrides the default method - does nothing.
     * @override
     */
    ali.TabControl.prototype.doFeedback = function () {
        //noop
    };

    /**
     * Returns a panel controlled by the provided tab.
     * @param $tab : jQuery
     * @returns jQuery object for the panel.
     */
    ali.TabControl.prototype.getPanelFromTab = function ($tab) {
        return $('#' + $tab.aria('controls'));
    };

    /**
     * Returns a tab that controls the provided panel.
     * @param $panel : jQuery
     * @returns jQuery object for the tab
     */
    ali.TabControl.prototype.getTabFromPanel = function ($panel) {
        return $(TABS + '[aria-controls="' + $panel.attr('id') + '"]');
    };


    /**
     * Iterates through all siblings following the provided tab until another tab is found.
     * If no tab is found, returns an empty jQuery object.
     * @param $tab
     * @returns {jQuery}
     * @note Maximum iterations is 2 * {number of tabs}
     * @private
     */
    ali.TabControl.prototype._nextTab = function ($tab) {
        var $next = $tab.next();
        var count = this.$tabs.length * 2;
        while ($next.length > 0 && !$next.is(TABS) && count-- !== 0) {
            $next = $next.next();
        }
        return $next;
    };

    /**
     * Returns the next tab in the accordion or the first tab if no next tab can be found.
     * @param $tab
     * @returns {jQuery}
     */
    ali.TabControl.prototype.getNextTab = function ($tab) {
        var $next = this._nextTab($tab);
        if ($next.length === 0) {
            return this.getFirstTab();
        } else {
            return $next;
        }
    };


    /**
     * Iterates over all siblings preceding the provided tab until another tab is found.
     * If no tab is found, returns an empty jQuery object.
     * @param $tab
     * @returns {jQuery}
     * @note Maximum iterations is 2 * {number of tabs}
     * @private
     */
    ali.TabControl.prototype._previousTab = function ($tab) {
        var $prev = $tab.prev();
        var count = this.$tabs.length * 2;
        while ($prev.length > 0 && !$prev.is(TABS) && count-- !== 0) {
            $prev = $prev.prev();
        }
        return $prev;
    };

    /**
     * Returns the previous tab in the accordion or the last tab if no previous tab can be found.
     * @param $tab
     * @returns {jQuery}
     */
    ali.TabControl.prototype.getPreviousTab = function ($tab) {
        var $prev = this._previousTab($tab);
        if ($prev.length === 0) {
            return this.getLastTab();
        } else {
            return $prev;
        }
    };


    /**
     * Gets the first tab in the list.
     * @returns {jQuery}
     */
    ali.TabControl.prototype.getFirstTab = function () {
        return this.$tabs.first();
    };

    /**
     * Gets the last tab in the list.
     * @returns {jQuery}
     */
    ali.TabControl.prototype.getLastTab = function () {
        return this.$tabs.last();
    };

    /**
     * Keyboard event handler for when keyboard focus is in a panel.
     * @private
     */
    ali.TabControl.prototype.panel_onKeyDown = function (e) {
        if ((e.ctrlKey || e.metaKey) && e.currentTarget) {
            var $tab;
            var $panel = $(e.currentTarget);
            switch (e.which) {
                case 38: // UP
                    e.preventDefault();
                    e.stopPropagation();
                    this.getTabFromPanel($panel).focus();
                    break;
                case 33: // PAGE UP
                    e.preventDefault();
                    e.stopPropagation();
                    $tab = this.getFirstTab();
                    if ($tab.aria('expanded') === 'false') {
                        this.show($tab);
                    }
                    $tab.focus();
                    break;
                case 40: //  DOWN
                    e.preventDefault();
                    e.stopPropagation();
                    $tab = this.getLastTab();
                    if ($tab.aria('expanded') === 'false') {
                        this.show($tab);
                    }
                    $tab.focus();
                    break;
            }
        }
    };

    /**
     * Tab click event
     * @private
     */
    ali.TabControl.prototype.tab_onClick = function (e) {
        var $target = $(e.target);
        if ($target.aria('selected') !== 'true') {
            this.hideAll();
            this.show($target);
        }
    };

    /**
     * Keyboard event handler for when keyboard focus in on the tabs.
     * @private
     */
    ali.TabControl.prototype.tab_onKeyDown = function (e) {
        switch (e.which) {
            case 13: // ENTER
            case 32: // SPACE
                e.preventDefault();
                e.stopPropagation();
                this.tab_onClick(e);
                break;
            case 37: // LEFT
            case 38: // UP
                e.preventDefault();
                e.stopPropagation();
                this.show(this.getPreviousTab($(e.currentTarget)));
                break;
            case 39: // RIGHT
            case 40: // DOWN
                e.preventDefault();
                e.stopPropagation();
                this.show(this.getNextTab($(e.currentTarget)));
                break;
            case 35: // END
                e.preventDefault();
                e.stopPropagation();
                this.show(this.getLastTab());
                break;
            case 36: // HOME
                e.preventDefault();
                e.stopPropagation();
                this.show(this.getFirstTab());
                break;
        }
    };

    /**
     * Window resize handler.
     * @param e
     */
    ali.TabControl.prototype.onResize = function (e) {
        this._requestResize();
    };

    /**
     * Requests a resize event if the current control is not currently performing a resize event.
     * Events are handled before the next paint and debounced using requestAnimationFrame
     * @private
     */
    ali.TabControl.prototype._requestResize = function () {
        if (!this._resizing) {
            this._resizing = true;
            this.__activeTab = $(SELECTED_TAB, this.$el);
            requestAnimationFrame(this.updateVI.bind(this));
        }
    };

    /**
     * Resizes the visual indicator (vi) for the active tab.
     * @param $tab {number|jQuery}
     */
    ali.TabControl.prototype.updateVI = function ($tab) {
        // if the passed parameter is a number, this method is being called by
        // a rAF, so set the $tab variable and reset the resizing flag.
        if ($.type($tab) === 'number') {
            this._resizing = false;
            $tab = this.__activeTab;
        }
        var pos = $tab.position();
        var w = $tab.outerWidth();
        this.$vi.css({ width : w + 'px', left : pos.left + 'px' });
    };

    /*
     * jQuery Plugin
     */
    function Plugin() {
        return this.each(function () {
            new ali.TabControl(this);
        });
    }

    var old = $.fn.tabcontrol;
    $.fn.tabcontrol = Plugin;
    $.fn.tabcontrol.Constructor = ali.TabControl;

    $.fn.tabcontrol.noConflict = function () {
        $.fn.tabcontrol = old;
        return this;
    };

})(jQuery);
;
/*
 * --------------------------------------------------------------------------
 * Ali: answer-set.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ($) {
    "use strict";

    // Make the global object available and abort if this file is used without it.
    var ali = window.ali;
    if ($.type(ali) !== 'object') {
        return;
    }

    var DESCRIPTION = 'Answer Set multi-part interaction.';
    var TYPE = ali.TYPE.choice;

    var QUESTION = 'form';
    var SELECT = 'select';
    var SUBMIT = 'button';
    var CORRECT_ATTR = 'data-ali-correct';
    var CORRECT_RESPONSE = 'data-ali-correct-message';
    var INCORRECT_RESPONSE = 'data-ali-incorrect-message';

    /**
     * Answer Set Interaction
     * @param element DOMElement
     * @constructor
     */
    ali.AnswerSet = function (element) {
        ali.Interaction.call(this, element, TYPE, DESCRIPTION);
        this.init();
    };

    // Inherits from ali.Interaction
    ali.AnswerSet.prototype = Object.create(ali.Interaction.prototype);
    ali.AnswerSet.prototype.constructor = ali.AnswerSet;

    /**
     * Initialization.
     */
    ali.AnswerSet.prototype.init = function () {
        $(QUESTION, this.$el).each((function (i, el) {
            $(el).aria({
                           'live' : "assertive",
                           'atomic' : "true"
                       })
                .attr('id', this.$el.attr('id') + '-' + i)
                .off('submit.ali')
                .on('submit.ali', this.question_onSubmit.bind(this));
        }).bind(this));

        $(QUESTION + ' ' + SELECT, this.$el)
            .off('change.ali')
            .on('change.ali', (function (e) {
                var $form = $($(e.target).parents(QUESTION)[0]);
                this.itemSelected($form);
            }).bind(this));
    };

    /**
     * Event handler for form submit for each question.
     * @param e
     */
    ali.AnswerSet.prototype.question_onSubmit = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $target = $(e.target);
        var is_correct = parseInt($(SELECT, $target).prop('selectedIndex')) === parseInt($target.attr(CORRECT_ATTR), 10);
        this.showFlag($target, is_correct);
        this.disableQuestion($target);

        this.setCorrectResponses([$(SELECT + ' option', $target).eq(parseInt($target.attr(CORRECT_ATTR), 10)).val()]);
        this.setLearnerResponses([$(SELECT, $target).val()]);
        this.itemComplete(is_correct ? ali.STATUS.correct : ali.STATUS.incorrect, $target);
        this.allQuestionsComplete();
    };

    /**
     * 
     */
    ali.AnswerSet.prototype.allQuestionsComplete = function () {
        var num_questions = $(QUESTION).length, is_correct;
        if (num_questions === $(QUESTION + '[aria-disabled="true"]').length) {
            is_correct = num_questions === $(QUESTION + ' .correct').length;
            this.complete(is_correct ? ali.STATUS.correct : ali.STATUS.incorrect);
        }
    };

    /**
     *
     * @param $target
     */
    ali.AnswerSet.prototype.disableQuestion = function ($target) {
        $target.aria('disabled', 'true');
        $(SELECT + ',' + SUBMIT, $target).aria('disabled', 'true');
    };

    /**
     *
     * @param $target
     * @param is_correct
     */
    ali.AnswerSet.prototype.showFlag = function ($target, is_correct) {
        var $flag = this.makeFlag(
            is_correct ? $target.attr(CORRECT_RESPONSE) : $target.attr(INCORRECT_RESPONSE),
            is_correct ? 'correct' : 'incorrect');

        $flag.aria('hidden', 'true')
            .appendTo($target);

        setTimeout((function () {
            $flag.aria('hidden', 'false');
        }).bind(this), 1);
    };

    /**
     *
     * @param msg
     * @param cls
     */
    ali.AnswerSet.prototype.makeFlag = function (msg, cls) {
        return $('<div class="flag ' + cls + '"><span>' + msg + '</span></div>');
    };

    /*
     * jQuery Plugin
     */
    function Plugin() {
        return this.each(function () {
            new ali.AnswerSet(this);
        });
    }

    var old = $.fn.answerset;
    $.fn.answerset = Plugin;
    $.fn.answerset.Constructor = ali.AnswerSet;

    $.fn.answerset.noConflict = function () {
        $.fn.answerset = old;
        return this;
    };

})(jQuery);
;
/*
 * --------------------------------------------------------------------------
 * Ali: multiple-choice.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ( $ ) {
	"use strict";

	// Make the global object available and abort if this file is used without it.
	var ali = window.ali;
	if ( $.type( ali ) !== 'object' ) {
		return;
	}

	var DESCRIPTION = 'A multiple choice interaction.';
	var TYPE = ali.TYPE.choice;

	/**
	 * Answer Set Interaction
	 * @param element DOMElement
	 * @constructor
	 */
	ali.MultipleChoice = function ( element ) {
		ali.Interaction.call( this, element, TYPE, DESCRIPTION );
		this.init();
	};

	// Inherits from ali.Interaction
	ali.MultipleChoice.prototype = Object.create( ali.Interaction.prototype );
	ali.MultipleChoice.prototype.constructor = ali.MultipleChoice;

	/**
	 * Initialization
	 */
	ali.MultipleChoice.prototype.init = function () {
		this.$el.off( 'submit.ali' ).on( 'submit.ali', this.form_onSubmit.bind( this ) );
		$( 'input', this.$el ).off( 'change.ali' ).on( 'change.ali', this.input_onChange.bind( this ) );
	};

	/**
	 *
	 * @param e
	 */
	ali.MultipleChoice.prototype.input_onChange = function ( e ) {
		this.itemSelected( $( e.target ) );
	};

	/**
	 * Submit Event Handler
	 * @param e
	 */
	ali.MultipleChoice.prototype.form_onSubmit = function ( e ) {
		e.preventDefault();
		e.stopPropagation();

		var result, className, answeredCorrect = true;
		var $inputs = $( 'input', this.$el );

		for ( var i = 0; i < $inputs.length; i ++ ) {
			var t = $( $inputs[ i ] );
			if ( this.truthy( t.attr( "data-correct" ) ) !== this.truthy( t.is( ':checked' ) ) ) {
				answeredCorrect = false;
				break;
			}
		}
		this.setResultData();
		this.complete( answeredCorrect ? ali.STATUS.correct : ali.STATUS.incorrect );
		this.disableInteraction();
	};

	ali.MultipleChoice.prototype.disableInteraction = function () {
		$( 'input', this.$el ).off( 'change.ali' ).aria( 'disabled', "true" );
		$( 'button', this.$el ).aria( 'disabled', "true" );
		this.$el.off( 'submit.ali' ).aria( 'disabled', 'true' );
	};

	/**
	 * Sets the responses for complete events.
	 */
	ali.MultipleChoice.prototype.setResultData = function () {
		var cr = [], ur = [];
		$( 'input[data-correct="true"]', this.$el ).each( (function ( i, el ) {
			cr.push( this.getResponseValue( $( el ) ) );
		}).bind( this ) );

		$( 'input:checked', this.$el ).each( (function ( i, el ) {
			ur.push( this.getResponseValue( $( el ) ) );
		}).bind( this ) );
		this.setCorrectResponses( cr );
		this.setLearnerResponses( ur );
	};

	/**
	 * Returns the value of an option using the label's `for` value.
	 * @param $input
	 * @returns {XMLList|*}
	 */
	ali.MultipleChoice.prototype.getResponseValue = function ( $input ) {
		var id = $input.attr( 'id' );
		return $( 'label[for="' + id + '"]' ).text();
	};

	/*
	 * jQuery Plugin
	 */
	function Plugin() {
		return this.each( function () {
			new ali.MultipleChoice( this );
		} );
	}

	var old = $.fn.answerset;
	$.fn.multiplechoice = Plugin;
	$.fn.multiplechoice.Constructor = ali.MultipleChoice;

	$.fn.multiplechoice.noConflict = function () {
		$.fn.multiplechoice = old;
		return this;
	};

})( jQuery );
;
/*
 * --------------------------------------------------------------------------
 * Ali: ordered-items.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ($) {
    "use strict";

    // Make the global object available and abort if this file is used without it.
    var ali = window.ali;
    if ($.type(ali) !== 'object') {
        return;
    }

    var DESCRIPTION = 'Sequenced elements interaction.';
    var TYPE = ali.TYPE.sequencing;

    var TRANSITION_DURATION = 400;

    /**
     * Ordered Items interaction class
     * @param element DOMElement
     * @constructor
     */
    ali.OrderedItems = function (element) {
        ali.Interaction.call(this, element, TYPE, DESCRIPTION);
        this.init();
    };

    // Inherits from ali.Interaction
    ali.OrderedItems.prototype = Object.create(ali.Interaction.prototype);
    ali.OrderedItems.prototype.constructor = ali.OrderedItems;


    /**
     * Collection of items ( usually 'li' elements ).
     * @type {undefined}
     */
    ali.OrderedItems.prototype.$items = undefined;

    /**
     * Collection of items ( usually 'select' elements ).
     * @type {undefined}
     */
    ali.OrderedItems.prototype.$selects = undefined;

    /**
     * Flag used in rAF to debounce
     * @type {boolean}
     * @private
     */
    ali.OrderedItems.prototype._resizing = false;

    /**
     * Container for the currently moving item
     * Required as some rAF uses lose their locals
     * @type {jQuery}
     */
    ali.OrderedItems.prototype.$currentItem = undefined;

    /**
     * Initializes the Interaction. Called from constructor.
     */
    ali.OrderedItems.prototype.init = function () {
        this.$items = $('li', this.$el);
        this.createElements();

        this.$selects = $('select', this.el);
        this.$el.off('submit.ali').on('submit.ali', this.form_onSubmit.bind(this));
        $(window).on('resize', this.window_onResize.bind(this));
        this.updateHeight();
        this.updateClasses();
    };

    /**
     * Adds the select dropdown and icon base HTML for each list item.
     */
    ali.OrderedItems.prototype.createElements = function () {
        var num = this.$items.length;
        // only create the select drop-down once
        var $sel = $('<select></select>');
        for (var i = 1; i <= num; i++) {
            $sel.append('<option>' + i + '</option>');
        }

        this.$items.each((function (index, el) {
            var $el = $(el);
            var id = this.$el.attr('id') + "-item-" + index;

            // clone the drop-down and attach the generated ID and index
            var $selInstance = $sel.clone();
            $selInstance.attr('id', id);
            $selInstance[0].selectedIndex = index;

            // Add the select and icon to the current element
            var $sl = $('<span class="item-select"></span>').append($selInstance);
            $el.append($sl).prepend('<i>' + (index + 1) + '</i>');

            // link user-created label to the code-created select drop-down
            $('label', $el).attr('for', id);
        }).bind(this));
    };

    /**
     * Event Handler for the resize event. Handler de-bounces the events
     * using rAF and a _resizing flag.
     * @see updateHeight
     */
    ali.OrderedItems.prototype.window_onResize = function () {
        if (!this._resizing) {
            this._resizing = true;
            window.requestAnimationFrame(this.updateHeight.bind(this));
        }
    };

    /**
     *  Equalizes the height of all items and updates the height of the list element itself
     *  Only called by rAF and on init
     */
    ali.OrderedItems.prototype.updateHeight = function () {
        // Equalize the elements height based on the height of the label with padding
        var h = 0;
        this.$items.each(function (i, el) {
            h = Math.max(h, $('label', el).outerHeight());
        });
        this.$items.height(h);

        //UPDATED: IE10 can't use calc with translate, so we
        // figure height by the outerHeight * 124%,
        // the 24% being the margin used in the CSS file.
        var oH = $(this.$items[0]).outerHeight();
        $('.list-elements', this.$el).height(( oH * this.$items.length * 1.24));

        // reset the flag
        this._resizing = false;
    };

    /**
     * Adds the focus and change events to the select drop-downs
     */
    ali.OrderedItems.prototype.addSelectEvents = function () {
        this.$selects
            .off('change.ali').on('change.ali', this.select_onChange.bind(this))
            .off('focus.ali').on('focus.ali', this.select_onFocus.bind(this));
    };

    /**
     * Removes the focus and change events from the select drop-downs so we can
     * manipulate them without generating too events
     */
    ali.OrderedItems.prototype.removeSelectEvents = function () {
        this.$selects.off('change.ali').off('focus.ali');
    };

    /**
     * Very simple event handler that assigns a data value to the
     * element containing the current value.
     * @param e {Event}
     */
    ali.OrderedItems.prototype.select_onFocus = function (e) {
        $(e.target).attr('data-prev-value', e.target.selectedIndex);
    };

    /**
     * Event handler for the change event
     * @param e
     */
    ali.OrderedItems.prototype.select_onChange = function (e) {
        // remove the events on the drop-downs so we don't create
        // pointless events while manipulating the selects
        this.removeSelectEvents();
        this.$currentItem = $(e.target);

        // add the 'moving' class to the current item
        // in the base style this adds the shadow and a z-index
        $(this.$currentItem.parents('li'))
            .addClass('moving')
            // Remove the class on transition end
            // Much love to the Bootstrap crew for the
            // emulation pattern
            .one(ali.transitionEnd, function (e) {
                $(e.target).removeClass('moving');
            })
            .emulateTransitionEnd(TRANSITION_DURATION);

        this.itemSelected(this.$currentItem);
        // reordering is a little time-consuming so defer it
        // until before the next paint
        window.requestAnimationFrame(this.reorderValues.bind(this));
    };

    /**
     *
     * @param e
     */
    ali.OrderedItems.prototype.form_onSubmit = function (e) {
        e.preventDefault();
        e.stopPropagation();

        var correct = true;
        var selectedOrder = [];
        var correctOrder = [];

        this.$items.each(function () {
            var $el = $(this);
            var $sel = $('select', $el);
            // get the correct and selected index
            var cIndex = parseInt($el.attr('data-correct'), 10);
            var sIndex = parseInt($sel[0].selectedIndex + 1);

            //create SCORM/xAPI arrays for correct & selected
            var label = $('label', $el).text();
            selectedOrder[sIndex] = label;
            correctOrder[cIndex] = label;

            // If one step is out of order, this was answered incorrectly.
            if (cIndex !== sIndex) {
                correct = false;
            }
        });

        this.setCorrectResponses(correctOrder);
        this.setLearnerResponses(selectedOrder);
        this.complete(correct ? ali.STATUS.correct : ali.STATUS.incorrect);
    };

    /**
     * Re-orders the elements based off of the current select element.
     * @todo There has to be a less complex way of handling this -- future
     */
    ali.OrderedItems.prototype.reorderValues = function () {
        var newValue = this.$currentItem[0].selectedIndex;
        var previousValue = this.previousValue(this.$currentItem);

        // Remove this item from the order
        // moving the others up
        this.$selects.each((function (i, el) {
            var $el = $(el);
            if (!$el.is(this.$currentItem)) {
                var localVal = $el[0].selectedIndex;
                if (localVal >= previousValue) {
                    $el[0].selectedIndex = localVal - 1;
                }
            }
        }).bind(this));

        // Insert the changed element at it's new location,
        // moving the others down.
        this.$selects.each((function (i, el) {
            var $el = $(el);
            if (!$el.is(this.$currentItem)) {
                var localVal = $el[0].selectedIndex;
                if (localVal >= newValue) {
                    $el[0].selectedIndex = localVal + 1;
                }
            }
        }).bind(this));
        // Altering the UI should wait until the next paint
        window.requestAnimationFrame(this.updateClasses.bind(this));
    };

    /**
     * Adds classes to the list elements, causing the elements to animate into
     * their new position.
     */
    ali.OrderedItems.prototype.updateClasses = function () {
        this.$items.each(function (i, el) {
            var $el = $(el);
            var $select = $('select', $el);
            $el.removeClass(function (index, css) {
                return (css.match(/(^|\s)item-\S+/g) || []).join(' ');
            }).addClass('item-' + $select.val());
            $('i', $el).text($select.val());
        });

        // add the events back
        this.addSelectEvents();

        if (this.$currentItem && this.$currentItem.length > 0) {
            // trigger the focus event on the current item so that the
            // current value is populated
            this.$currentItem.trigger('focus');
        }
    };

    ali.OrderedItems.prototype.previousValue = function ($el) {
        return parseInt($el.attr('data-prev-value'), 10);
    };

    /*
     * jQuery Plugin
     */
    function Plugin() {
        return this.each(function () {
            new ali.OrderedItems(this);
        });
    }

    var old = $.fn.ordereditems;
    $.fn.ordereditems = Plugin;
    $.fn.ordereditems.Constructor = ali.OrderedItems;

    $.fn.ordereditems.noConflict = function () {
        $.fn.ordereditems = old;
        return this;
    };
})
(jQuery);
;
/*
 * --------------------------------------------------------------------------
 * Ali: thinking-question.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ( $ ) {
	"use strict";

	// Make the global object available and abort if this file is used without it.
	var ali = window.ali;
	if ( $.type( ali ) !== 'object' ) {
		return;
	}

	var DESCRIPTION = 'Long-form text answer';
	var TYPE = ali.TYPE.longAnswer;

	/**
	 * Answer Set Interaction
	 * @param element DOMElement
	 * @constructor
	 */
	ali.ThinkingQuestion = function ( element ) {
		ali.Interaction.call( this, element, TYPE, DESCRIPTION );
		this.init();
	};

	// Inherits from ali.Interaction
	ali.ThinkingQuestion.prototype = Object.create( ali.Interaction.prototype );
	ali.ThinkingQuestion.prototype.constructor = ali.ThinkingQuestion;

	/**
	 * Initializes the control
	 */
	ali.ThinkingQuestion.prototype.init = function () {
		// add the submit event listener
		this.$el.off( 'submit.ali' ).on( 'submit.ali', this.form_onSubmit.bind( this ) );

		// fetch any previously entered text, using an empty string if fetching that information fails.
		var previous = '';
		try {
			previous = localStorage.getItem( this.$el.attr( 'id' ) );
		} catch ( error ) {
			previous = '';
		}
		// ensure that the textarea has a label element -- the question stem element works best.
		var ta_id = this.$el.attr( 'id' ) + '-textarea';
		$( 'textarea', this.$el ).val( previous ).aria( 'labeledby', ta_id );
		$( 'question', this.$el ).attr( 'id', ta_id );
	};

	/**
	 *
	 * @param e
	 * @returns {boolean}
	 */
	ali.ThinkingQuestion.prototype.form_onSubmit = function ( e ) {
		e.preventDefault();
		e.stopPropagation();
		var response = $( 'textarea', this.$el ).val();
		if ( response.length > 0 ) {
			$( 'button, textarea' ).aria( 'disabled', 'true' );
			this.setLearnerResponses( [ response ] );
			this.complete( ali.STATUS.complete );
			try {
				window.localStorage.setItem( this.$el.attr( 'id' ), response );
			}
			catch ( error ) {
				return false;
			}
		}

	};


	/*
	 * jQuery Plugin
	 */
	function Plugin() {
		return this.each( function () {
			new ali.ThinkingQuestion( this );
		} );
	}

	var old = $.fn.answerset;
	$.fn.thinkingquestion = Plugin;
	$.fn.thinkingquestion.Constructor = ali.ThinkingQuestion;

	$.fn.thinkingquestion.noConflict = function () {
		$.fn.thinkingquestion = old;
		return this;
	};

})( jQuery );
;
/*
 * --------------------------------------------------------------------------
 * Ali: card.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function ( $ ) {
	"use strict";

	// Make the global object available and abort if this file is used without it.
	var ali = window.ali;
	if ( $.type( ali ) !== 'object' ) {
		return;
	}

	var DESCRIPTION = 'A collection of question/scenario - result sets.';
	var TYPE = ali.TYPE.other;

	/**
	 * Card Carousel container element
	 * @param element
	 * @constructor
	 */
	ali.CardCarousel = function ( element ) {
		ali.Interaction.call( this, element, TYPE, DESCRIPTION );
		this.$el = $( element );
		this.init();
	};

	// Inherits from ali.Interaction for timing and complete event
	ali.CardCarousel.prototype = Object.create( ali.Interaction.prototype );
	ali.CardCarousel.prototype.constructor = ali.CardCarousel;

	/**
	 * The index of the active element
	 * @type {number}
	 */
	ali.CardCarousel.prototype.activeElement = 0;

	/**
	 * Initializes the carousel
	 */
	ali.CardCarousel.prototype.init = function () {
		// ensure cards are wrapped in the card-wrapper class
		// Manually wrapping them in the HTML avoids jank, but this statement allowing for lazy.
		if ( $( '.card:first', this.$el ).parents( '.card-wrapper' ).length === 0 ) {
			$( '.card', this.$el ).wrap( '<div class="card-wrapper"></div>' );
		}
		// Cards *should* have a uniform height, but on the off-chance someone modifies this
		// find the max-height of all cards and apply that height to the parent element.
		var maxHeight = Math.max.apply(
			null,
			$( '.card', this.$el ).map( function () {
				return $( this ).outerHeight( true );
			} ).get()
		);
		this.$el.height( maxHeight );
		this.updateClasses();

		// Carousels don't have their own navigation elements and instead
		// binds two additional buttons on the cards themselves
		$( '.show-next', this.$el ).off( 'click.ali' ).on( 'click.ali', this.onShowNext.bind( this ) );
		$( '.show-first', this.$el ).off( 'click.ali' ).on( 'click.ali', this.onShowFirst.bind( this ) );
	};


	/**
	 * Event Handler for the 'show-next' buttons. Additionally fires the complete event when all cards are viewed.
	 * @param e
	 */
	ali.CardCarousel.prototype.onShowNext = function ( e ) {
		e.preventDefault();
		e.stopPropagation();
		this.activeElement ++;
		this.updateClasses();

		// activeElement is 0 indexed
		if ( this.activeElement === $( '.card', this.$el ).length - 1 ) {
			this.complete( ali.STATUS.complete );
		}

		setTimeout( this.focusNextCard.bind( this ), 600 );
	};

	ali.CardCarousel.prototype.focusNextCard = function () {
		$( '.card-wrapper[aria-hidden="false"] .card', this.$el ).focus();
	};

	/**
	 * Event handler for the 'show-first' button. Additionally, resets all cards.
	 * @param e
	 */
	ali.CardCarousel.prototype.onShowFirst = function ( e ) {
		e.preventDefault();
		e.stopPropagation();

		this.activeElement = 0;
		this.updateClasses();
		$( '.card', this.$el ).card( 'showFront' );
	};

	/**
	 * Updates the classes for all cards based on the active element
	 * Classes are:
	 * - .before: is before the active card
	 * - .after:  after the active card
	 * - .hinted: card is adjacent to the active card -- can be used to allow the card to "peek" on the left/right
	 *            edge of the screen, if the styles are applied.
	 */
	ali.CardCarousel.prototype.updateClasses = function () {
		// Note: this method builds a string then applies it in one step
		// rather than adding/removing classes individually because I noticed
		// some jank using the individual add/remove method.
		var classString;
		$( '.card-wrapper', this.$el ).each( (function ( i, el ) {
			classString = 'card-wrapper ';
			if ( i !== this.activeElement ) {
				if ( i < this.activeElement ) {
					classString += "before ";
					if ( i === this.activeElement - 1 ) {
						classString += "hinted ";
					}
				} else {
					classString += "after ";
					if ( i === this.activeElement + 1 ) {
						classString += "hinted ";
					}
				}
			}
			$( el ).attr( 'class', classString )
			       .aria( 'hidden', i === this.activeElement ? 'false' : 'true' );
		}).bind( this ) );
	};


	/*
	 * jQuery Plugin
	 */
	function Plugin() {
		return this.each( function () {
			new ali.CardCarousel( this );
		} );
	}

	var old = $.fn.cardcarousel;
	$.fn.cardcarousel = Plugin;
	$.fn.cardcarousel.Constructor = ali.CardCarousel;

	$.fn.cardcarousel.noConflict = function () {
		$.fn.cardcarousel = old;
		return this;
	};

})( jQuery );