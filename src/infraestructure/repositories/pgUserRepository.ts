import pool from "../db/pool";
import { UserRepository } from "../../domain/repositories/UserRepository.ts";

export class pgUserRepository implements UserRepository {
    constructor(private db: pool){}

    async create(user){
        const result = await this.db.execute("INSERT INTO users (id, name, email, created_at) VALUES ($1, $2, $3, $4)", [user.id, user.name, user.email, user.createdAt]);

        return result.rows[0];
    }

    async findById(id){
        const result = await this.db.execute("SELECT * FROM users WHERE id = ?", [id]);
        return result.rows[0];
    }

    async update(id, data){
        const result = await this.db.execute("UPDATE users SET name = ?, email = ? WHERE id = ?",[data.name, data.email, id]);
        return result.rows[0];
    }

    async delete(id){
        const result = await this.db.execute("DELETE FROM users WHERE id = ?", [id]);
        return result.rowCount > 0;
    }

}