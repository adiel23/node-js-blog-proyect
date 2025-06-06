import pool from "../config/sqlConfig.js";
import { User } from "../models/User.js";

export const getUser = async (req, res) => {
    const {id} = req.session.user;

    try {
        const user = await User.getById(id);
        res.json({user});
    } catch (err) {
        console.log(`error en el controlador getUser: ${err}`);
    }
}

export const updateProfile = async (req, res) => {
    const {id} = req.params;

    const updates = req.body;

    const file = req.file;

    if (file) {
        updates.imagePath = `/uploads/${file.filename}`;
    }

    let query = 'UPDATE users set ';
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
        query += `${key} = ?, `;

        values.push(value);
    }

    query = query.slice(0, -2); 

    query += ' where id = ?';

    try {
        const [results] = await pool.query(query, [...values, id]);

        console.log('resultado de hacer el update al perfil del usuario: ', results);

        res.status(200).send('exito');

    } catch (err) {
        console.log('error en la funcion update profile' + err);
    }
}

export const hasReportedPost = async (req, res) => {
    const {postId} = req.query;

    const userId = req.session.user.id;

    const user = await User.getById(userId);

    try {
        const hasReportedPost = await user.hasReportedPost(postId);

        res.json({hasReportedPost});
    } catch (err) {
        console.log('error en el controlador de usuario hasReportedPost: ' + err);
    }
}