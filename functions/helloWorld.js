exports.handler = async function(event, context, callback) {
    var response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World!',
         //   input: event,
        }),
    };

    callback(null, response);
}
