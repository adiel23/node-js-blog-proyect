import {connectToDatabase } from "../config/sqlConfig.js";

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
            let connection = await connectToDatabase();

            const [results] = await connection.query('insert into users (name, email, password, imagePath) values (?, ?, ?, ?)',
                [name, email, password, imagePath]
            );

            const userId = results.insertId;

            const [rows] = await connection.query('select * from users where id = ?', [userId]);

            req.session.user = rows[0];

            res.redirect('/');
        } catch (err) {
            console.log('error al realizar la conexion: ' + err);
        };

    })()
}

export const login = (req, res) => {
    const {email, password} = req.body;
    
        (async () => {
            try {
                const connection = await connectToDatabase();
                
                const [results] = await connection.query('select * from users where email = ? and password = ?', [email, password]);
    
                const user = results[0];

                if (user) {
                    req.session.user = user;
                    res.status(200).send('exito');
                } else {
                    res.status(401).json({
                        message: 'Usuario no encontrado'
                    });
                };
    
            } catch (err) {
                console.log('error en el login: '+ err);
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
    const params = [];
    let i = 1;

    for (const [key, value] of Object.entries(updates)) {
        query += `${key} = @params${i}, `;
        params.push({
            name: `params${i}`,
            value
        });
        i++;
    }

    query = query.slice(0, -2);

    query += ' where id = @userId';

    try {
        const pool = await connectToDatabase();

        const request = pool.request();

        params.forEach(param => {
            request.input(param.name, param.value);
        });

        request.input('userId', sql.Int, id);

        const result = await request.query(query);

        console.log('resultado de hacer el update al perfil del usuario: ', result);

        res.status(200).send('exito');

    } catch (err) {
        console.log('error en la funcion update profile' + err);
    }
}