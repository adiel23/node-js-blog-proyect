import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import pool from "../config/sqlConfig.js";

export const home = async (req, res) => {
    console.log("Sesión recibida:", req.session);

    let user = req.session.user;

    console.log(user);

    try {
        if (user) {
            user = await User.getById(user.id); // solo obtenemos el usuario sin sus posts ni sus comentarios
            user = user.toJSON();
        }   

        const [results] = await pool.query('select * from posts');

        // creamos instancias de la clase Post para cada post obtenido

        let posts = await Promise.all(results.map(row => Post.create(row, {
            includeUser: true,
            includeComments: true
        })));

        posts = posts.map(post => post.toJSON());

        res.render('index', {user, posts});

    } catch (error) { 
        console.log('hubo un error en la ruta /home/: ', error);
    }
}