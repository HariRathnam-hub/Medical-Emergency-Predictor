import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('shadow-card border-border/50 overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold font-display text-foreground">{value}</p>
              {trend && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-risk-low' : 'text-risk-high'
                  )}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}