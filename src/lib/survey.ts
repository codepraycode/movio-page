/**
 * Declarative survey definition. The Survey page renders entirely from this
 * config so the 15 questions live in one place and map 1:1 to the
 * `survey_responses` table columns documented in CLAUDE.md / supabase/schema.sql.
 */

/** Keys mirror the `survey_responses` columns exactly. */
export interface SurveyAnswers {
    study_level: string
    shuttle_frequency: string
    wait_time: string
    arrival_awareness: string
    late_for_lecture: string
    full_bus_experience: string
    change_problem: string
    satisfaction_score: number | null
    biggest_problem: string
    has_nfc: string
    live_tracking_usefulness: string
    tap_to_board_interest: string
    desired_features: string[]
    app_comfort: string
    additional_comments: string
}

export type AnswerKey = keyof SurveyAnswers

export type QuestionType = 'radio' | 'scale' | 'textarea' | 'checkbox'

export interface Question {
    /** Column name in survey_responses. */
    key: AnswerKey
    /** Display number, e.g. "Q1". */
    number: string
    label: string
    type: QuestionType
    required: boolean
    helper?: string
    placeholder?: string
    /** Radio/checkbox options. For `scale`, value is the stored integer. */
    options?: { value: string; label: string }[]
    /** Checkbox cap (Q13 = max 3). */
    maxSelections?: number
}

export interface SurveyStep {
    id: number
    section: string
    title: string
    description: string
    questions: Question[]
}

/** The frequency answer that ends the survey early. */
export const NEVER_USES_SHUTTLE = 'Never — I do not use the shuttle'

export const initialAnswers: SurveyAnswers = {
    study_level: '',
    shuttle_frequency: '',
    wait_time: '',
    arrival_awareness: '',
    late_for_lecture: '',
    full_bus_experience: '',
    change_problem: '',
    satisfaction_score: null,
    biggest_problem: '',
    has_nfc: '',
    live_tracking_usefulness: '',
    tap_to_board_interest: '',
    desired_features: [],
    app_comfort: '',
    additional_comments: '',
}

const opts = (...labels: string[]) => labels.map((label) => ({ value: label, label }))

export const surveySteps: SurveyStep[] = [
    {
        id: 1,
        section: 'Section A',
        title: 'About you',
        description: 'Two quick questions so we know who we are hearing from.',
        questions: [
            {
                key: 'study_level',
                number: 'Q1',
                label: 'What is your current level of study at FUTA?',
                type: 'radio',
                required: true,
                options: opts(
                    '100 Level',
                    '200 Level',
                    '300 Level',
                    '400 Level',
                    '500 Level',
                    'Postgraduate',
                ),
            },
            {
                key: 'shuttle_frequency',
                number: 'Q2',
                label: 'How often do you use the FUTA campus shuttle service?',
                type: 'radio',
                required: true,
                options: opts(
                    'Daily',
                    'Several times a week',
                    'Occasionally',
                    'Rarely',
                    NEVER_USES_SHUTTLE,
                ),
            },
        ],
    },
    {
        id: 2,
        section: 'Section B',
        title: 'Current shuttle experience',
        description: 'Tell us what riding the FUTA shuttle is actually like today.',
        questions: [
            {
                key: 'wait_time',
                number: 'Q3',
                label: 'On a typical day, how long do you usually wait for a shuttle at the bus stop?',
                type: 'radio',
                required: true,
                options: opts(
                    'Less than 5 minutes',
                    '5–10 minutes',
                    '11–20 minutes',
                    '21–30 minutes',
                    'More than 30 minutes',
                ),
            },
            {
                key: 'arrival_awareness',
                number: 'Q4',
                label: 'While waiting at a bus stop, do you have any way of knowing when the next shuttle will arrive?',
                type: 'radio',
                required: true,
                options: opts('Yes, always', 'Sometimes', 'Rarely', 'No, never'),
            },
            {
                key: 'late_for_lecture',
                number: 'Q5',
                label: 'Have you ever missed a lecture or arrived late because of the campus shuttle?',
                type: 'radio',
                required: true,
                options: opts('Yes, frequently', 'Yes, occasionally', 'Rarely', 'Never'),
            },
            {
                key: 'full_bus_experience',
                number: 'Q6',
                label: 'Have you ever been unable to board a shuttle because it was already full?',
                type: 'radio',
                required: true,
                options: opts('Yes, frequently', 'Yes, occasionally', 'Rarely', 'Never'),
            },
            {
                key: 'change_problem',
                number: 'Q7',
                label: 'Have you ever paid more than ₦150 because the driver could not provide change?',
                type: 'radio',
                required: true,
                options: opts(
                    'Yes, frequently',
                    'Yes, occasionally',
                    'Rarely',
                    'No, never',
                    'I always pay with exact change',
                ),
            },
            {
                key: 'satisfaction_score',
                number: 'Q8',
                label: 'How satisfied are you with the current FUTA campus shuttle service overall?',
                type: 'scale',
                required: true,
                helper: '1 = Very dissatisfied · 5 = Very satisfied',
                options: [
                    { value: '1', label: '1 — Very dissatisfied' },
                    { value: '2', label: '2 — Dissatisfied' },
                    { value: '3', label: '3 — Neutral' },
                    { value: '4', label: '4 — Satisfied' },
                    { value: '5', label: '5 — Very satisfied' },
                ],
            },
            {
                key: 'biggest_problem',
                number: 'Q9',
                label: 'In your own words, what is the biggest problem you personally face with the FUTA campus shuttle?',
                type: 'textarea',
                required: false,
                placeholder: 'e.g. I never know when the next bus is coming...',
            },
        ],
    },
    {
        id: 3,
        section: 'Section C',
        title: 'Technology and app features',
        description: 'How you feel about a smarter, app-based shuttle experience.',
        questions: [
            {
                key: 'has_nfc',
                number: 'Q10',
                label: 'Does your smartphone support NFC (contactless tap) functionality?',
                type: 'radio',
                required: true,
                helper: 'NFC lets your phone communicate by tapping it near another device — most Android phones made after 2018 have it.',
                options: opts(
                    'Yes, I know my phone has NFC',
                    "I'm not sure",
                    'No, my phone does not have NFC',
                ),
            },
            {
                key: 'live_tracking_usefulness',
                number: 'Q11',
                label: 'If a mobile app showed the real-time location of campus shuttles on a map, how useful would that be to you?',
                type: 'radio',
                required: true,
                options: opts('Extremely useful', 'Very useful', 'Somewhat useful', 'Not useful'),
            },
            {
                key: 'tap_to_board_interest',
                number: 'Q12',
                label: 'If you could tap your student ID or phone to board the shuttle instead of paying cash, would you use it?',
                type: 'radio',
                required: true,
                options: opts('Yes, definitely', 'Probably yes', 'Not sure', 'Probably not', 'No'),
            },
            {
                key: 'desired_features',
                number: 'Q13',
                label: 'Which features would be most important to you in a campus shuttle app? Select up to 3.',
                type: 'checkbox',
                required: true,
                maxSelections: 3,
                options: opts(
                    'Live map showing shuttle location',
                    'Estimated time of arrival at my stop',
                    'Notification when a shuttle is nearby',
                    'Tap-to-board instead of cash payment',
                    'Shuttle schedule and route information',
                    'How full the bus is before it arrives',
                ),
            },
            {
                key: 'app_comfort',
                number: 'Q14',
                label: 'How comfortable are you using mobile apps for everyday tasks like payments and navigation?',
                type: 'radio',
                required: true,
                options: opts(
                    'Very comfortable',
                    'Comfortable',
                    'Neutral',
                    'Uncomfortable',
                    'Very uncomfortable',
                ),
            },
            {
                key: 'additional_comments',
                number: 'Q15',
                label: "Any other comments about campus transport at FUTA, or features you'd like to see in a shuttle app?",
                type: 'textarea',
                required: false,
                placeholder: "Anything else you'd like us to know...",
            },
        ],
    },
]
