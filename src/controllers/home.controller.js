import { User } from "../models/User.js";
import { Post } from "../models/Post.js";

export const home = async (req, res) => {
    console.log("Sesión recibida:", req.session);

    let user = req.session.user;

    console.log(user);

    try {
        if (user) {
            user = await User.getById(user.id); // solo obtenemos el usuario sin sus posts ni sus comentarios
        }   

        const [results] = await pool.query('select * from posts');

        // creamos instancias de la clase Post para cada post obtenido

        const posts = await Promise.all(results.map(row => Post.create(row, {
            includeUser: true,
            includeComments: true
        })));

        res.render('index', {user, posts});

    } catch (error) { 
        console.log('hubo un error en la operacion sql en la ruta /: ' + error);
    }
}