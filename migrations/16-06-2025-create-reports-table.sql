use blog_db;

create table reports (
	id int primary key auto_increment,
    userId int not null,
    postId int not null,
    reason varchar(20) not null,
    date date not null,
    foreign key (userId) references users(id),
    foreign key (postId) references posts(id)
);
