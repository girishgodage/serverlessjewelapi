exports.handler = async function (event, context, callback) {
  const currentTime = new Date().toLocaleTimeString();
  var response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `The current time is ${currentTime}`,
    }),
  };

  callback(null, response);
};
