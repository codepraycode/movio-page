import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Landing } from '@/pages/Landing'
import { Survey } from '@/pages/Survey'
import { ToastProvider } from '@/components/ui/toast'

export default function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/survey" element={<Survey />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    )
}
