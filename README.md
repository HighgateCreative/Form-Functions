# Form-Functions

jQuery library for reporting form submission responses.

## Usage
form_functions.js assumes the form has an id and there is an element which will display general errors and success messages. We provide `parse_results()` with those two ids and the results received from malsup's form plugin.

```html
<div id="msgs"></div> <!-- Message holder -->
<form id="contact" action="/someplace">
  <input type="submit" value="Go">
</form>

<script>
// Declare configuration for Form Functions
var ffOpts = {
  form: 'contact',
  msgdiv: 'msgs',
  success: function (result) {
    if ( result.path ) {
      window.location="/" + result.path;
    } else {
      window.location="/thanks";
    }
  }
};
// Create form function object for this form
var formFunctions = new FormFunctions(ffOpts);

$('#contact').ajaxForm({
  type: "POST",
  url: $(this).attr('action'),
  datatype: "json",
  beforeSubmit: function () {
    // Call form_functions.js's to reset all the <label>s
    normalize_labels($('#product_form'));
  },
  // Create error callback for general server errors
  error: formFunctions.reportServerErrorCallback(),
  success: function (result) {
    // Call form_functions.js's parse_results() to check for errors
    // in the response
    ffOpts.result = result
    parse_results(ffOpts);
  }
}); //submit
</script>
```

## Options

### parse_results

```js
parse_results({
  result: result,               // Results from server
  form: 'contact',              // The form's jQuery object or id
  msgdiv: 'msgs',               // Id of element to display general messages
  leave_open: true,             // Default ( false ) – Whether the form
                                // should be left open on success
  scrollToError: true,          // Default ( false ) – When set to true,
                                // scrolls to the first error in the form
                                // when errors are returned
  not_reset_form: true,         // Default ( false ) – Whether to reset
                                // form after successful submission
  prependMsg: true,             // Default ( false ) – Whether messages added
                                // to the `msgdiv` element are prepended
                                // instead of appended.
  prefix: 'contact_',           // Prefix all errors with the given string
                                // to find the corresponding <label>'s
                                // "for" attr.
  errorsOnField: false,         // Default ( true ) – Whether errors should
                                // be added to fields
  overlay: false,               // Default ( true ) – Whether to place an
                                // overlay over the form. The overlay is
                                // assumed to be already provided as an
                                // element with id "overlay"
  showSuccessMsg: false,        // Default ( true ) – Whether to show the
                                // success message
  success: function (result) {  // Callback for when no errors are found.
                                // `result` is the results originally passed
                                // into the result argument.
    if ( result.path ) {
        window.location="/" + result.path;
    } else {
        window.location="/thanks";
    }
  },
  error: function (result) {}   // Callback for when errors are found.
                                // `result` is the results originally
                                // passed into the result argument.
});
```

### FormFunctions

This constructor is an object that holds how a give form is to parse and respond
to errors and submissions of the form. It has helper methods that provide ready
made solutions to receiving, manage and displaying error messages.

```js
var formFunctions = new FormFunctions({
  // Same options as parse_results
});
```

#### reportServerErrorCallback

This method of `FormFunctions` generates a callback handler to post general
error messages from the server such as `500` errors, timeouts and aborted
submissions. Pass this as an [error handler](http://api.jquery.com/jquery.ajax/) for jQuery's `$.ajax()`.

```js
var formFunctions = new FormFunctions({ msgdiv: '#msg' });

$('form').ajaxForm({
  error: formFunctions.reportServerErrorCallback(),
  success: function (result) {
    var opts = {
      msgdiv: '#msg',
      result: result,
      ...
    };
    parse_results(opts);
  }
});
```

## Contribute
PRs Welcomed!!

When contributing make sure you compile the js otherwise you will be asked to update your PR with the compiled js.

To compile:

```sh
grunt
```

To watch files and compile on the fly:

```sh
grunt watch
```
