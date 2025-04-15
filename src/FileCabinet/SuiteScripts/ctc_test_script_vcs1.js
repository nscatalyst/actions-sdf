/* [CTC-CLICKUP-TASK-ID: CST-3158] */
/* [CTC-NS-DEPLOY-TARGET: tstdrv1716438] */
function suitelet(request, response) {
    try {
        // Create a form for display
        var form = nlapiCreateForm('UKG API Data Retrieval');
        
        // Add a button to refresh/reload the data
        form.addSubmitButton('Retrieve UKG Data');
        
        // If the form is submitted (button clicked), make the API call
        if (request.getMethod() == 'POST') {
            // Using the provided credentials - no authentication step needed as token is provided
            var apiEndpoint = "https://secure.saashr.com/ta/rest/v2/companies/|6194045/config/cost-centers/60242681606";
            var authToken = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE3NDQ3NTYzNDksImlhdCI6MTc0NDc1Mjc0OSwiaXNzIjoiaHR0cHM6Ly9zZWN1cmUuc2Fhc2hyLmNvbSIsInN1YiI6IjE3MjkxNjczMzc1IiwiYXVkIjpbInNlY3VyZTYuc2Fhc2hyLmNvbSJdLCJqdGkiOiJmYzc3NjE5Yi0yNDBiLTRjMzItODkzOC1jZTE2NjJiNjBjOTQiLCJzaWQiOiIyOTQxMTkxNTQ4MiIsImFpZCI6IjE3MjkxNjczMzc1IiwiY2lkIjoiMTAwNzA3NTc1IiwiY29tcGFueV91dWlkIjoiRjY4MEM2NzQtMTNCMy00Qzk4LThGREYtMUM0N0ExMzIzRTVFIiwidHlwZSI6InIifQ.bT3R5YTiv0ijISAHe4hDg6LHU2MrKJvgOqGU_f3b06-YDTkyPoytyjkNoI20ObY-QHm8bFSnLziT7R5a_KtEhQ";
            
            // Add execution info field
            form.addField('custpage_execution', 'text', 'Execution Info')
                .setDisplayType('inline')
                .setDefaultValue('Request initiated by: ' + nlapiGetUser() + ' on ' + new Date().toString());
            
            // Set up request headers using provided values
            var apiHeaders = {
                'Authorization': authToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            
            // Make API request - using GET to retrieve data
            nlapiLogExecution('DEBUG', 'Making API Call', 'Endpoint: ' + apiEndpoint);
            var apiResponse = nlapiRequestURL(apiEndpoint, null, apiHeaders, 'GET');
            
            // Process the response
            nlapiLogExecution('DEBUG', 'API Response Code', apiResponse.getCode());
            nlapiLogExecution('DEBUG', 'API Response Body', apiResponse.getBody());
            
            if (apiResponse.getCode() !== 200) {
                // Display error information
                form.addField('custpage_error', 'textarea', 'API Request Error')
                    .setDisplayType('inline')
                    .setDefaultValue('Status Code: ' + apiResponse.getCode() + 
                                    '\nResponse: ' + apiResponse.getBody());
            } else {
                // Process and display response data
                var responseData;
                try {
                    responseData = JSON.parse(apiResponse.getBody());
                    
                    // Display the raw payload
                    form.addField('custpage_response', 'longtext', 'API Raw Response')
                        .setDisplayType('inline')
                        .setDefaultValue(JSON.stringify(responseData, null, 2));
                    
                    // Create a more user-friendly display of the cost center data
                    var resultHTML = '<table border="1" cellpadding="5" style="border-collapse: collapse;">';
                    resultHTML += '<tr style="background-color: #f2f2f2;"><th colspan="2">Cost Center Details</th></tr>';
                    
                    // Add fields based on expected response structure for cost centers
                    if (responseData) {
                        // This assumes responseData is an object with cost center properties
                        // Adapt as needed based on actual response structure
                        var fields = [
                            { key: 'external_id', label: 'External ID' },
                            { key: 'name', label: 'Name' },
                            { key: 'abbreviation', label: 'Abbreviation' },
                            { key: 'description', label: 'Description' },
                            { key: 'manning', label: 'Manning' },
                            { key: 'visible', label: 'Visible' },
                            { key: 'time_allocation', label: 'Time Allocation' },
                            { key: 'location_factor', label: 'Location Factor' }
                        ];
                        
                        fields.forEach(function(field) {
                            if (responseData[field.key] !== undefined) {
                                resultHTML += '<tr><td><strong>' + field.label + '</strong></td><td>' + responseData[field.key] + '</td></tr>';
                            }
                        });
                        
                        // Handle custom fields if present
                        if (responseData.custom_fields && responseData.custom_fields.length > 0) {
                            resultHTML += '<tr style="background-color: #f2f2f2;"><th colspan="2">Custom Fields</th></tr>';
                            responseData.custom_fields.forEach(function(cf) {
                                resultHTML += '<tr><td><strong>Custom Field ' + cf.index + '</strong></td><td>' + cf.value + '</td></tr>';
                            });
                        }
                    }
                    
                    resultHTML += '</table>';
                    
                    // Display the formatted results
                    form.addField('custpage_formatted', 'inlinehtml', 'Formatted Data')
                        .setDefaultValue(resultHTML);
                    
                } catch (parseError) {
                    form.addField('custpage_parse_error', 'textarea', 'Response Parse Error')
                        .setDisplayType('inline')
                        .setDefaultValue('Error parsing the response: ' + parseError.toString() + 
                                       '\nRaw response: ' + apiResponse.getBody());
                }
            }
            
            // Add API call details
            form.addField('custpage_details', 'textarea', 'API Call Details')
                .setDisplayType('inline')
                .setDefaultValue('API Endpoint: ' + apiEndpoint + 
                               '\nRequest Method: GET' + 
                               '\nHeaders: ' + JSON.stringify(apiHeaders, null, 2));
            
        } else {
            // Initial load - just show instructions
            form.addField('custpage_instructions', 'textarea', 'Instructions')
                .setDisplayType('inline')
                .setDefaultValue('This Suitelet will retrieve data from the UKG REST API.' + 
                               '\n\nEndpoint: https://secure.saashr.com/ta/rest/v2/companies/|6194045/config/cost-centers/60242681606' +
                               '\n\nClick the "Retrieve UKG Data" button to connect to UKG API and fetch the data.');
                               
            // Add information about the current user and timestamp
            form.addField('custpage_user_info', 'text', 'User Information')
                .setDisplayType('inline')
                .setDefaultValue('Current User: ' + nlapiGetUser() + ' | Current Date/Time (UTC): 2025-04-15 21:43:35');
        }
        
        // Display the form to the user
        response.writePage(form);
    } catch (e) {
        // Handle any errors
        var errorForm = nlapiCreateForm('Error');
        errorForm.addField('custpage_error', 'textarea', 'Error Details')
            .setDisplayType('inline')
            .setDefaultValue('Error: ' + e.toString() + 
                           '\n\nStack Trace: ' + (e.getStackTrace ? e.getStackTrace().join('\n') : 'No stack trace available'));
        
        errorForm.addField('custpage_return', 'inlinehtml', 'Return')
            .setDefaultValue('<p><a href="javascript:history.back()">← Return to previous page</a></p>');
            
        response.writePage(errorForm);
    }
}