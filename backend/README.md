# Curriculum Constructor Backend

Backend API для конструктора учебных программ на ASP.NET Core 8.0 с архитектурой Onion Architecture.

## Архитектура

Проект организован по принципу **Onion Architecture** (Луковая архитектура), где каждый слой - это отдельный проект:

```
backend/
├── CurriculumConstructor.Domain/          # Доменный слой (ядро)
│   └── Exceptions/                        # Доменные исключения
├── CurriculumConstructor.Application/      # Слой приложения
│   ├── Common/                           # Общие классы (ApiResponse, BaseMapper)
│   └── Interfaces/                       # Интерфейсы (IRepository, IMapper)
├── CurriculumConstructor.Infrastructure/   # Слой инфраструктуры
│   └── Repositories/                     # Реализация репозиториев (Dapper)
└── CurriculumConstructor.Api/             # Слой представления (API)
    ├── Controllers/                      # API контроллеры
    ├── Middleware/                       # Middleware компоненты
    └── Extensions/                       # Extension методы для настройки
```

### Зависимости между слоями

- **Domain** - не зависит ни от чего (ядро)
- **Application** - зависит от Domain
- **Infrastructure** - зависит от Application и Domain
- **API** - зависит от Application и Infrastructure

## Технологии

- **.NET 8.0** - платформа разработки
- **ASP.NET Core Web API** - фреймворк для создания REST API
- **Dapper** - ORM для работы с базой данных
- **FluentValidation** - валидация моделей
- **Swagger/OpenAPI** - документация API
- **Microsoft.AspNetCore.Mvc.Versioning** - версионирование API

## Структура проектов

### Domain (CurriculumConstructor.Domain)
Доменный слой содержит:
- Исключения (ApiException, ValidationException, NotFoundException и др.)

### Application (CurriculumConstructor.Application)
Слой приложения содержит:
- Общие классы (ApiResponse, BaseMapper)
- Интерфейсы (IRepository, IMapper)
- Бизнес-логика (будет добавлена)

### Infrastructure (CurriculumConstructor.Infrastructure)
Слой инфраструктуры содержит:
- Реализация репозиториев (BaseRepository с использованием Dapper)
- Работа с базой данных

### API (CurriculumConstructor.Api)
Слой представления содержит:
- Контроллеры
- Middleware (ExceptionHandlingMiddleware)
- Extension методы для настройки сервисов
- Конфигурация приложения (Program.cs, appsettings.json)

## Настройка

1. Клонируйте репозиторий и перейдите в папку backend:
```bash
cd backend
```

2. Восстановите зависимости:
```bash
dotnet restore
```

3. Настройте строку подключения к базе данных в `CurriculumConstructor.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CurriculumConstructor;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

4. Настройте CORS в `CurriculumConstructor.Api/appsettings.json` (если необходимо):
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173"
    ]
  }
}
```

## Запуск

### Development режим

```bash
dotnet run --project CurriculumConstructor.Api
```

Или через Visual Studio / Rider - просто запустите проект `CurriculumConstructor.Api`.

API будет доступен по адресу:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

Swagger UI будет доступен по адресу:
- `http://localhost:5000` (в Development режиме)

### Проверка работоспособности

После запуска проверьте health endpoint:
```bash
GET http://localhost:5000/api/v1/health
```
