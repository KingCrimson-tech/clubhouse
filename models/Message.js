const pool = require('../config/db');

class Message {
    //new msg
    static async create(messageData){
        const { title, content, user_id } = messageData
        const query = 'insert into messages (title, content, user_id) values ($1, $2, $3) returning *'

        const values = [title, content, user_id]

        try {
            const { rows } = await pool.query(query, values)
            return rows[0]
        } catch (err){
            throw err
        }
    }

    //get all msgs
    static async getAll(){
        const query = 'select messages.id, messages.title, messages.content, messages.created_at, messages.user_id, users.first_name, users.last_name, users.email from messages join users on messages.user_id = users.id order by messages.created_at desc'

        try {
            const { rows } = await pool.query(query)
            return rows
        } catch (err){
            throw err
        }
    }

    //get single msg by ID
    static async findById(id){
        const query = 'select m.id, m.title, m.content, m.created_at, m.user_id, u.first_name, u.last_name, u.email from messages m join users u on m.user_id = u.id where m.id = $1'

        try {
            const { rows } = await pool.query(query, [id])
            return rows[0] || null
        } catch(err){
            throw err
        }
    }

    //get msgs from a user
    static async getByUserId(userId){
        const query = 'select id, m.id, m.title, m.content, m.created_at,m.user_id,  u.first_name, u.last_name from messages m join users u on m.user_id = u.id where m.user_id = $1 order by m.created_by desc'

        try {
            const { rows } = await pool.query(query, [userId])
            return rows
        } catch (err){
            throw err
        }
    }

    //delete msg (admin only)
    static async delete(id) {
        const query = 'delete from messages where id = $1 returning *'

        try {
            const { rows } = await pool.query(query, [id])
            return rows[0] || null
        } catch (err){
            throw err
        }
    }

    //update msg(todo)

    static async update(id, messageData) {
    const { title, content } = messageData;
    
    const query = `
      UPDATE messages 
      SET title = $1, content = $2
      WHERE id = $3
      RETURNING *
    `;
    
    const values = [title, content, id];
    
    try {
      const { rows } = await pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

    //get msg count(todo)

    static async countByUserId(userId) {
    const query = 'SELECT COUNT(*) FROM messages WHERE user_id = $1';
    
    try {
      const { rows } = await pool.query(query, [userId]);
      return parseInt(rows[0].count);
    } catch (error) {
      throw error;
    }
  }

    //total msg count(todo)

    static async count() {
    const query = 'SELECT COUNT(*) FROM messages';
    
    try {
      const { rows } = await pool.query(query);
      return parseInt(rows[0].count);
    } catch (error) {
      throw error;
    }
  }

}

module.exports = Message