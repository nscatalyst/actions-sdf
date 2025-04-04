/* [CTC-CLICKUP-TASK-ID: CST-33383] */
/* [CTC-NS-DEPLOY-TARGET: 595110] */
/**
 */
function onRequest(request, response) {
    // Check if the request is GET or POST
    if (request.getMethod() === 'GET') {
        // Create a form
        var form = nlapiCreateForm('Sample Suitelet Form');

        // Add fields to the form
        var nameField = form.addField('custpage_name', 'text', 'Name');
        var emailField = form.addField('custpage_email', 'text', 'Email');

        // Add a submit button
        form.addSubmitButton('Submit');

        // Render the form to the screen
        response.writePage(form);

    } else { // POST request
        // Get the submitted values
        var name = context.request.getParameter('custpage_name');
        var email = context.request.getParameter('custpage_email');

        // Create a response message
        var form = nlapiCreateForm('Submission Result');
        form.addField('custpage_message', 'inlinehtml', 'Result');
        var message = 'You submitted the following information:<br>';
        message += 'Name: ' + name + '<br>';
        message += 'Email: ' + email;
        form.getField('custpage_message').setDefaultValue(message);

        // Add a button to go back to the original form
        form.addButton('custpage_back_button', 'Go Back', 'window.history.back()');

        // Render the form with the result message
        response.writePage(form);
    }
}
