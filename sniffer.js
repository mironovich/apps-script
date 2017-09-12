// results here https://docs.google.com/spreadsheets/d/1ZjqsUNV_uY64eau-UjflLw2JoM-Bcv3uvTR_zqrJpwU/edit?usp=sharing

var dataLayer = dataLayer || [];
$(document).ajaxSuccess(function (event, jqXHR, ajaxOptions, data) {
    dataLayer.push({
        event: event.type,
        request: {
            method: ajaxOptions.type,
            url: ajaxOptions.url,
            data: ajaxOptions.data,
            contentType: ajaxOptions.contentType
        },
        response: {
            url: jqXHR.responseURL,
            status: jqXHR.status,
            statusText: jqXHR.statusText,
            data: jqXHR.response
        }
    });

    var l = 'https://script.google.com/macros/s/AKfycbxwLu2i2Vb5IllKrwrW6FpSsdCR3RXaJ3M1m4a4m9WWT46M7lc/exec?' +
        'event=' + event.type +
        '&reqmethod=' + ajaxOptions.type +
        '&requrl=' + ajaxOptions.url +
        '&respstatus=' + jqXHR.status;
    img = new Image();
    img.src = l
});