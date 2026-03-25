import { pool } from '../../infraestructure/db/pool.ts';
import { json } from './share/httpResponse.js';
import { createUser } from "../../application/use-cases/UserService.ts";
import { pgUserRepository } from "../../infraestructure/repositories/pgUserRepository";


const repo = new pgUserRepository(pool);
const service = new UserService(repo);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const method = event.httpMethod;
        const id = event.pathParameters.id;
        const body = JSON.parse(event.body);

        switch (method) {
            case "POST":
                const result = await service.execute(body);
                return json(200, result);
            case "GET":
                const result = await service.getUserFind(id);
                return json(200, result);
            case "PUT":
                const result = await service.updateUser(id,body);
                return json(200, result);
            case "DELETE":
                const result = await service.deleteUser(id);
                return json(200, result);
        }
    } catch (err) {
        return json(400, {error: err.message});
    }
}