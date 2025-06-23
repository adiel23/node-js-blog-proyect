import { User } from '../models/User.js';

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
                email: insertedUser.email,
                role: insertedUser.role
            };

            res.redirect('/');
        } catch (err) {
            console.log('error en el controlador register: ' + err);
        };

    })();
}

export const login = (req, res) => {
    const {email, password} = req.body;
    
    (async () => {
        try {
            const user = await User.findByCredentials(email, password);

            console.log('user: ', user);

            if (user) {
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
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

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('connect.sid'); // Limpia la cookie de sesión
    res.send('Sesión cerrada');
  });
};