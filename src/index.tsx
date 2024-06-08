import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from './App'
import './locales/i18n'
import './styles/reset.less'
import './styles/global.less'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(<App />)
