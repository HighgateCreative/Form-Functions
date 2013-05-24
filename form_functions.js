function normalize_labels(element, prefix) {   
	var options = {};
	if (!(typeof prefix === 'undefined')) {
		options.element = element;
		options.prefix = prefix;
	} else if ( element ) {
		options.element = element;
	}
	$(".errors_above").css('display','none'); //situated by submit button
	if(options.element){
		$('#'+$(options.element).attr('id')+' label[for]').not('.static_label').each(function(){
			if ($(this).attr('lab')) {
				var lab = $(this).attr('lab');
			} else {
				var lab = $(this).attr('for');
			}
			if ($('label.static_label[for="'+$(this).attr('for')+'"]').length != 0 ) {
				lab = '';
			}
			//$($("input[id='"+lab+"']")).css('background-color','#fff');
			lab = lab.slice(0,1).toUpperCase() + lab.slice(1);
			lab = lab.replace(/_/g, " ");
			$(this).removeClass('error_label');
			$(this).text(lab);
		});
	} else {
		$('label').not('.static_label').each(function(){   
			if ($(this).attr('lab')) {
				var lab = $(this).attr('lab');
			} else {
				var lab = $(this).attr('for');
			}
			if ($('label.static_label[for="'+$(this).attr('for')+'"]').length != 0 ) {
				lab = '';
			}
			//$($("input[id='"+lab+"']")).css('background-color','#fff');
			lab = lab.slice(0,1).toUpperCase() + lab.slice(1);
			lab = lab.replace(/_/g, " ");
			$(this).removeClass('error_label');
			$(this).text(lab);
		});
	}
}
         
function parse_results(result, form, msgdiv, leave_open, not_reset_form, prefix) {
	var options = {
      overlay: true,
      showSuccessMsg: true
   };
	if (!(typeof form === 'undefined')) {
		options.result = result;
		options.form = form;
		options.msgdiv = msgdiv;
		options.leave_open = leave_open;
		options.not_reset_form = not_reset_form;
		options.prefix = prefix;
	} else {
		options = $.extend({},options,result);
	}
   if (options.overlay) {
      $("#overlay").css('display','none');
   }
	$('#'+options.msgdiv+' p.error').remove();
	var success = '';
	if ( typeof options.result == 'string' && options.result[0] == '[') {
		eval( "options.result = " + options.result );
	}
	if ( typeof options.result == 'string' && options.result.match(/.+\[\{"messages/ ) ) {
		eval( "options.result = "+options.result.replace(/.+\[\{"messages/,'[{"messages').replace("</pre>",'')+";");
	}

   var msgArray;
   if (options.result instanceof Array) {
      msgArray = options.result[0].messages;
   } else {
      if (options.result.errors) {
         msgArray = options.result.errors;
      } else {
         msgArray = options.result.success;
      }
   }
	$.each(msgArray, function(i,o) {
		for (var p in o) {
			var val = o[p]; //p is the key or id in this case, and val is the message

			if (p == 'success') {
            if ( val instanceof Array ) {
               $.each(val, function(i,el) {
                  success += '<p class="success">' + el + '</p>';
               });
            } else {
               success += '<p class="success">' + val + '</p>';
            }
			} else if (p.substring(0,3) == 'su_') { 
				$($("label[for='"+p.substring(3)+"']")).not('.static_label').each(function(){
					$(this).addClass('success_label');
               var label;
					if ($(this).attr('lab')) {
						label = $(this).attr('lab').slice(0,1).toUpperCase() + $(this).attr('lab').slice(1);
					} else {
						label = $(this).attr('for').slice(0,1).toUpperCase() + $(this).attr('for').slice(1);
					}
               label = label.replace(/_/g, " ");
					$(this).html(label + ' ' + val);
				}); //for loop
				$(".errors_above").css('display','block'); //situated by submit button
				if ( p == 'captcha' || p == 'generic' ) { 
					$('#'+options.msgdiv).css('display','block');
					$('#'+options.msgdiv).append('<p class="error">'+val+'</p>');
				}
			} else if (p == 'output') {
				return;
			} else {
				p = p.replace('&#228;','ä');
				p = p.replace('&#196;','Ä');
				p = p.replace('&#246;','ö');
				p = p.replace('&#214;','Ö');
				p = p.replace('&#252;','ü');
				p = p.replace('&#220;','Ü');
				p = p.replace('&#223;','ß');
				$($("#"+options.form+" label[for='"+p+"']")).not('.static_label').each(function(){
					$(this).addClass('error_label');
					if ($(this).attr('lab')) {
						label = $(this).attr('lab').slice(0,1).toUpperCase() + $(this).attr('lab').slice(1);
					} else {
                  label = $(this).attr('for');
                  if (options.prefix) {
                     label = label.replace(options.prefix, "");
                  }
						label = label.slice(0,1).toUpperCase() + label.slice(1);
					}
               label = label.replace(/_/g, " ");
					$(this).html(label + ' ' + val);
				}); //for loop
				$(".errors_above").css('display','block'); //situated by submit button
				if ( p == 'captcha' || p == 'generic' ) { 
					$('#'+options.msgdiv).css('display','block');
					$('#'+options.msgdiv).append('<p class="error">'+val+'</p>');
				}
			}
		}
	});//each

	if (success) {
		if (!options.leave_open) {
			$('#'+options.form).hide("fast");
		}
		if (!options.not_reset_form) {
			$('#'+options.form).resetForm();
		}
   
      if (options.showSuccessMsg) {
         $('#'+options.msgdiv).css('display','block');
         $('#'+options.msgdiv+' p').css('display','block');
         $('#'+options.msgdiv+' p.error').css('display','none');
         $('#'+options.msgdiv).append(success);
      }

		$('html, body').animate({scrollTop:0}, 'fast');
		if (typeof options.success === 'function') {
			options.success(options.result);
		}
		if (typeof redirect_set != 'undefined' && redirect_set) {
			redirect();
		} else if ( typeof options.redirect === 'function' ) {
			options.redirect();
		}
	} else {
		if (typeof options.error === 'function') {
			options.error(options.result);
		}
   }
}

$(function() {
	//Bind up key for counters
	$('textarea.counter').live('keyup', function(event) {
		var text = $(this).val();
		var len = text.length;

		if ($(this).hasClass('count_down')) {
			$(this).siblings('input.counter').val($(this).attr('size')-len);
		} else {
			$(this).siblings('input.counter').val(len);
		}
		if (len > $(this).attr('size')) {
			$(this).siblings('input.counter').css('background','pink');
			alert("Please keep your answers within "+$(this).attr('size')+" characters. And please, no pasting of any word processing files. Thank you.");
			return false;
		} else {
			$(this).siblings('input.counter').css('background','#fff');
			return;
		}
	});
});

//handle counters
function counter(num,size,id,down) {
	var text = document.getElementById(id).value;
	var len = text.length;
	if (down) {
		document.getElementById("counter"+num).value = size-len;
	} else {
		document.getElementById("counter"+num).value = len;
	}
	if (len > size) {
		document.getElementById("counter"+num).style.background = 'pink';
		alert("Please keep your answers within "+size+" characters. And please, no pasting of any word processing files. Thank you.");
		return false;
	} else {
		document.getElementById("counter"+num).style.background = '#fff';
		return;
	}
}

//format currency with rounding
function format_currency(amt) {
	namount  = Math.abs(amt);
	namount  = parseInt((namount + .005) * 100);
	namount  = namount / 100;
	var samount = new String(namount );
	if(samount.indexOf('.') < 0) { samount  += '.00'; }
	if(samount.indexOf('.') == (samount .length - 2)) { samount  += '0'; }
	return samount;
}
