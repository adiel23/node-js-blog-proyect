export function checkRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.session.user) return redirect('/');

        if (allowedRoles.includes(req.session.user.role)) return next();

        return res.status(403).send('acces denied');
    }
}