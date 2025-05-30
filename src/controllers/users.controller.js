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

export const register = (req, res) => {
    const {name, email, password} = req.body;

    const file = req.file;

    let imagePath;

    if (file) {
        imagePath = `/uploads/${req.file.filename}`;
    } else {
        imagePath = '/imgs/default-profile.png';
    }

    (async () => {
        try {
            const userToInsert = await User.create({
                name,
                email, 
                password,
                imagePath
            });

            const insertedUser = await userToInsert.insert();

            req.session.user = {
                id: insertedUser.id,
                name: insertedUser.name,
                email: insertedUser.email
            };

            res.redirect('/');
        } catch (err) {
            console.log('error en el controlador register: ' + err);
        };

    })()
}

export const login = (req, res) => {
    const {email, password} = req.body;
    
    (async () => {
        try {
            const user = await User.findByCredentials(email, password);

            if (user) {
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };
                res.status(200).send('exito');
            } else {
                res.status(401).json({
                    message: 'Usuario no encontrado'
                });
            };

        } catch (err) {
            console.log('error en el controlador login: '+ err);
        }
    })();
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
        const connection = await connectToDatabase();

        const [results] = await connection.query(query, [...values, id]);

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