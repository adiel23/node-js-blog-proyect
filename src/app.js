import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import session from 'express-session';
import { getUserWithoutPosts, Post } from './modules/clases.js';
import {connectToDatabase} from './config/sqlConfig.js';
import postRoutes from './routes/post.routes.js';
import userRoutes from './routes/user.routes.js';
import authorRoutes from './routes/author.routes.js';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, '../views')); // habilitando la carpeta de las vistas
app.set('view engine', 'ejs'); // habilitando el motor de plantillas.

app.use(methodOverride('_method'));

app.use(express.urlencoded({extended: true}));

app.use(express.json()); // usar middleware para parsear el cuerpo de la solicitud

app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
    secret: 'mico04',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

// routes

app.get('/', async (req, res) => {
    let user = req.session.user;

        try {
            if (user) {
                user = await getUserWithoutPosts(user.id);
            }

            const pool = await connectToDatabase();
            const request = pool.request();
            request.stream = true;
            request.query('select * from posts');
    
            let posts = [];
    
            let rowsToProcess = [];
    
            request.on('row', row => {
                rowsToProcess.push(row);
    
                if (rowsToProcess.length >= 15) {
                    request.pause();
                    processRows().then(() => request.resume());
                }
            });
    
            request.on('done', async () => {
                if (rowsToProcess.length > 0) {
                    await processRows(); // terminamos de procesar las filas que no hayan sido procesadas.
                }
    
                console.log(posts);
    
                res.render('index', {user, posts});
            });
    
            async function processRows() {
                for (const row of rowsToProcess) {
                    const post = await Post.create(
                        row.id,
                        row.userId,
                        row.title,
                        row.content,
                        row.imagePath,
                        row.date,
                        row.claps,
                        true,
                        false
                    );
    
                    posts.push(post);
                }
    
                rowsToProcess = [];
            };
    
        } catch (error) {
            console.log('hubo un error en la operacion sql: ' + error);
        }
});

app.use('/post', postRoutes);

app.use('/user', userRoutes);

app.use('/author', authorRoutes);

app.listen(3000, () => {
    console.log('server running on port 3000');
});

function isAuthenticated(req, res, next) {
    if (!req.session.userData) {
        return res.redirect('/login');
    }
    next();
}

function requireRole(role) {
    return (req, res, next) => {
        if (!req.session.userData) {
            return res.redirect('/login');
        }

        if (req.session.userData.role !== role) {
            return res.status(404).send('acceso denegado. No tienes el rol necesario')
        };

        next();
    }
}

