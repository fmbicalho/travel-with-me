import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggle({ className = '', ...props }: HTMLAttributes<HTMLButtonElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const isDark = appearance === 'dark';
    const Icon = isDark ? Moon : Sun;

    return (
        <button
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                'hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60',
                'focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 dark:focus:ring-neutral-400',
                className
            )}
            aria-label={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
            {...props}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}