import { Progress } from '@/components/ui/Progress'

interface ProgressBarProps {
    current: number
    total: number
}

/** Survey step indicator: "Step X of N" + a filled progress track. */
export function ProgressBar({ current, total }: ProgressBarProps) {
    const value = (current / total) * 100
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
                <span>
                    Step {current} of {total}
                </span>
                <span>{Math.round(value)}%</span>
            </div>
            <Progress value={value} />
        </div>
    )
}
