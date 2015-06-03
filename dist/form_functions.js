/*
 *  Form-Functions - v1.1.2
 *  Help functions for processing form errors
 *  http://highgate-creative.com
 *
 *  Made by Sean Zellmer <sean@lejeunerenard.com>
 *  Under MIT License
 */
function normalize_labels(element, prefix) {
    var options = {};
    if (typeof prefix !== "undefined") {
        options.element = element;
        options.prefix = prefix;
    } else if ( element ) {
        options.element = element;
    }
    $(".errors_above").css("display","none"); //situated by submit button
    var selector;
    if(options.element){
        selector = $("#"+$(options.element).attr("id")+" label[for]");
    } else {
        selector = $("label[for]");
    }
    // Now normalize
    selector.not(".static_label").each(function(){
        $(this).removeClass("error_label");
        var lab = getLabel(this, options);
        if ($("label.static_label[for=\""+$(this).attr("for")+"\"]").length !== 0 ) {
            lab = "";
        }
        $(this).text(lab);
    });
}

function preprocess_result(result) {
    if ( typeof result === "string" && result[0] === "[") {
        result = JSON.parse(result);
    }
    if ( typeof result === "string" && result.match(/.+\[\{"messages/ ) ) {
        result = JSON.parse(result.replace(/.+\[\{"messages/,"[{\"messages").replace("</pre>",""));
    } else if ( typeof result === "string" ) {
        result = JSON.parse($(result).text());
    }

    var msgArray;
    if (result instanceof Array) {
        msgArray = result[0].messages;
    } else {
        if (result.errors) {
            msgArray = result.errors;
        } else {
            msgArray = result.success;
        }
    }
    return msgArray;
}
function parse_results(result, form, msgdiv, leave_open, not_reset_form, prefix) {
    var options = {
        overlay: true,
        showSuccessMsg: true,
        form: $("form").first(),
        scrollToError: false
    };
    if (typeof form !== "undefined") {
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
        $("#overlay").css("display","none");
    }
    $("#"+options.msgdiv+" p.error").remove();
    var success = "";

    // Cache form jQuery object
    var $form;
    // Check if form option is a jQuery object
    if ( options.form instanceof $ ) {
        $form = options.form;
    } else {
        // Otherwise assume it's an id for the form
        $form = $("#"+options.form);
    }

    $.each(preprocess_result(options.result), function(i,o) {
        for (var p in o) {
            var val = o[p]; //p is the key or id in this case, and val is the message

            if (p === "success") {
                if ( val instanceof Array ) {
                    $.each(val, function(i,el) {
                        success += $("<textarea />").html("<p class=\"success\">" + el + "</p>").text();
                    });
                } else {
                    success += $("<textarea />").html("<p class=\"success\">" + val + "</p>").text();
                }
            } else if (p.substring(0,3) === "su_") {
                $($("label[for='"+p.substring(3)+"']")).not(".static_label").each(function(){
                    $(this).addClass("success_label");
                    $(this).html(getLabel(this, options) + " " + val);
                }); //for loop
                $(".errors_above").css("display","block"); //situated by submit button
                if ( p === "captcha" || p === "generic" ) {
                    $("#"+options.msgdiv).css("display","block");
                    $("#"+options.msgdiv).append("<p class=\"error\">"+val+"</p>");
                }
            } else if (p === "output") {
                return;
            } else {
                p = p.replace("&#228;","ä");
                p = p.replace("&#196;","Ä");
                p = p.replace("&#246;","ö");
                p = p.replace("&#214;","Ö");
                p = p.replace("&#252;","ü");
                p = p.replace("&#220;","Ü");
                p = p.replace("&#223;","ß");

                // Either the label is a general error or a specific error
                if ( p === "captcha" || p === "generic" ) {
                    $("#"+options.msgdiv).css("display","block");
                    $("#"+options.msgdiv).append("<p class=\"error\">"+val+"</p>");
                } else {
                    var labels = $($form.find("label[for='"+p+"']")).not(".static_label");
                    labels.each(function(){
                        $(this).addClass("error_label");
                        $(this).html(getLabel(this, options) + " " + val);
                    });

                    // If no labels were found, make it a general label
                    if ( labels.length <= 0 ) {
                        // Get readable version of field
                        var fieldNameReadable = p.replace(/_/, " ");
                        if ( options.capitalize ) {
                            fieldNameReadable = fieldNameReadable.slice(0,1).toUpperCase() + fieldNameReadable.slice(1);
                        }

                        $("#"+options.msgdiv).css("display","block");
                        $("#"+options.msgdiv).append("<p class=\"error\">" + fieldNameReadable + " " + val + "</p>");
                    }
                }

                $(".errors_above").css("display","block"); //situated by submit button
            }
        }
    });//each

    if (success) {
        if (!options.leave_open) {
            $form.hide("fast");
        }
        if (!options.not_reset_form) {
            $form.resetForm();
        }

        if (options.showSuccessMsg) {
            $("#"+options.msgdiv).css("display","block");
            $("#"+options.msgdiv+" p").css("display","block");
            $("#"+options.msgdiv+" p.error").css("display","none");
            $("#"+options.msgdiv).append(success);
        }

        $("html, body").animate({scrollTop:0}, "fast");
        if (typeof options.success === "function") {
            options.success(options.result);
        }
        if (typeof redirect_set !== "undefined" && redirect_set) {
            redirect();
        } else if ( typeof options.redirect === "function" ) {
            options.redirect();
        }
    } else {
        // Scroll to First error
        if ( options.scrollToError ) {
            // First check for an error in the msg element
            var firstError = $("#" + options.msgdiv + " .error");
            // If no elements are found use the first error label
            if ( firstError.length === 0 ) {
                firstError = $form.find(".error_label, .error");
            }
            // Now animate a scroll to whatever we found
            $("html, body").animate({ scrollTop: firstError.offset().top }, "fast");
        }

        if (typeof options.error === "function") {
            options.error(options.result);
        }
    }
}

function getLabel(that, options) {
    if (! $(that).data("lab")) {
        var value = $(that).attr("lab") || $(that).text();
        $(that).data("lab", value);
    }
    var label = $(that).data("lab") || $(that).attr("lab") || $(that).attr("for");

    if (options.prefix) {
        label = label.replace(options.prefix, "");
    }
    if (options.capitalize) {
        label = $(that).attr("lab").slice(0,1).toUpperCase() + $(that).attr("lab").slice(1);
    }
    label = label.replace(/_/g, " ");
    return label;
}

$(function() {
    //Bind up key for counters
    $(document).on("keyup", "textarea.counter", function() {
        var text = $(this).val();
        var len = text.length;

        if ($(this).hasClass("count_down")) {
            $(this).siblings("input.counter").val($(this).attr("size")-len);
        } else {
            $(this).siblings("input.counter").val(len);
        }
        if (len > $(this).attr("size")) {
            $(this).siblings("input.counter").css("background","pink");
            alert("Please keep your answers within "+$(this).attr("size")+" characters. And please, no pasting of any word processing files. Thank you.");
            return false;
        } else {
            $(this).siblings("input.counter").css("background","#fff");
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
        document.getElementById("counter"+num).style.background = "pink";
        alert("Please keep your answers within "+size+" characters. And please, no pasting of any word processing files. Thank you.");
        return false;
    } else {
        document.getElementById("counter"+num).style.background = "#fff";
        return;
    }
}

//format currency with rounding
function format_currency(amt) {
    namount  = Math.abs(amt);
    namount  = parseInt((namount + 0.005) * 100);
    namount  = namount / 100;
    var samount = String(namount );
    if(samount.indexOf(".") < 0) { samount  += ".00"; }
    if(samount.indexOf(".") === (samount .length - 2)) { samount  += "0"; }
    return samount;
}
