export interface EvaluationTemplate {
  id: string
  title: string
  description: string
  type: 'head' | 'teacher' | 'student'
  department: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  questions: EvaluationQuestion[]
  status: 'draft' | 'active' | 'archived'
}

export interface EvaluationQuestion {
  id: string
  text: string
  type: 'rating' | 'text' | 'multiple_choice'
  category: string
  required: boolean
  options?: string[]
  maxRating?: number
}

export interface EvaluationResponse {
  id: string
  templateId: string
  evaluatorId: string
  evaluatorType: 'head' | 'teacher' | 'student'
  evaluateeId: string
  evaluateeType: 'instructor' | 'course' | 'department'
  responses: QuestionResponse[]
  totalScore: number
  averageScore: number
  submittedAt: Date
  status: 'draft' | 'submitted'
}

export interface QuestionResponse {
  questionId: string
  rating?: number
  text?: string
  selectedOption?: string
}

export interface EvaluationAnalytics {
  templateId: string
  totalEvaluations: number
  averageScore: number
  categoryAverages: Record<string, number>
  responseRate: number
  topPerformers: string[]
  areasForImprovement: string[]
}
