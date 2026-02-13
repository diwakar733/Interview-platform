import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { socket } from '../utils/socket'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'sql', label: 'SQL' },
]

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState('// Start coding here...\n')
  const [language, setLanguage] = useState('javascript')

  useEffect(() => {
    socket.on('receive-code', (data) => {
      setCode(data.code)
    })

    socket.on('language-change', (data) => {
      setLanguage(data.language)
    })

    return () => {
      socket.off('receive-code')
      socket.off('language-change')
    }
  }, [])

  const handleCodeChange = (value) => {
    setCode(value)
    socket.emit('code-change', {
      roomId,
      code: value,
    })
  }

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value
    setLanguage(newLanguage)
    socket.emit('language-change', {
      roomId,
      language: newLanguage,
    })
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="bg-gray-700 p-4 flex justify-between items-center border-b border-gray-600">
        <h2 className="text-white font-semibold">Code Editor</h2>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-gray-600 text-white px-3 py-1 rounded border border-gray-500 focus:outline-none"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Auto-save indicator */}
      <div className="bg-gray-700 px-4 py-2 border-t border-gray-600">
        <p className="text-xs text-gray-400">Auto-saving every 5 seconds...</p>
      </div>
    </div>
  )
}

export default CodeEditor
