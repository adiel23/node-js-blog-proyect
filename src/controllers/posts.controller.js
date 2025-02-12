import {sql, connectToDatabase} from '../config/sqlConfig.js';

import {getCompletePost, User, getUserWithPosts, Post, getUser} from '../modules/clases.js';

export const getMatchingPosts = async (req, res) => {
    const user = new User(req.session.user);
    const query = req.query.q;

    try {
        const pool = await connectToDatabase();

        const result = await pool.request()
            .input('query', sql.VarChar(255), `%${query}%`)
            .query(`select * from posts where title LIKE @query`);

        const posts = await Promise.all(result.recordset.map(row => {
            return Post.create(row.id, row.userId, row.title, row.content, row.imagePath, row.date, row.claps);
        }) || []);

        console.log(posts);

        res.render('search-results', {user, posts, query});

    } catch (err) {
        console.log('error en el controlador getMatchingPosts');
    }

}

export const createPost = (req, res) => {
    const userId = req.session.user.id;

    console.log(userId);

    const {title, content} = req.body;

    console.log('contenido del post: ' + content);
    console.log('longitud del contenido ' + content.length);
    
    const file = req.file;

    const imagePath = `/uploads/${file.filename}`;

    (async () => {
        try {
            const pool = await connectToDatabase();

            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .input('title', sql.VarChar(255), title)
                .input('content', sql.NVarChar, content)
                .input('imagePath', sql.VarChar(255), imagePath)
                .query('insert into posts (userId, title, content, imagePath) output inserted.id VALUES (@userId, @title, @content, @imagePath)');

            const postId = result.recordset[0].id;

            res.redirect(`/post/${postId}`);

        } catch (error) {
            console.log('error al hacer la conexion: ', error);
        }
    })()

    sql.on('error', err => {
        console.log('error en el sql: ', err);
    });
}

export const getPost = async (req, res) => {

    let user = req.session.user;

    const postId = req.params.id;
    
    // vamos a obtener el post con el id correspondiente y su comentarios correspondientes.
    try {
        const post = await getCompletePost(postId);

        if (post) {

            if (user) {
                user = new User(user);

                await user.hasClappedPost(post.id) ? post.hasClapped = true: null;
    
                for (const comment of post.comments) {
                    comment.hasLiked = await user.hasLikedComment(comment.id);
                }
            } 
            
            res.render(`post`, {user, post});
        } else {
            res.status(404).send('post not found');
        }
       
    } catch (error) {
        console.log('hubo un error al obtener el post con comentarios ' + error);
    }
}

export const removePost = async (req, res) => {
    const postId = req.params.id;

    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('postId', sql.Int, postId)
            .query('delete from posts where id = @postId')

        console.log(result);

        const user = await getUserWithPosts(req.session.user.id);

        console.log(user);

        res.render('my-posts', {posts: user.posts});

    } catch (err) {
        console.log('error en el controlador removePost ' + err)
    }
}

export const updatePost = async (req, res) => {

    const postId = req.params.id;

    const {title, content} = req.body;

    const file = req.file;

    try {

        if (file == undefined) {
            const pool = await connectToDatabase();

            const result = await pool.request()
                .input('postId', sql.Int, postId)
                .input('title', sql.VarChar(255), title)
                .input('content', sql.NVarChar(), content)
                .query('update posts set title = @title, content = @content output inserted.* where id = @postId');

            console.log('resultado de hacer el update al post: ', result);
        
        } else {
            const imagePath = `/uploads/${file.filename}`;

            const pool = await connectToDatabase();

            const result = await pool.request()
                .input('postId', sql.Int, postId)
                .input('title', sql.VarChar(255), title)
                .input('content', sql.NVarChar(), content)
                .input('imagePath', sql.VarChar(255), imagePath)
                .query('update posts set title = @title, content = @content, imagePath = @imagePath output inserted.*  where id = @postId');

            console.log('resultado de hacer el update al post: ', result);

        }

        res.redirect(`/post/${postId}`);

    } catch (err) {
        console.log('error en el try del controlador update post ' + err);
    }
}

export const updateClaps = (req, res) => {
    const {postId, userId} = req.body;

    (async () => {
        try {
            const pool = await connectToDatabase();

            const insertResult = await pool.request()
                .input('postId', sql.Int, postId)
                .input('userId', sql.Int, userId)
                .query('insert into post_claps (postId, userId) values (@postId, @userId)')

            console.log(insertResult);

            const updateResult = await pool.request()
                .input('postId', sql.Int, postId)
                .query('update posts set claps = claps + 1 output inserted.claps where id = @postId');

            console.log(updateResult);

            const claps = updateResult.recordset[0].claps;

            res.status(200).send({claps});

        } catch (err) {
            console.log('hubo un error al hacer las consultas de los post_claps: ' + err);
        }
    })();
}

// vamos con los comentarios:

export const addComment = async (req, res) => {
    
    const user = new User(req.session.user);
    const postId = req.params.id;
    const content = req.body.content;

    console.log(user);

    try {
        const pool = await connectToDatabase();

        const result = await pool.request()
            .input('postId', sql.Int, postId)
            .input('userId', sql.Int, user.id)
            .input('content', sql.NVarChar(), content)
            .query('insert into comments (postId, userId, content) VALUES (@postId, @userId, @content)');

        const post = await getCompletePost(postId);

        for (const comment of post.comments) {
            comment.hasLiked = await user.hasLikedComment(comment.id);
        }

        res.render('_comments', {post, user});
    } catch (err) {
        console.log('error en la funcion add Comment ' + err);
    }
};

export const deleteComment = async (req, res) => {
    const user = new User(req.session.user);

    const postId = parseInt(req.params.id);

    const commentId = parseInt(req.params.commentId);

    try {
        const pool = await connectToDatabase();
        
        const result = await pool.request()
            .input('commentId', sql.Int, commentId)
            .query(`
                delete from comment_likes where commentId = @commentId;

                delete from comments where id = @commentId;
            `);

        const post = await getCompletePost(postId);

        res.render('_comments', {post, user});

    } catch (err) {
        console.log('error en la funcion delete comment: ' + err);
    }
}

export const updateComment = async (req, res) => {
    const user = new User(req.session.user);
    const postId = parseInt(req.params.id);
    const commentId = parseInt(req.params.commentId);
    const newContent = req.body.content;

    console.log('contenido nuevo ' + newContent);

    try {

        const pool = await connectToDatabase();

        await pool.request()
            .input('commentId', sql.Int, commentId)
            .input('newContent', sql.NVarChar(), newContent)
            .query('update comments set content = @newContent where id = @commentId');

        const post = await getCompletePost(postId);

        for (const comment of post.comments) {
            comment.hasLiked = await user.hasLikedComment(comment.id);
        }

        res.render('_comments', {post, user})

    } catch (err) {
        console.log('hubo un error en el controlador update comment: ' + err);
    }
}

export const updateLikes = async (req, res) => {
    const {commentId, userId} = req.body;

    try {

        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('commentId', sql.Int, commentId)
            .input('userId', sql.Int, userId)
            .query('select * from comment_likes where commentId = @commentId and userId = @userId');

        console.log(result);

        // lo segundo que haremos sera hacer el update.

        if (result.recordset.length > 0) { // en caso de que ya se le haya dado like
            const likeId = result.recordset[0].id;

            const deleteResult = await pool.request()
                .input('likeId', sql.Int, likeId)
                .query('delete from comment_likes where id = @likeId');

            console.log(deleteResult);

            const updateResult = await pool.request()
                .input('commentId', sql.Int, commentId)
                .query('update comments set likes = likes - 1 output inserted.likes where id = @commentId');

            const likes = updateResult.recordset[0].likes;

            res.status(200).send({likes, liked: false});
                
        } else { // en caso de que no se le haya dado like
            const insertResult = await pool.request()
                .input('commentId', sql.Int, commentId)
                .input('userId', sql.Int, userId)
                .query('insert into comment_likes (commentId, userId) values (@commentId, @userId)');

            console.log(insertResult);

            const updateResult = await pool.request()
                .input('commentId', sql.Int, commentId)
                .query('update comments set likes = likes + 1 output inserted.likes where id = @commentId');

            const likes = updateResult.recordset[0].likes;

            res.status(200).send({likes, liked: true});
        }
        
    } catch (err) {
        console.log('error en la consulta para actualizar los likes ' + err);
        res.status(500).send({succes: false, error: 'error al actualizar los likes'});
    };
};


