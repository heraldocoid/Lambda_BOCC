/**
 * @Author: Kevin S. Rodriguez Castillo
* this class is responsible for the response HTTP generic of the JSON functions
*/

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  };
}
 
module.exports = { json };