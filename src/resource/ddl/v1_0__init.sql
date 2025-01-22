create table if not exists query_result_cache
(
    id         int auto_increment primary key,
    identifier varchar(255) null,
    time       bigint       not null,
    duration   int          not null,
    query      text         not null,
    result     text         not null
);

create table if not exists user
(
    create_date   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    delete_date   datetime(6)                              null,
    id            int auto_increment primary key,
    update_date   datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    version       int                                      not null,
    avatar        text                                     null,
    custom_config json                                     not null,
    password      varchar(255)                             not null,
    username      varchar(255)                             not null,
    constraint IDX_78a916df40e02a9deb1c4b75ed unique (username)
);

create table if not exists collection
(
    create_date   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    delete_date   datetime(6)                              null,
    id            int auto_increment primary key,
    update_date   datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    version       int                                      not null,
    custom_config json                                     not null,
    name          varchar(255)                             not null,
    `order`       int         default 0                    not null,
    parent_id     int                                      null,
    user_id       int                                      null,
    constraint FK_4f925485b013b52e32f43d430f6 foreign key (user_id) references user (id) on delete cascade,
    constraint FK_98b5bd279fd6a757460e56df679 foreign key (parent_id) references collection (id) on delete cascade
);

create fulltext index IDX_926e7bdc3f52cd582078a379f1 on collection (name)
    with
        parser ngram;

create table if not exists excerpt
(
    create_date   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    delete_date   datetime(6)                              null,
    id            int auto_increment primary key,
    update_date   datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    version       int                                      not null,
    custom_config json                                     not null,
    description   text                                     null,
    icon          text                                     null,
    `order`       int         default 0                    not null,
    collection_id int                                      null,
    user_id       int                                      null,
    constraint FK_7bc2557baf1af9a24978c79c552 foreign key (user_id) references user (id) on delete cascade,
    constraint FK_894c4acac070863783d48b46201 foreign key (collection_id) references collection (id) on delete cascade
);

create fulltext index IDX_c949cdba56b2ded0ff00882d3d on excerpt (description)
    with
        parser ngram;

create table if not exists excerpt_link
(
    create_date datetime(6) default CURRENT_TIMESTAMP(6) not null,
    delete_date datetime(6)                              null,
    id          int auto_increment primary key,
    update_date datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    version     int                                      not null,
    link        text                                     null,
    excerpt_id  int                                      null,
    constraint FK_108075acb69d8351575a0fea05c foreign key (excerpt_id) references excerpt (id) on delete cascade
);

create fulltext index IDX_8c73b2f78f90416e5bbc0878ba on excerpt_link (link)
    with
        parser ngram;

create table if not exists excerpt_name
(
    create_date datetime(6) default CURRENT_TIMESTAMP(6) not null,
    delete_date datetime(6)                              null,
    id          int auto_increment primary key,
    update_date datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    version     int                                      not null,
    name        varchar(255)                             not null,
    excerpt_id  int                                      null,
    constraint FK_6c9d212d39f76c76c1c815fcea9 foreign key (excerpt_id) references excerpt (id) on delete cascade
);

create fulltext index IDX_6e116fc06c2022b662234895a1 on excerpt_name (name)
    with
        parser ngram;

create table if not exists history
(
    create_date   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    delete_date   datetime(6)                              null,
    id            int auto_increment primary key,
    update_date   datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    version       int                                      not null,
    custom_config json                                     not null,
    description   text                                     null,
    icon          text                                     null,
    links         json                                     not null,
    names         json                                     not null,
    `order`       int         default 0                    not null,
    excerpt_id    int                                      null,
    constraint FK_9dedd12f016de91942098b6504c foreign key (excerpt_id) references excerpt (id) on delete cascade
);

create fulltext index IDX_4d86d1a9f4d58c624a108b534b on history (description)
    with
        parser ngram;
