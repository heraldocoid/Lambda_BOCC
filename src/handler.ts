import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { json } from './share/httpResponse';
import { UserService } from './application/use-cases/UserService';
import { PgUserRepository } from './infraestructure/repositories/PgUserRepository';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  let method = event.httpMethod;

  try {

    const userService = new UserService(new PgUserRepository());
    switch (method) {
      case 'GET': {
        const results = await userService.getAllUsers();
        return json(200, results);
      }
      case 'POST': {
        const body = JSON.parse(event.body || '{}');
        const result = await userService.createUser(body);
        return json(201, result);
      }
      case 'PUT': {
        const bodyPut = JSON.parse(event.body || '{}');
        const resultPut = await userService.updateUser(bodyPut.id, bodyPut);
        return json(200, resultPut);
      }
      case 'DELETE': {
        const bodyDelete = JSON.parse(event.body || '{}');
        const resultDelete = await userService.deleteUser(bodyDelete.id);
        return json(200, resultDelete);
      }

      default:
        // Método no soportado
        return json(405, { error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Error no controlado: ", error);
    return json(500, { error: "Internal server error" });
  }
};
