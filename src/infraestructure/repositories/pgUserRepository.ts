import pool from "../db/pool.ts";
import { UserRepository } from "../../domain/repositories/UserRepository.ts";

export class pgUserRepository implements UserRepository {

    async create(user){
        const result = await pool.execute("INSERT INTO users (id, name, email, created_at) VALUES ($1, $2, $3, $4)", [user.id, user.name, user.email, user.createdAt]);

        return result.rows[0];
    }

    async findById(id){
        const result = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
        return result.rows[0];
    }

    async update(id, data){
        const result = await pool.execute("UPDATE users SET name = ?, email = ? WHERE id = ?",[data.name, data.email, id]);
        return result.rows[0];
    }

    async delete(id){
        const result = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
        return result.rowCount > 0;
    }

}