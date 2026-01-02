import { LessonStage } from '../types';

// Мок-данные для стадий и упражнений

export const mockStages: LessonStage[] = [
  {
    id: 'stage-1',
    name: 'Бег по кругу',
    description: 'Разминка в движении',
    exercises: [
      { id: 'ex-1-1', name: 'Приставной шаг', duration: 5, description: 'Боковое перемещение' },
      { id: 'ex-1-2', name: 'Поднятие колен', duration: 5, description: 'Высокое поднимание коленей' },
      { id: 'ex-1-3', name: 'Бег на месте', duration: 3, description: 'Быстрый бег на месте' },
      { id: 'ex-1-4', name: 'Прыжки', duration: 4, description: 'Прыжки на двух ногах' },
    ],
  },
  {
    id: 'stage-2',
    name: 'Разминка на месте',
    description: 'Статичная разминка',
    exercises: [
      { id: 'ex-2-1', name: 'Упражнения на руки', duration: 8, description: 'Круговые движения, махи' },
      { id: 'ex-2-2', name: 'Упражнения на ноги', duration: 10, description: 'Приседания, выпады' },
      { id: 'ex-2-3', name: 'Растяжка', duration: 7, description: 'Растяжка основных групп мышц' },
    ],
  },
  {
    id: 'stage-3',
    name: 'Аварский танец',
    description: 'Изучение элементов аварского танца',
    exercises: [
      { id: 'ex-3-1', name: 'Ковырялки', duration: 12, description: 'Основные движения ковырялок' },
      { id: 'ex-3-2', name: 'Боковой шаг', duration: 10, description: 'Боковые перемещения' },
      { id: 'ex-3-3', name: 'Основные связки', duration: 15, description: 'Соединение движений' },
    ],
  },
  {
    id: 'stage-4',
    name: 'Упражнения на осанку',
    description: 'Формирование правильной осанки',
    exercises: [
      { id: 'ex-4-1', name: 'Позиции рук', duration: 8, description: 'Классические позиции' },
      { id: 'ex-4-2', name: 'Самолетик', duration: 5, description: 'Упражнение на баланс' },
      { id: 'ex-4-3', name: 'Классика', duration: 10, description: 'Классические позиции ног' },
    ],
  },
  {
    id: 'stage-5',
    name: 'Изучение новых движений в лезгинке',
    description: 'Новые элементы или повторение старых',
    exercises: [
      { id: 'ex-5-1', name: 'Новые движения', duration: 20, description: 'Изучение новых элементов' },
      { id: 'ex-5-2', name: 'Повторение старых', duration: 15, description: 'Закрепление пройденного' },
      { id: 'ex-5-3', name: 'Связки движений', duration: 18, description: 'Соединение элементов' },
    ],
  },
  {
    id: 'stage-6',
    name: 'Практика',
    description: 'Применение изученного на практике',
    exercises: [
      { id: 'ex-6-1', name: 'Танцы в кругу', duration: 15, description: 'Коллективное исполнение' },
      { id: 'ex-6-2', name: 'Свадебный танец', duration: 12, description: 'Отработка свадебного танца' },
      { id: 'ex-6-3', name: 'Проходки по 2 человека', duration: 10, description: 'Парная отработка движений' },
    ],
  },
];

