import type { Question, SurveyAnswers } from '@/lib/survey'
import { RadioGroup, CheckboxGroup } from '@/components/ui/OptionGroup'
import { ScaleSelect } from '@/components/ui/ScaleSelect'
import { Textarea } from '@/components/ui/Textarea'

interface SurveyQuestionProps {
    question: Question
    answers: SurveyAnswers
    onChange: (key: keyof SurveyAnswers, value: string | number | string[] | null) => void
    error?: string
}

export function SurveyQuestion({ question, answers, onChange, error }: SurveyQuestionProps) {
    const value = answers[question.key]

    return (
        <div className="space-y-2.5">
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-400">
                        {question.number}
                    </span>
                    {question.required ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                            Required
                        </span>
                    ) : (
                        <span className="bg-brand-50 text-brand-700 rounded-full px-2 py-0.5 text-[11px] font-medium">
                            Optional
                        </span>
                    )}
                </div>
                <label className="mt-1.5 block text-[15px] leading-snug font-medium text-neutral-900">
                    {question.label}
                </label>
                {question.helper && (
                    <p className="mt-1 text-[13px] text-neutral-500">{question.helper}</p>
                )}
            </div>

            {question.type === 'radio' && (
                <RadioGroup
                    name={question.key}
                    options={question.options ?? []}
                    value={value === null ? '' : String(value)}
                    onChange={(v) => onChange(question.key, v)}
                />
            )}

            {question.type === 'scale' && (
                <ScaleSelect
                    name={question.key}
                    options={question.options ?? []}
                    value={value === null ? '' : String(value)}
                    onChange={(v) => onChange(question.key, Number(v))}
                />
            )}

            {question.type === 'checkbox' && (
                <CheckboxGroup
                    name={question.key}
                    options={question.options ?? []}
                    values={value as string[]}
                    max={question.maxSelections}
                    onChange={(v) => onChange(question.key, v)}
                />
            )}

            {question.type === 'textarea' && (
                <Textarea
                    value={value as string}
                    placeholder={question.placeholder}
                    onChange={(e) => onChange(question.key, e.target.value)}
                />
            )}

            {question.type === 'checkbox' && question.maxSelections && (
                <p className="text-xs text-neutral-400">
                    {(value as string[]).length}/{question.maxSelections} selected
                </p>
            )}

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        </div>
    )
}
