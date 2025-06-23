export function checkRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.session.user) return redirect('/home/');

        if (!allowedRoles.includes(req.session.user.role)) return res.status(403).send('acces denied');

        next();
    }
}