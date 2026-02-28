CREATE TABLE clients
(
    id SERIAL PRIMARY KEY,

    email         VARCHAR(254) NOT NULL,
    login         VARCHAR(32)  NOT NULL,
    password_hash CHAR(60)     NOT NULL,

    UNIQUE (email),
    UNIQUE (login)
);

CREATE TABLE auth_tokens
(
    id SERIAL PRIMARY KEY,

    client_id  INT       NOT NULL REFERENCES clients ON DELETE CASCADE,
    token      UUID      NOT NULL,
    ip         TEXT      NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL,

    UNIQUE (token)
);

CREATE TABLE track_images
(
    id SERIAL PRIMARY KEY,

    path         TEXT NOT NULL,
    hash         TEXT NOT NULL,
    tracks_count INT  NOT NULL
);

CREATE TABLE track
(
    id SERIAL PRIMARY KEY,

    uploader_id INT REFERENCES clients      ON DELETE SET NULL,
    image_id    INT REFERENCES track_images ON DELETE SET NULL,

    path     TEXT           NOT NULL,
    duration DECIMAL(10, 3) NOT NULL,

    title    TEXT NOT NULL,
    album    TEXT,
    codec    TEXT,
    bitrate  INT,
    lossless BOOL NOT NULL
);