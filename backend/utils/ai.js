import axios from 'axios'

const LANGUAGE_MAP = {
  javascript: 63, // Node.js (example Judge0 id)
  python: 71, // Python 3
  java: 62,
  cpp: 54,
}

export async function runCodeOnJudge0(code, language = 'javascript', stdin = '') {
  const url = process.env.JUDGE0_URL || 'https://judge0.p.rapidapi.com'
  const apiKey = process.env.JUDGE0_API_KEY || ''
  const language_id = LANGUAGE_MAP[language] || LANGUAGE_MAP.javascript

  const payload = {
    source_code: code,
    language_id,
    stdin: stdin || '',
  }

  const headers = {
    'Content-Type': 'application/json',
  }

  if (apiKey) {
    headers['X-RapidAPI-Key'] = apiKey
  }

  const endpoint = `${url}/submissions?base64_encoded=false&wait=true`

  const resp = await axios.post(endpoint, payload, { headers })
  return resp.data
}

export async function analyzeInterview({ transcript = '', code = '', language = 'javascript' }) {
  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const systemPrompt = `You are an AI interviewer assistant. Given a candidate's transcript and code, return a strict JSON object with these keys: technicalScore (0-100), communicationScore (0-100), confidenceScore (0-100), suggestions (array of short improvement suggestions). Do not include any additional text.`

  const userPrompt = `Transcript:\n${transcript}\n\nCode:\n${code}\n\nLanguage:${language}`

  const payload = {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 800,
    temperature: 0.2,
  }

  const resp = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
  })

  const text = resp.data?.choices?.[0]?.message?.content || ''

  // Try to parse JSON out of the response; best-effort
  try {
    const jsonStart = text.indexOf('{')
    const jsonText = jsonStart !== -1 ? text.slice(jsonStart) : text
    const parsed = JSON.parse(jsonText)
    return parsed
  } catch (err) {
    // If parsing fails return raw text
    return { raw: text }
  }
}
