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
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (token)
);

CREATE TABLE track_covers
(
    id SERIAL PRIMARY KEY,

    path         TEXT   NOT NULL,
    p_hash       BIGINT NOT NULL,
    tracks_count INT    NOT NULL DEFAULT 0
);

CREATE TABLE tracks
(
    id SERIAL PRIMARY KEY,

    uploader_id INT REFERENCES clients      ON DELETE SET NULL,
    cover_id    INT REFERENCES track_covers ON DELETE SET NULL,

    path     TEXT           NOT NULL,
    duration DECIMAL(10, 3) NOT NULL,

    title    TEXT NOT NULL,
    album    TEXT,
    codec    TEXT,
    bitrate  INT
);

CREATE OR REPLACE FUNCTION manage_tracks_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = "DELETE" THEN
        IF OLD.cover_id IS NOT NULL THEN
            UPDATE track_covers 
            SET tracks_count = tracks_count - 1 
            WHERE id = OLD.cover_id;
        END IF;
        RETURN OLD;

    ELSIF TG_OP = "INSERT" THEN
        IF NEW.cover_id IS NOT NULL THEN
            UPDATE track_covers 
            SET tracks_count = tracks_count + 1 
            WHERE id = NEW.cover_id;
        END IF;
        RETURN NEW;

    ELSIF TG_OP = "UPDATE" THEN
        IF OLD.cover_id IS DISTINCT FROM NEW.cover_id THEN
            
            IF OLD.cover_id IS NOT NULL THEN
                UPDATE track_covers 
                SET tracks_count = tracks_count - 1 
                WHERE id = OLD.cover_id;
            END IF;
            
            IF NEW.cover_id IS NOT NULL THEN
                UPDATE track_covers 
                SET tracks_count = tracks_count + 1 
                WHERE id = NEW.cover_id;
            END IF;
            
        END IF;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_manage_tracks_count
BEFORE INSERT OR UPDATE OR DELETE ON tracks
FOR EACH ROW
EXECUTE PROCEDURE manage_tracks_count();

