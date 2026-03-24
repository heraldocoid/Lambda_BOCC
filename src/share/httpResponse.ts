/**
 * 
 * Clase de utilería para respuestas HTTP
 * 
 * @description: Core utility for generic HTTP JSON responses
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
 */

export function json(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  };
}
