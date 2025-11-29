const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    //new user
    static async create(userData){
        const { first_name, last_name, email, password } = userData

        const hashedPassword = await bcrypt.hash(password, 10)

        const query = 'insert into users (first_name, last_name, email, password) values ($1, $2, $3, $4) returning id, first_name, last_name, email, is_member, is_admin'

        const values = [first_name, last_name, email, hashedPassword]

        try{
            const { rows } = await pool.query(query, values)
            return rows[0]
        }catch(err){
            throw err
        }
    }

    //find user by email
    static async findByEmail(email){
        const query = 'select * from users where email = $1'

        try {
            const { rows } = await pool.query(query, [email])
            return rows[0]
        } catch (err){
            throw err
        }
    }

    //find user by id
    static async findById(id){
        const query = 'select * from users where id = $1'

        try {
            const { rows } = await pool.query(query, [id])
            return rows[0] || null
        } catch (err) {
            throw err
        }
    }

    //update user to member
    static async makeMember(userId){
        const query = 'update users set is_member = true where id = $1 returning id, first_name, last_name, email, is_member, is_admin'

        try{
            const { rows } = await pool.query(query, [userId])
            return rows[0]
        } catch (err){
            throw err
        }
    }

    //update to admin
    static async makeAdmin(userId){
        const query = 'update users set is_admin = true, is_member = true where id = $1 returning id, first_name, last_name, email, is_member, is_admin'

        try{
            const { rows } = await pool.query(query, [userId])
            return rows[0]
        } catch (err){
            throw err
        }
    }

    //verify password
    static async verifyPassword(plainPassword, hashedPassword){
        return await bcrypt.compare(plainPassword, hashedPassword)
    }

    //admin purposes this is 
    static async getAll(){
        const query = 'select id, first_name, last_name, email, is_member, is_admin from users order by id desc'

        try {
            const { rows } = await pool.query(query)
            return rows
        } catch (err){
            throw err
        }
    }

    //mail existence check
    static async emailExists(email){
        const query = 'select id from users where email = $1'

        try {
            const { rows } = await pool.query(query, [email])
            return rows.length > 0
        } catch(err){
            throw err
        }
    }
}

module.exports = User;