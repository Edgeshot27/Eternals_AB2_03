export type ThemeColor = 'blue' | 'purple' | 'green' | 'rose' | 'amber';

export interface ThemeColors {
  primary: {
    light: string;
    dark: string;
    hover: string;
    bg: string;
    text: string;
  };
  background: {
    light: string;
    dark: string;
  };
}

export const themeColors: Record<ThemeColor, ThemeColors> = {
  blue: {
    primary: {
      light: 'bg-blue-600',
      dark: 'bg-blue-500',
      hover: 'hover:bg-blue-700',
      bg: 'bg-blue-100',
      text: 'text-blue-600'
    },
    background: {
      light: 'bg-gray-100',
      dark: 'bg-gray-900'
    }
  },
  purple: {
    primary: {
      light: 'bg-purple-600',
      dark: 'bg-purple-500',
      hover: 'hover:bg-purple-700',
      bg: 'bg-purple-100',
      text: 'text-purple-600'
    },
    background: {
      light: 'bg-gray-100',
      dark: 'bg-gray-900'
    }
  },
  green: {
    primary: {
      light: 'bg-emerald-600',
      dark: 'bg-emerald-500',
      hover: 'hover:bg-emerald-700',
      bg: 'bg-emerald-100',
      text: 'text-emerald-600'
    },
    background: {
      light: 'bg-gray-100',
      dark: 'bg-gray-900'
    }
  },
  rose: {
    primary: {
      light: 'bg-rose-600',
      dark: 'bg-rose-500',
      hover: 'hover:bg-rose-700',
      bg: 'bg-rose-100',
      text: 'text-rose-600'
    },
    background: {
      light: 'bg-gray-100',
      dark: 'bg-gray-900'
    }
  },
  amber: {
    primary: {
      light: 'bg-amber-600',
      dark: 'bg-amber-500',
      hover: 'hover:bg-amber-700',
      bg: 'bg-amber-100',
      text: 'text-amber-600'
    },
    background: {
      light: 'bg-gray-100',
      dark: 'bg-gray-900'
    }
  }
};