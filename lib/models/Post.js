const pool = require('../utils/pool');

module.exports = class Post {
  id;
  userId;
  post;

  constructor(row){
    this.id = row.id;
    this.userId = row.user_id;
    this.post = row.post;
  }

  static async insert ({ post, userId }){
    const { rows } = await pool.query(
      'INSERT INTO posts (post, user_id) VALUES ($1,$2) RETURNING *',
      [post, userId]
    );
    return new Post(rows[0]);
  }

  static async getAllPosts() {
    const { rows } = await pool.query('SELECT * FROM posts');
    return rows.map((row) => new Post(row));
  }

};

