import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'critical';
  label: string;
}

export function RiskGauge({ score, level, label }: RiskGaugeProps) {
  const getColor = () => {
    switch (level) {
      case 'low':
        return 'text-risk-low';
      case 'moderate':
        return 'text-risk-moderate';
      case 'high':
        return 'text-risk-high';
      case 'critical':
        return 'text-risk-critical';
      default:
        return 'text-muted-foreground';
    }
  };

  const getGradient = () => {
    switch (level) {
      case 'low':
        return 'from-risk-low to-emerald-400';
      case 'moderate':
        return 'from-risk-moderate to-yellow-400';
      case 'high':
        return 'from-risk-high to-orange-400';
      case 'critical':
        return 'from-risk-critical to-red-400';
      default:
        return 'from-muted to-muted-foreground';
    }
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/50"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={cn('stop-color-current', getColor())} stopColor="currentColor" />
              <stop offset="100%" className={cn('stop-color-current', getColor())} stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-3xl font-bold font-display', getColor())}>{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className={cn('text-xs font-medium capitalize', getColor())}>{level} Risk</p>
      </div>
    </div>
  );
}