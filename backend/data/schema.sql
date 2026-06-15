-- ===========================================================================
-- TodoList Game - PostgreSQL schema (Supabase-compatible)
-- Idempotent DDL. PostgreSQL is UTF-8 by default, so the emoji catalog data
-- is preserved without extra charset flags.
-- Statements are separated by a single ';' on the end of their final line.
-- ===========================================================================

CREATE TABLE IF NOT EXISTS character_classes (
  id VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL,
  stat_int INT NOT NULL DEFAULT 0,
  stat_vit INT NOT NULL DEFAULT 0,
  stat_agi INT NOT NULL DEFAULT 0,
  color VARCHAR(9) NOT NULL DEFAULT '#FFFFFF',
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS heroes (
  id VARCHAR(8) NOT NULL,
  name VARCHAR(50) NOT NULL,
  title VARCHAR(80) NOT NULL,
  rarity VARCHAR(20) NOT NULL,
  color VARCHAR(9) NOT NULL,
  glow VARCHAR(9) NOT NULL,
  emoji VARCHAR(16) NOT NULL,
  img VARCHAR(32) NOT NULL,
  description VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id INT NOT NULL,
  title VARCHAR(80) NOT NULL,
  description VARCHAR(255) NOT NULL,
  emoji VARCHAR(16) NOT NULL,
  color VARCHAR(9) NOT NULL,
  category VARCHAR(40) NOT NULL,
  is_secret SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL,
  player_tag VARCHAR(15) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  class_id VARCHAR(20) DEFAULT NULL,
  title VARCHAR(50) DEFAULT NULL,
  bio VARCHAR(120) DEFAULT NULL,
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  coins INT NOT NULL DEFAULT 1000,
  color VARCHAR(9) NOT NULL DEFAULT '#A3FF12',
  focus INT NOT NULL DEFAULT 50,
  consistency INT NOT NULL DEFAULT 50,
  creativity INT NOT NULL DEFAULT 50,
  stamina INT NOT NULL DEFAULT 50,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_firebase_uid UNIQUE (firebase_uid),
  CONSTRAINT uq_users_player_tag UNIQUE (player_tag),
  CONSTRAINT fk_users_class FOREIGN KEY (class_id) REFERENCES character_classes (id)
);

CREATE TABLE IF NOT EXISTS quests (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  xp INT NOT NULL DEFAULT 15,
  tag VARCHAR(20) NOT NULL DEFAULT 'MISC',
  color VARCHAR(9) NOT NULL DEFAULT '#A3FF12',
  frequency VARCHAR(20) NOT NULL DEFAULT 'daily',
  quest_date DATE DEFAULT NULL,
  completed SMALLINT NOT NULL DEFAULT 0,
  completed_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quests_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'SYSTEM',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  color VARCHAR(9) NOT NULL DEFAULT '#6A4CFF',
  is_read SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_heroes (
  user_id BIGINT NOT NULL,
  hero_id VARCHAR(8) NOT NULL,
  copies INT NOT NULL DEFAULT 1,
  unlocked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, hero_id),
  CONSTRAINT fk_user_heroes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_user_heroes_hero FOREIGN KEY (hero_id) REFERENCES heroes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id BIGINT NOT NULL,
  achievement_id INT NOT NULL,
  unlocked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, achievement_id),
  CONSTRAINT fk_user_ach_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_user_ach_ach FOREIGN KEY (achievement_id) REFERENCES achievements (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quests_user ON quests (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);

CREATE INDEX IF NOT EXISTS idx_user_heroes_hero ON user_heroes (hero_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_ach ON user_achievements (achievement_id);
