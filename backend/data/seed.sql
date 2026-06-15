-- ===========================================================================
-- TodoList Game - MySQL seed data
-- Catalog data mirrored from the frontend (character classes, hero roster,
-- achievement list). Uses INSERT IGNORE so it is safe to re-run.
-- Run data/schema.sql first.
-- ===========================================================================

-- --- Character classes -----------------------------------------------------
INSERT IGNORE INTO character_classes (id, name, stat_int, stat_vit, stat_agi, color) VALUES
('hacker', 'CYBER HACKER', 8, 4, 6, '#5CE1E6'),
('artist', 'NEON ARTIST', 6, 5, 7, '#FF5DA2'),
('hustler', 'STREET SAMURAI', 5, 8, 5, '#FFD60A');

-- --- Heroes (15 Neural Net Idols) ------------------------------------------
INSERT IGNORE INTO heroes (id, name, title, rarity, color, glow, emoji, img, description) VALUES
('001', 'OMEGA', 'THE SOVEREIGN AI', 'LEGENDARY', '#FF003C', '#FFD60A', '👑', '01.png', 'Master Taskmaster. Rules the digital void with absolute efficiency. Grants immense XP boosts.'),
('002', 'KAIRO', 'THE CHRONO-WITCH', 'EPIC', '#9D4EDD', '#FF5DA2', '⏳', '02.png', 'Focus Arena Master. Bends time to maximize deep work sessions. Slows down distraction timers.'),
('003', 'CYPHER', 'THE GHOST NETRUNNER', 'EPIC', '#00B4FF', '#9D4EDD', '🥷', '03.png', 'AI Oracle Agent. Navigates the data streams unseen. Reveals hidden sub-quests.'),
('004', 'GIA', 'THE ENERGY ALCHEMIST', 'EPIC', '#FF5DA2', '#A3FF12', '⚗️', '04.png', 'Mood Journal Spirit. Transmutes chaotic emotions into raw productive power.'),
('005', 'REX', 'THE CYBER-SAMURAI', 'EPIC', '#A3FF12', '#00B4FF', '⚔️', '05.png', 'Habit Warrior. Slices through procrastination with unmatched discipline and a neon katana.'),
('006', 'PULSE', 'THE DATA DRUMMER', 'RARE', '#00B4FF', '#00B4FF', '🥁', '06.png', 'Rhythm Keeper. Keeps the system heartbeat steady. Boosts consistency multipliers.'),
('007', 'VECTOR', 'THE GRAFFITI HACKER', 'RARE', '#FFD60A', '#FF5DA2', '🎨', '07.png', 'Creative Spark. Paints the gray mainframe with brilliant ideas. Enhances design tasks.'),
('008', 'SHADE', 'THE COFFEE TECHNO-MAGE', 'RARE', '#FF9F1C', '#FFD60A', '☕', '08.png', 'Alertness Spirit. Brews the finest digital caffeine for endless stamina in the late hours.'),
('009', 'NOVA', 'THE STAR-CHART PILOT', 'RARE', '#A3FF12', '#A3FF12', '🚀', '09.png', 'Goal Navigator. Charts the optimal course through the habit galaxy.'),
('010', 'BLADE', 'THE INBOX-SLAYER', 'RARE', '#9D4EDD', '#9D4EDD', '🗡️', '10.png', 'Organization Expert. Clears unread messages and clutter with lethal precision.'),
('011', 'REZ', 'THE GLITCH-GEISHA', 'RARE', '#FF003C', '#00B4FF', '🎎', '11.png', 'Anomaly Detector. Finds and neutralizes system bugs gracefully with her fan of code.'),
('012', 'DRIFT', 'THE SYNTHWAVE RACER', 'RARE', '#FF5DA2', '#FFD60A', '🏎️', '12.png', 'Speed Organizer. Accelerates through daily repetitive tasks at terminal velocity.'),
('013', 'ECHO', 'THE SOUND-TRACKER', 'RARE', '#5CE1E6', '#5CE1E6', '🎧', '13.png', 'Focus Beats. Drowns out real-world distractions with heavy cyber-bass.'),
('014', 'LOOP', 'THE HABIT-BOT', 'RARE', '#A3FF12', '#FF5DA2', '🤖', '14.png', 'Consistency Drone. Automates repetitive thought processes without fatigue.'),
('015', 'SPARK', 'THE IDEA-COLLECTOR', 'RARE', '#FFD60A', '#00B4FF', '💡', '15.png', 'Note Taker. Captures fleeting thoughts before they dissolve into the void.');

-- --- Achievements (50 regular + 2 secret) ----------------------------------
INSERT IGNORE INTO achievements (id, title, description, emoji, color, category, is_secret) VALUES
(1, 'FIRST BLOOD', 'Selesaikan 1 Quest pertama.', '🔪', '#A3FF12', 'QUESTS & TASKS', 0),
(2, 'TASK SLAYER', 'Selesaikan 10 Quest.', '⚔️', '#A3FF12', 'QUESTS & TASKS', 0),
(3, 'QUEST KNIGHT', 'Selesaikan 50 Quest.', '🛡️', '#A3FF12', 'QUESTS & TASKS', 0),
(4, 'TASK LORD', 'Selesaikan 100 Quest.', '👑', '#A3FF12', 'QUESTS & TASKS', 0),
(5, 'GRANDMASTER', 'Selesaikan 500 Quest.', '🐉', '#A3FF12', 'QUESTS & TASKS', 0),
(6, 'EARLY BIRD', 'Selesaikan Quest sebelum jam 6 pagi.', '🌅', '#A3FF12', 'QUESTS & TASKS', 0),
(7, 'NIGHT OWL', 'Selesaikan Quest di atas jam 12 malam.', '🦉', '#A3FF12', 'QUESTS & TASKS', 0),
(8, 'WEEKEND WARRIOR', 'Selesaikan 5 Quest di hari Minggu.', '🎉', '#A3FF12', 'QUESTS & TASKS', 0),
(9, 'FROG EATER', 'Selesaikan Quest XP tertinggi pertama hari ini.', '🐸', '#A3FF12', 'QUESTS & TASKS', 0),
(10, 'INBOX ZERO', 'Kosongkan daftar Quest harianmu.', '✅', '#A3FF12', 'QUESTS & TASKS', 0),
(11, 'THE SPARK', 'Login 3 hari berturut-turut.', '🔥', '#FF9F1C', 'STREAKS & CONSISTENCY', 0),
(12, 'THE FLAME', 'Login 7 hari berturut-turut.', '⛺', '#FF9F1C', 'STREAKS & CONSISTENCY', 0),
(13, 'THE BONFIRE', 'Login 14 hari berturut-turut.', '🎇', '#FF9F1C', 'STREAKS & CONSISTENCY', 0),
(14, 'WILDFIRE', 'Login 30 hari berturut-turut.', '🌋', '#FF9F1C', 'STREAKS & CONSISTENCY', 0),
(15, 'INFERNO', 'Login 100 hari berturut-turut.', '☄️', '#FF9F1C', 'STREAKS & CONSISTENCY', 0),
(16, 'UNSTOPPABLE', 'Login 365 hari (1 Tahun).', '🌞', '#FF9F1C', 'STREAKS & CONSISTENCY', 0),
(17, 'IRON WILL', 'Kembalikan Streak yang sempat putus.', '⛓️', '#FF9F1C', 'STREAKS & CONSISTENCY', 0),
(18, 'CLOCKWORK', 'Login di jam yang sama 5 hari berturut-turut.', '⚙️', '#FF9F1C', 'STREAKS & CONSISTENCY', 0),
(19, 'HABITUAL', 'Selesaikan habit yang sama 21 hari.', '🔁', '#FF9F1C', 'STREAKS & CONSISTENCY', 0),
(20, 'RELENTLESS', 'Dapatkan 10.000 XP total.', '💯', '#FF9F1C', 'STREAKS & CONSISTENCY', 0),
(21, 'ARENA INITIATE', 'Masuk ke Focus Arena pertama kali.', '🚪', '#FF5DA2', 'FOCUS ARENA & BOSSES', 0),
(22, 'GLITCH SLAYER', 'Kalahkan boss GLITCH SWARM.', '👾', '#FF5DA2', 'FOCUS ARENA & BOSSES', 0),
(23, 'HYDRA TAMER', 'Kalahkan boss INBOX HYDRA.', '🐙', '#FF5DA2', 'FOCUS ARENA & BOSSES', 0),
(24, 'GOLEM BREAKER', 'Kalahkan boss SLOTH GOLEM.', '🗿', '#FF5DA2', 'FOCUS ARENA & BOSSES', 0),
(25, 'DRAGON BORN', 'Kalahkan boss PROCRASTO-WYRM.', '🐉', '#FF5DA2', 'FOCUS ARENA & BOSSES', 0),
(26, 'DEFLECTOR', 'Gunakan fitur Block Distraction 1x.', '🛡️', '#FF5DA2', 'FOCUS ARENA & BOSSES', 0),
(27, 'IRON SHIELD', 'Block 100 Distractions total.', '🦾', '#FF5DA2', 'FOCUS ARENA & BOSSES', 0),
(28, 'DEEP DIVER', 'Selesaikan sesi fokus 60 menit penuh.', '🤿', '#FF5DA2', 'FOCUS ARENA & BOSSES', 0),
(29, 'UNBROKEN', 'Kalahkan 3 boss berturut-turut tanpa gagal.', '🩸', '#FF5DA2', 'FOCUS ARENA & BOSSES', 0),
(30, 'TIME LORD', 'Habiskan 100 Jam di Focus Arena.', '⏳', '#FF5DA2', 'FOCUS ARENA & BOSSES', 0),
(31, 'FIRST ENTRY', 'Tulis jurnal mood pertamamu.', '📝', '#5CE1E6', 'JOURNAL & ENERGY', 0),
(32, 'ALCHEMIST', 'Gunakan fitur Energy Alchemist 10x.', '⚗️', '#5CE1E6', 'JOURNAL & ENERGY', 0),
(33, 'AURA READER', 'Temukan 5 Aura Color yang berbeda.', '🌈', '#5CE1E6', 'JOURNAL & ENERGY', 0),
(34, 'ZEN STATE', 'Dapatkan status "Calm" atau "Zen".', '🧘', '#5CE1E6', 'JOURNAL & ENERGY', 0),
(35, 'HIGH ENERGY', 'Dapatkan status energi level maksimal.', '🔋', '#5CE1E6', 'JOURNAL & ENERGY', 0),
(36, 'CHAOS THEORY', 'Jurnal saat sedang burn-out/chaos.', '🌪️', '#5CE1E6', 'JOURNAL & ENERGY', 0),
(37, 'SELF AWARE', 'Log mood 7 hari berturut-turut.', '👁️', '#5CE1E6', 'JOURNAL & ENERGY', 0),
(38, 'REFLECTIVE', 'Tulis jurnal lebih dari 100 kata.', '📖', '#5CE1E6', 'JOURNAL & ENERGY', 0),
(39, 'MINDFUL', 'Catat mood di pagi dan malam hari.', '🌗', '#5CE1E6', 'JOURNAL & ENERGY', 0),
(40, 'SOUL SEARCHER', 'Gunakan Alchemist 100x.', '🌌', '#5CE1E6', 'JOURNAL & ENERGY', 0),
(41, 'HELLO WORLD', 'Buat karakter dan masuk ke sistem.', '👋', '#6A4CFF', 'SYSTEM & ORACLE', 0),
(42, 'SEEKER OF TRUTH', 'Tanya ke AI Oracle untuk pertama kalinya.', '🔮', '#6A4CFF', 'SYSTEM & ORACLE', 0),
(43, 'PROPHECY FULFILLED', 'Selesaikan semua quest dari 1 sesi Oracle.', '📜', '#6A4CFF', 'SYSTEM & ORACLE', 0),
(44, 'LORE MASTER', 'Tanya Oracle 50x.', '🧙', '#6A4CFF', 'SYSTEM & ORACLE', 0),
(45, 'BARD TALE', 'Gunakan fitur BARDIFY pada task 10x.', '🪕', '#6A4CFF', 'SYSTEM & ORACLE', 0),
(46, 'CYBER HACKER', 'Selesaikan 100 Task ber-tag CODE.', '💻', '#6A4CFF', 'SYSTEM & ORACLE', 0),
(47, 'NEON ARTIST', 'Selesaikan 100 Task ber-tag DESIGN.', '🎨', '#6A4CFF', 'SYSTEM & ORACLE', 0),
(48, 'STREET SAMURAI', 'Selesaikan 100 Task ber-tag HUSTLE.', '🥷', '#6A4CFF', 'SYSTEM & ORACLE', 0),
(49, 'OVERCLOCKER', 'Dapatkan 1000 XP dalam satu hari.', '🚀', '#6A4CFF', 'SYSTEM & ORACLE', 0),
(50, 'SECOND BRAIN', 'Selesaikan 100% dari semua 49 Achievement.', '🧠', '#6A4CFF', 'SYSTEM & ORACLE', 0),
(99, 'GHOST IN THE MACHINE', 'Temukan pesan rahasia di dalam source code sistem.', '👁️', '#FF003C', 'CLASSIFIED ANOMALIES', 1),
(100, 'NIGHTMARE MODE', 'Selesaikan 5 Boss Arena berturut-turut tanpa gagal.', '🩸', '#FF003C', 'CLASSIFIED ANOMALIES', 1);
