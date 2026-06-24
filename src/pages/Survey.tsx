import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, PartyPopper, Send, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProgressBar } from '@/components/ProgressBar'
import { SurveyQuestion } from '@/components/SurveyQuestion'
import { WaitlistForm } from '@/components/WaitlistForm'
import { ShareButtons } from '@/components/ShareButtons'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/toast'
import { supabase } from '@/lib/supabase'
import {
    surveySteps,
    initialAnswers,
    NEVER_USES_SHUTTLE,
    type SurveyAnswers,
    type Question,
} from '@/lib/survey'

type View = 'form' | 'exit' | 'done'

/** A little momentum nudge under the progress bar per step. */
const stepEncouragement = [
    'Just two quick ones to start 👇',
    'Nice — now the real stuff. You’re flying through this.',
    'Last step! You’re basically done 🎉',
]

export function Survey() {
    const { toast } = useToast()
    const [view, setView] = useState<View>('form')
    const [stepIndex, setStepIndex] = useState(0)
    const [answers, setAnswers] = useState<SurveyAnswers>(initialAnswers)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)

    const step = surveySteps[stepIndex]
    const isLastStep = stepIndex === surveySteps.length - 1

    function update(key: keyof SurveyAnswers, value: string | number | string[] | null) {
        setAnswers((prev) => ({ ...prev, [key]: value }))
        setErrors((prev) => {
            if (!prev[key]) return prev
            const next = { ...prev }
            delete next[key]
            return next
        })
    }

    /** Validate the current step; returns true if it passes. */
    function validateStep(): boolean {
        const next: Record<string, string> = {}
        for (const q of step.questions) {
            const err = validateQuestion(q, answers)
            if (err) next[q.key] = err
        }
        setErrors(next)
        if (Object.keys(next).length > 0) {
            toast({
                variant: 'info',
                title: 'Just a couple left on this step',
                description: 'Mind answering the highlighted questions before we continue?',
            })
        }
        return Object.keys(next).length === 0
    }

    function handleNext() {
        if (!validateStep()) return

        // Conditional exit: a student who never uses the shuttle stops here.
        if (stepIndex === 0 && answers.shuttle_frequency === NEVER_USES_SHUTTLE) {
            setView('exit')
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        if (isLastStep) {
            void handleSubmit()
        } else {
            setStepIndex((i) => i + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    function handleBack() {
        setErrors({})
        setStepIndex((i) => Math.max(0, i - 1))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleSubmit() {
        setSubmitting(true)
        const { error } = await supabase.from('survey_responses').insert(answers)
        setSubmitting(false)

        if (error) {
            toast({
                variant: 'error',
                title: 'Could not submit',
                description: 'Something went wrong saving your response. Please try again.',
            })
            return
        }

        setView('done')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="flex min-h-screen flex-col bg-neutral-50">
            <Navbar />
            <div className="bg-grid relative flex-1">
                <div
                    className="bg-aurora pointer-events-none absolute inset-x-0 top-0 h-64"
                    aria-hidden
                />
                <main className="relative mx-auto max-w-2xl px-4 py-10">
                    {view === 'form' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <ProgressBar current={stepIndex + 1} total={surveySteps.length} />
                                <p className="text-brand-700 text-sm font-medium">
                                    {stepEncouragement[stepIndex]}
                                </p>
                            </div>

                            {/* key forces a replayed entrance animation on each step change */}
                            <div key={stepIndex} className="animate-fade-up space-y-6">
                                <div>
                                    <span className="border-brand-200 bg-brand-50 text-brand-700 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold">
                                        <span className="bg-brand-500 h-1.5 w-1.5 rounded-full" />
                                        {step.section}
                                    </span>
                                    <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-neutral-900">
                                        {step.title}
                                    </h1>
                                    <p className="mt-1 text-sm text-neutral-600">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="shadow-card relative space-y-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
                                    <span
                                        className="from-brand-400 via-brand-500 to-brand-600 absolute inset-x-0 top-0 h-1 bg-gradient-to-r"
                                        aria-hidden
                                    />
                                    {step.questions.map((q) => (
                                        <SurveyQuestion
                                            key={q.key}
                                            question={q}
                                            answers={answers}
                                            onChange={update}
                                            error={errors[q.key]}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                {stepIndex > 0 ? (
                                    <Button variant="outline" onClick={handleBack}>
                                        <ArrowLeft className="h-4 w-4" /> Back
                                    </Button>
                                ) : (
                                    <span />
                                )}
                                <Button
                                    onClick={handleNext}
                                    loading={submitting}
                                    className="transition-all hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    {isLastStep ? (
                                        submitting ? (
                                            'Submitting...'
                                        ) : (
                                            <>
                                                Submit survey <Send className="h-4 w-4" />
                                            </>
                                        )
                                    ) : (
                                        <>
                                            Next <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-neutral-400">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Anonymous · your answers shape a real FUTA project
                            </p>
                        </div>
                    )}

                    {view === 'exit' && <ExitScreen />}
                    {view === 'done' && <ThankYouScreen />}
                </main>
            </div>
            <Footer />
        </div>
    )
}

/** Returns an error message for a question, or null if it is valid. */
function validateQuestion(q: Question, answers: SurveyAnswers): string | null {
    const value = answers[q.key]

    if (q.type === 'checkbox') {
        const arr = value as string[]
        if (q.required && arr.length === 0) return 'Please select at least one option.'
        if (q.maxSelections && arr.length > q.maxSelections) {
            return `Please select a maximum of ${q.maxSelections} options.`
        }
        return null
    }

    if (!q.required) return null

    if (q.type === 'scale') {
        return value === null ? 'Please choose a rating.' : null
    }

    return value === '' || value === null ? 'This question is required.' : null
}

function ExitScreen() {
    return (
        <div className="animate-fade-up space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
                <CheckCircle2 className="text-brand-600 mx-auto h-12 w-12" />
                <h1 className="mt-4 text-2xl font-bold text-neutral-900">
                    Thanks for your honesty 🙏🏽
                </h1>
                <p className="mx-auto mt-3 max-w-md text-neutral-600">
                    Since you don’t use the shuttle, the rest won’t really apply to you — no
                    worries. You can still join the Movio waitlist below, or pass this on to a
                    friend who does ride the shuttle.
                </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-center text-lg font-semibold text-neutral-900">
                    Join the Movio waitlist
                </h2>
                <WaitlistForm />
            </div>
            <p className="text-center">
                <Link to="/" className="text-brand-700 hover:text-brand-800 text-sm font-medium">
                    ← Back to home
                </Link>
            </p>
        </div>
    )
}

function ThankYouScreen() {
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''

    return (
        <div className="animate-fade-up space-y-6">
            <div className="border-brand-100 from-brand-50 relative overflow-hidden rounded-2xl border bg-gradient-to-br to-white p-8 text-center shadow-sm">
                <PartyPopper className="text-brand-600 mx-auto h-12 w-12" />
                <h1 className="mt-4 text-2xl font-bold text-neutral-900">
                    You’re a legend. Thank you! 🎉
                </h1>
                <p className="mx-auto mt-3 max-w-md text-neutral-600">
                    Your response is recorded and will directly help shape Movio. This genuinely
                    means a lot for a final year project at the School of Computing, FUTA.
                </p>
            </div>

            {/* The big ask: share */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-neutral-900">One tiny favour? 🙏🏽</h2>
                <p className="mt-1.5 text-sm text-neutral-600">
                    The research only holds up if enough <strong>real FUTA students</strong>{' '}
                    respond. If you know even one or two course mates, please forward this — it
                    takes them 3 minutes and it pushes Movio forward more than you’d think.
                </p>
                <div className="mt-4">
                    <ShareButtons url={shareUrl} />
                </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-center text-lg font-semibold text-neutral-900">
                    Haven’t joined the waitlist yet?
                </h2>
                <p className="mb-4 text-center text-sm text-neutral-600">
                    Get notified the moment Movio launches.
                </p>
                <WaitlistForm />
            </div>

            <p className="text-center">
                <Link to="/" className="text-brand-700 hover:text-brand-800 text-sm font-medium">
                    ← Back to home
                </Link>
            </p>
        </div>
    )
}
