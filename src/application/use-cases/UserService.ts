import { User } from '../../domain/entities/user.ts';
import { UserRepository } from '../../domain/repositories/UserRepository.ts';

export class UserService {
    constructor(private userRepository: UserRepository){}

    async execute(data: User){
        return this.userRepository.create(data);
    }

    async getUserFind(id: String){
        if(!id) return {success: false, errors: ["Se debe ingresar un Id de usuario valido"]};
        return this.userRepository.findById(id);
    }

    async updateUser(id: String, data:User){
        if(!id) return {success: false, errors: ["Se debe ingresar un Id de usuario valido"]};

        return this.userRepository.update(id, data);
    }

    async deleteUser(id: String){
        if(!id) return {success: false, errors: ["Se debe ingresar un Id de usuario valido"]};
        return this.userRepository.delete(id);
    }
}