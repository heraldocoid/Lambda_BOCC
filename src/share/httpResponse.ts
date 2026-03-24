/**
 * @Author: Kevin S. Rodriguez Castillo
 * this class is responsible for the response HTTP generic of the JSON functions
 */

export function json(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  };
}
