import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import session from 'express-session';
import pool from './config/sqlConfig.js';


import userRoutes from './routes/user.routes.js';
import authorRoutes from './routes/author.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';
import authRoutes from './routes/auth.routes.js';

import { fileURLToPath } from 'url';
import { User } from './models/User.js';
import { Post } from './models/Post.js';

const app = express();

const __filename = fileURLToPath(import.meta.url); // import meta url nos devuelve el archivo actual en url y con filetoURL lo convierte a un archivo del sistema

const __dirname = path.dirname(__filename); // con dirname nos retorno solo la ubicacion del directorio siempre como archivo del sistema.

app.set('views', path.join(__dirname, '../views')); // habilitando la carpeta de las vistas
app.set('view engine', 'ejs'); // habilitando el motor de plantillas.

app.use(methodOverride('_method'));

app.use(express.urlencoded({extended: true}));

app.use(express.json()); // nos permite recibir solicitudes que envian json. Sin esto el req.body devolveria undefined

app.use(express.static(path.join(__dirname, '../public'))); // servir archivos estaticos en la carpeta public (archivos accesibles desde el navegador)

app.use(session({
    secret: 'mico04',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

// routes

app.get('/', async (req, res) => {
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
});

app.use('/auth', authRoutes);

app.use('/posts', postRoutes);

app.use('/users', userRoutes);

app.use('/comments', commentRoutes);

app.use('/authors', authorRoutes);

app.listen(3000, () => {
    console.log('server running on port 3000');
});


