/**
 * 
 * Class for create the methods of the interface for implements
 * 
 * @description: Class for implements in pgUserRepository
 * @author: Leonardo S Ruiz Rodriguez
 * 
 */

export interface userRepository {
    create(user: any): Promise<any>;
    findById(id: String): Promise<any>;
    update(id: String, user: any): Promise<any>;
    delete(id: String): Promise<void>;
}