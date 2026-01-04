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
    Duration INTEGER NOT NULL, -- в секундах
    Description TEXT,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StageId) REFERENCES LessonStages(Id) ON DELETE CASCADE
);

-- Таблица планов занятий
CREATE TABLE IF NOT EXISTS LessonPlans (
    Id TEXT PRIMARY KEY,
    Title TEXT NOT NULL UNIQUE,
    TotalDuration INTEGER NOT NULL, -- в секундах
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица элементов планов занятий
CREATE TABLE IF NOT EXISTS LessonPlanItems (
    Id TEXT PRIMARY KEY,
    PlanId TEXT NOT NULL,
    StageId TEXT NOT NULL,
    StageName TEXT NOT NULL,
    ExerciseId TEXT NOT NULL,
    ExerciseName TEXT NOT NULL,
    Duration INTEGER NOT NULL, -- в секундах
    [Order] INTEGER NOT NULL,
    FOREIGN KEY (PlanId) REFERENCES LessonPlans(Id) ON DELETE CASCADE
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS IX_Exercises_StageId ON Exercises(StageId);
CREATE INDEX IF NOT EXISTS IX_LessonStages_Name ON LessonStages(Name);
CREATE INDEX IF NOT EXISTS IX_LessonPlans_Title ON LessonPlans(Title);
CREATE INDEX IF NOT EXISTS IX_LessonPlanItems_PlanId ON LessonPlanItems(PlanId);
CREATE INDEX IF NOT EXISTS IX_LessonPlanItems_Order ON LessonPlanItems(PlanId, [Order]);

