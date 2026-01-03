-- Схема базы данных для стадий уроков и упражнений

-- Таблица стадий уроков
CREATE TABLE IF NOT EXISTS LessonStages (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица упражнений
CREATE TABLE IF NOT EXISTS Exercises (
    Id TEXT PRIMARY KEY,
    StageId TEXT NOT NULL,
    Name TEXT NOT NULL,
    Duration INTEGER NOT NULL, -- в минутах
    Description TEXT,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StageId) REFERENCES LessonStages(Id) ON DELETE CASCADE
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS IX_Exercises_StageId ON Exercises(StageId);
CREATE INDEX IF NOT EXISTS IX_LessonStages_Name ON LessonStages(Name);

