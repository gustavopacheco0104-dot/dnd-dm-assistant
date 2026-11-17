import { useState } from 'react'
import Navbar from './components/Navbar'
import Bestiary from './pages/Bestiary'
import LootGenerator from './pages/LootGenerator'
import DiceTray from './pages/DiceTray'
import './App.css'

function App() {
  const [section, setSection] = useState('bestiary')

  return (
    <>
      <Navbar current={section} onChange={setSection} />
      <main>
        {section === 'bestiary' && <Bestiary />}
        {section === 'loot' && <LootGenerator />}
        {section === 'dice' && <DiceTray />}
      </main>
    </>
  )
}

export default App