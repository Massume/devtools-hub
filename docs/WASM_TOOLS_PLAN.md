# План: Тяжёлые инструменты с WASM

## Обзор

Некоторые инструменты требуют нативных библиотек или сложных парсеров, которые невозможно эффективно реализовать на чистом JavaScript. Для них используем WebAssembly (WASM).

---

## 1. Protocol Buffers ↔ JSON

### Описание
Конвертация между Protocol Buffers бинарным форматом и JSON. Требует парсинг `.proto` схем.

### Варианты реализации

**Вариант A: protobuf.js (JS библиотека)**
```bash
npm install protobufjs
```
- Плюсы: Чистый JS, без WASM
- Минусы: Медленнее на больших данных, ~200KB bundle

**Вариант B: prost + wasm-pack (Rust → WASM)**
- Плюсы: Быстрее, меньше bundle
- Минусы: Требует Rust toolchain для сборки

### Рекомендация
Начать с `protobufjs`, перейти на WASM при проблемах производительности.

### Функционал
- Загрузка `.proto` файла схемы
- Encode: JSON → Protobuf binary (base64/hex)
- Decode: Protobuf binary → JSON
- Валидация по схеме
- Примеры встроенных схем

### Файлы
- `src/components/tools/ProtobufJson.tsx`
- `src/lib/i18n-protobuf.ts`
- `src/lib/protobuf-worker.ts` (Web Worker для тяжёлых операций)

---

## 2. MessagePack ↔ JSON

### Описание
MessagePack — бинарный формат сериализации, "бинарный JSON". Компактнее и быстрее JSON.

### Варианты реализации

**Вариант A: @msgpack/msgpack (JS)**
```bash
npm install @msgpack/msgpack
```
- Плюсы: Официальная библиотека, ~15KB gzip
- Минусы: Нет

**Вариант B: rmp-serde (Rust → WASM)**
- Плюсы: Быстрее для больших данных
- Минусы: Оверкилл для этой задачи

### Рекомендация
Использовать `@msgpack/msgpack` — достаточно быстрый и лёгкий.

### Функционал
- Encode: JSON → MessagePack (base64/hex)
- Decode: MessagePack → JSON
- Сравнение размеров JSON vs MessagePack
- Поддержка бинарных данных и timestamp extension

### Файлы
- `src/components/tools/MessagePackJson.tsx`
- `src/lib/i18n-messagepack.ts`

---

## 3. BSON ↔ JSON

### Описание
BSON (Binary JSON) — формат MongoDB. Поддерживает типы: ObjectId, Date, Binary, Decimal128.

### Варианты реализации

**Вариант A: bson (JS)**
```bash
npm install bson
```
- Официальная библиотека MongoDB
- ~50KB gzip
- Полная поддержка всех BSON типов

### Рекомендация
Использовать официальный `bson` пакет.

### Функционал
- Encode: JSON → BSON (base64/hex)
- Decode: BSON → JSON (Extended JSON v2)
- Генерация ObjectId
- Визуализация специальных типов (Date, Binary, Decimal128)
- Валидация BSON документов

### Файлы
- `src/components/tools/BsonJson.tsx`
- `src/lib/i18n-bson.ts`

---

## 4. AVRO ↔ JSON (Бонус)

### Описание
Apache Avro — формат сериализации с эволюцией схем. Популярен в Kafka.

### Реализация
```bash
npm install avsc
```

### Функционал
- Загрузка Avro схемы
- Encode: JSON → Avro binary
- Decode: Avro → JSON
- Schema registry совместимость

### Файлы
- `src/components/tools/AvroJson.tsx`
- `src/lib/i18n-avro.ts`

---

## 5. Thrift ↔ JSON (Бонус)

### Описание
Apache Thrift — RPC фреймворк с бинарным протоколом.

### Реализация
Требует WASM или серверный компонент. Низкий приоритет.

---

## 6. FlatBuffers ↔ JSON (Бонус)

### Описание
Google FlatBuffers — zero-copy сериализация для игр и мобильных приложений.

### Реализация
```bash
npm install flatbuffers
```

### Функционал
- Загрузка FlatBuffers схемы (.fbs)
- Encode/Decode с zero-copy доступом
- Визуализация структуры буфера

---

## Приоритеты реализации

| # | Инструмент | Приоритет | Сложность | Библиотека |
|---|------------|-----------|-----------|------------|
| 1 | MessagePack ↔ JSON | Высокий | Низкая | @msgpack/msgpack |
| 2 | BSON ↔ JSON | Высокий | Низкая | bson |
| 3 | Protocol Buffers | Средний | Средняя | protobufjs |
| 4 | AVRO ↔ JSON | Низкий | Средняя | avsc |
| 5 | FlatBuffers | Низкий | Высокая | flatbuffers |
| 6 | Thrift | Низкий | Высокая | WASM needed |

---

## Архитектурные решения

### Web Workers для тяжёлых операций

```typescript
// src/lib/binary-format-worker.ts
self.onmessage = async (e) => {
  const { type, data, format } = e.data;

  switch (format) {
    case 'msgpack':
      const { encode, decode } = await import('@msgpack/msgpack');
      // ...
      break;
    case 'bson':
      const BSON = await import('bson');
      // ...
      break;
  }

  self.postMessage({ result });
};
```

### Ленивая загрузка библиотек

```typescript
// Dynamic import для уменьшения начального bundle
const loadMsgpack = () => import('@msgpack/msgpack');
const loadBson = () => import('bson');
const loadProtobuf = () => import('protobufjs');
```

### Общий интерфейс компонента

```typescript
interface BinaryFormatConverterProps {
  format: 'msgpack' | 'bson' | 'protobuf' | 'avro';
}

// Единый компонент с переключением формата
export function BinaryFormatConverter({ format }: BinaryFormatConverterProps) {
  // Общая логика для всех бинарных форматов
}
```

---

## Оценка размера Bundle

| Библиотека | Размер (gzip) | Lazy Load? |
|------------|---------------|------------|
| @msgpack/msgpack | ~15KB | Да |
| bson | ~50KB | Да |
| protobufjs | ~200KB | Да |
| avsc | ~30KB | Да |

**Итого при lazy load:** 0KB на старте, ~300KB максимум если пользователь открывает все инструменты.

---

## План реализации

### Этап 1: MessagePack + BSON (простые)
1. Установить зависимости
2. Создать компоненты и i18n
3. Добавить в каталог
4. Тестирование

### Этап 2: Protocol Buffers (средняя сложность)
1. Реализовать загрузку .proto схем
2. Добавить встроенные примеры схем
3. Web Worker для больших файлов

### Этап 3: AVRO + FlatBuffers (опционально)
1. По запросу пользователей
2. Требует больше UI для работы со схемами

---

## Зависимости для package.json

```json
{
  "dependencies": {
    "@msgpack/msgpack": "^3.0.0",
    "bson": "^6.0.0",
    "protobufjs": "^7.0.0"
  },
  "optionalDependencies": {
    "avsc": "^5.0.0",
    "flatbuffers": "^24.0.0"
  }
}
```

---

## Риски и митигация

| Риск | Вероятность | Митигация |
|------|-------------|-----------|
| Большой bundle | Средняя | Lazy loading, code splitting |
| Медленная работа | Низкая | Web Workers |
| Проблемы с .proto парсингом | Средняя | Валидация, понятные ошибки |
| WASM не поддерживается | Низкая | Fallback на JS реализации |

---

## Заключение

Рекомендую начать с **MessagePack** и **BSON** — они простые, полезные и не требуют WASM. Protocol Buffers добавить следующим этапом. AVRO, FlatBuffers, Thrift — по запросу пользователей.
