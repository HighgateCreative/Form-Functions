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
$('#contact').ajaxForm({
  type: "POST",
  url: $(this).attr('action'),
  datatype: "json",
  beforeSubmit: function(){
    // Call form_functions.js's to reset all the <label>s
    normalize_labels($('#product_form'));
  },
  success: function(result){
    // Call form_functions.js's parse_results() to check for errors
    // in the response
    parse_results({
      result: result,
      form: 'contact',
      msgdiv: 'msgs',
      success: function (result) {
        if ( result.path ) {
          window.location="/" + result.path;
        } else {
          window.location="/thanks";
        }
      }
    });
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
  leave_open: false,            // Default ( true ) – Whether the form
                                // should be left open on success
  scrollToError: true,          // Default ( false ) – When set to true,
                                // scrolls to the first error in the form
                                // when errors are returned
  not_reset_form: true,         // Default ( false ) – Whether to reset
                                // form after successful submission
  prefix: 'contact_',           // Prefix all errors with the given string
                                // to find the corresponding <label>'s
                                // "for" attr.
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

## Contribute
PRs Welcomed!!

When contributing make sure you compile the js otherwise you will be asked to update your PR with the compiled js.

To compile:

```sh
grunt
```
