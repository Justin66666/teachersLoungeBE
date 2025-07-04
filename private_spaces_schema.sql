-- Private Spaces Tables Schema

-- Main private spaces table
CREATE TABLE IF NOT EXISTS private_spaces (
    space_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(500),
    creator_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Members of private spaces
CREATE TABLE IF NOT EXISTS private_space_members (
    space_id INTEGER NOT NULL REFERENCES private_spaces(space_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (space_id, email)
);

-- Invitations to private spaces
CREATE TABLE IF NOT EXISTS private_space_invitations (
    invitation_id SERIAL PRIMARY KEY,
    space_id INTEGER NOT NULL REFERENCES private_spaces(space_id) ON DELETE CASCADE,
    inviter_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    invitee_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    UNIQUE(space_id, invitee_email)
);

-- Posts within private spaces
CREATE TABLE IF NOT EXISTS private_space_posts (
    post_id SERIAL PRIMARY KEY,
    space_id INTEGER NOT NULL REFERENCES private_spaces(space_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    content TEXT NOT NULL,
    file_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Comments on private space posts
CREATE TABLE IF NOT EXISTS private_space_post_comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES private_space_posts(post_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_private_space_members_email ON private_space_members(email);
CREATE INDEX idx_private_space_posts_space_id ON private_space_posts(space_id);
CREATE INDEX idx_private_space_posts_created_at ON private_space_posts(created_at DESC);
CREATE INDEX idx_private_space_invitations_invitee ON private_space_invitations(invitee_email, status); 