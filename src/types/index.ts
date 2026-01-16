// Core types for DevTools Hub

export type Locale = 'ru' | 'en';

export type ToolCategory =
  | 'converters'     // Конвертеры
  | 'formatters'     // Форматтеры
  | 'generators'     // Генераторы
  | 'analyzers'      // Анализаторы
  | 'security'       // Безопасность
  | 'image'          // Изображения
  | 'database'       // Базы данных
  | 'networking'     // Сеть
  | 'numbers'        // Системы счисления
  | 'datetime'       // Дата и время
  | 'text';          // Текстовые инструменты

export interface Tool {
  id: string;
  slug: string;                    // URL: /tools/{slug}
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  category: ToolCategory;
  tags: string[];
  icon: string;                    // Эмодзи или имя иконки
  isPro: boolean;                  // Требуется PRO подписка?
  isNew: boolean;
  isBeta: boolean;
  component: React.ComponentType;  // Компонент инструмента
}

export interface ToolCategoryData {
  id: ToolCategory;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  icon: string;
  color: string;                   // Tailwind color class
}

// User types (future)
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'team';
  createdAt: Date;
}

// App state interface for Zustand
export interface AppState {
  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // User (future)
  user: User | null;
  setUser: (user: User | null) => void;

  // UI state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Tool history (localStorage)
  recentTools: string[];           // Tool IDs
  addRecentTool: (toolId: string) => void;

  // Favorites (localStorage)
  favoriteTools: string[];
  toggleFavorite: (toolId: string) => void;
}
