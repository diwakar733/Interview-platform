import Interview from '../models/Interview.js'

// Validate interview creation request
export const validateInterviewRoom = (req, res, next) => {
  const { roomId } = req.body
  
  if (!roomId || typeof roomId !== 'string' || roomId.length < 5) {
    return res.status(400).json({ 
      message: 'Invalid room ID' 
    })
  }
  
  next()
}

// Validate code update
export const validateCodeUpdate = (req, res, next) => {
  const { code, language } = req.body
  
  if (code !== undefined && typeof code !== 'string') {
    return res.status(400).json({ 
      message: 'Code must be a string' 
    })
  }
  
  const validLanguages = [
    'javascript', 'python', 'java', 'cpp', 'csharp', 
    'sql', 'ruby', 'go', 'rust', 'typescript'
  ]
  
  if (language && !validLanguages.includes(language)) {
    return res.status(400).json({ 
      message: `Invalid language. Supported: ${validLanguages.join(', ')}` 
    })
  }
  
  next()
}

// Validate interview rating
export const validateRating = (req, res, next) => {
  const { rating, feedback } = req.body
  
  if (!rating || typeof rating !== 'number') {
    return res.status(400).json({ 
      message: 'Rating must be a number' 
    })
  }
  
  if (rating < 1 || rating > 10) {
    return res.status(400).json({ 
      message: 'Rating must be between 1 and 10' 
    })
  }
  
  if (feedback && typeof feedback !== 'string') {
    return res.status(400).json({ 
      message: 'Feedback must be a string' 
    })
  }
  
  if (feedback && feedback.length > 1000) {
    return res.status(400).json({ 
      message: 'Feedback must be less than 1000 characters' 
    })
  }
  
  next()
}
