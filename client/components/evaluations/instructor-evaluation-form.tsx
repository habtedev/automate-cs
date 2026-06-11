"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RatingScale } from "@/components/evaluations/rating-scale"
import { Building, Award, Clock, Shield, Plus, Trash2, GripVertical, Save, Send } from "lucide-react"

interface EvaluationFormProps {
  data?: any
  onDataChange?: (data: any) => void
  readonly?: boolean
  csvData?: any[]
}

const evaluationSections = {
  coreCompetency: {
    title: "Core Competency",
    icon: Award,
    description: "Essential teaching and academic skills",
    criteria: [
      "Efforts of self development in his/her specialization",
      "Adequacy of subject matter knowledge",
      "Professional Skill/Teaching Methodology",
      "Willingness to accept additional teaching assignments when compelling situation arises in the department",
      "Effectiveness as a mentor in cooperative learning, internship etc...",
      "Active participation in improvement of teaching-learning process, seminars, workshop, symposia and reviewing of teaching materials (curriculum)",
      "Participation in community service affairs and volunteer activities and willingness to participate in activities other than regular teaching (mentorship)",
      "Identifying priority areas in one's discipline and pursuing research in that area",
      "Participation in research project and project proposal development",
      "Performance as an academic advisor"
    ]
  },
  professionalCompetence: {
    title: "Professional Competence",
    icon: Building,
    description: "Professional development and expertise",
    criteria: [
      "Participation in problem identification and solving at department/college/institution",
      "Participation in Comprehensive Continuous Professional Development /GGPR-HDP.FLIP",
      "Continuous assessment implementation",
      "Providing and reporting tutorial activities designed for the students"
    ]
  },
  timeManagement: {
    title: "Time Management",
    icon: Clock,
    description: "Punctuality and time utilization",
    criteria: [
      "Executing assigned classes/invigilation on time",
      "Notifying and implementing consultation timely and Giving timely feedback to students",
      "Meeting deadlines (in reporting, SIMS result feeding, submission of grade/ documents......)"
    ]
  },
  ethicalCompetence: {
    title: "Ethical Competence",
    icon: Shield,
    description: "Professional ethics and conduct",
    criteria: [
      "Showing concern for the use of resources of the department and the University",
      "Willingness and participation in committee works at department /University level and Having positive attitude to work with others, team spirit",
      "His/her professional ethics and being a role model (dressing, hair style, personality, addiction...)"
    ]
  }
}

export function InstructorEvaluationForm({ data, onDataChange, readonly = false, csvData }: EvaluationFormProps) {
  const [ratings, setRatings] = useState<Record<string, number>>(data?.ratings || {})
  const [notApplicable, setNotApplicable] = useState<Record<string, boolean>>(data?.notApplicable || {})
  const [comments, setComments] = useState({
    general: data?.comments?.general || "",
    strengths: data?.comments?.strengths || "",
    improvements: data?.comments?.improvements || ""
  })
  const [metadata, setMetadata] = useState({
    instructor: data?.metadata?.instructor || "",
    college: data?.metadata?.college || "",
    department: data?.metadata?.department || "",
    academicYear: data?.metadata?.academicYear || "",
    semester: data?.metadata?.semester || "",
    date: data?.metadata?.date || new Date().toISOString().split('T')[0]
  })
  const [editableCriteria, setEditableCriteria] = useState<Record<string, string[]>>(data?.editableCriteria || {})

  // Transform CSV data to evaluation sections
  const getEvaluationSections = () => {
    if (csvData && csvData.length > 0) {
      const sections: Record<string, typeof evaluationSections.coreCompetency> = {}
      const iconMap: Record<string, any> = {
        'Core Competency': Award,
        'Professional Competence': Building,
        'Time Management': Clock,
        'Ethical Competence': Shield
      }
      
      csvData.forEach((row: any) => {
        const category = row['Category']
        if (!sections[category]) {
          sections[category] = {
            title: category,
            icon: iconMap[category] || Award,
            description: category,
            criteria: []
          }
        }
        sections[category].criteria.push(row['Evaluation Criteria'])
      })
      
      return sections
    }
    return evaluationSections
  }

  const currentEvaluationSections = getEvaluationSections()

  const handleRatingChange = (section: string, criterionIndex: number, value: number) => {
    const key = `${section}-${criterionIndex}`
    setRatings((prev) => ({
      ...prev,
      [key]: value
    }))
    setNotApplicable((prev) => ({
      ...prev,
      [key]: false
    }))
    onDataChange?.({
      ratings: { ...ratings, [key]: value },
      notApplicable: { ...notApplicable, [key]: false },
      comments
    })
  }

  const handleNotApplicableChange = (section: string, criterionIndex: number, checked: boolean) => {
    const key = `${section}-${criterionIndex}`
    setNotApplicable((prev) => ({
      ...prev,
      [key]: checked
    }))
    if (checked) {
      setRatings((prev) => {
        const newRatings = { ...prev }
        delete newRatings[key]
        return newRatings
      })
    }
    onDataChange?.({
      ratings,
      notApplicable: { ...notApplicable, [key]: checked },
      comments
    })
  }

  const handleCommentChange = (field: string, value: string) => {
    setComments((prev) => ({
      ...prev,
      [field]: value
    }))
    onDataChange?.({
      ratings,
      notApplicable,
      comments: { ...comments, [field]: value },
      metadata
    })
  }

  const handleMetadataChange = (field: string, value: string) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value
    }))
    onDataChange?.({
      ratings,
      notApplicable,
      comments,
      metadata: { ...metadata, [field]: value }
    })
  }

  const handleAddQuestion = (section: string) => {
    setEditableCriteria((prev) => ({
      ...prev,
      [section]: [...(prev[section] || currentEvaluationSections[section as keyof typeof currentEvaluationSections].criteria), ""]
    }))
  }

  const handleRemoveQuestion = (section: string, index: number) => {
    setEditableCriteria((prev) => {
      const sectionCriteria = prev[section] || currentEvaluationSections[section as keyof typeof currentEvaluationSections].criteria
      const newCriteria = sectionCriteria.filter((_, i) => i !== index)
      return {
        ...prev,
        [section]: newCriteria
      }
    })
  }

  const handleQuestionEdit = (section: string, index: number, value: string) => {
    setEditableCriteria((prev) => {
      const sectionCriteria = prev[section] || currentEvaluationSections[section as keyof typeof currentEvaluationSections].criteria
      const newCriteria = [...sectionCriteria]
      newCriteria[index] = value
      return {
        ...prev,
        [section]: newCriteria
      }
    })
  }

  const getSectionCriteria = (section: string) => {
    return editableCriteria[section] || currentEvaluationSections[section as keyof typeof currentEvaluationSections].criteria
  }

  const calculateSectionAverage = (section: string) => {
    const sectionCriteria = getSectionCriteria(section)
    let sum = 0
    let count = 0
    
    sectionCriteria.forEach((_, index) => {
      const key = `${section}-${index}`
      if (!notApplicable[key] && ratings[key]) {
        sum += ratings[key]
        count++
      }
    })
    
    return count > 0 ? (sum / count).toFixed(1) : "N/A"
  }

  const calculateOverallAverage = () => {
    let sum = 0
    let count = 0
    
    Object.keys(evaluationSections).forEach((section) => {
      const avg = parseFloat(calculateSectionAverage(section))
      if (!isNaN(avg)) {
        sum += avg
        count++
      }
    })
    
    return count > 0 ? (sum / count).toFixed(1) : "N/A"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b">
        <h1 className="text-2xl font-bold tracking-tight">INSTRUCTORS PERFORMANCE EVALUATION CHECKLIST</h1>
        <p className="text-sm text-muted-foreground">UNIVERSITY OF GONDAR • Education Quality Assurance and Audit Directorate</p>
      </div>

      {/* Metadata Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Information</CardTitle>
          <CardDescription>
            Fill in the evaluation details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor Name *</Label>
              <Input
                id="instructor"
                placeholder="Enter instructor name"
                value={metadata.instructor}
                onChange={(e) => handleMetadataChange("instructor", e.target.value)}
                disabled={readonly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="college">College *</Label>
              <Input
                id="college"
                placeholder="Enter college name"
                value={metadata.college}
                onChange={(e) => handleMetadataChange("college", e.target.value)}
                disabled={readonly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="Enter department name"
                value={metadata.department}
                onChange={(e) => handleMetadataChange("department", e.target.value)}
                disabled={readonly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year *</Label>
              <Input
                id="academicYear"
                placeholder="e.g., 2024/2025"
                value={metadata.academicYear}
                onChange={(e) => handleMetadataChange("academicYear", e.target.value)}
                disabled={readonly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Input
                id="semester"
                placeholder="e.g., Semester I"
                value={metadata.semester}
                onChange={(e) => handleMetadataChange("semester", e.target.value)}
                disabled={readonly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={metadata.date}
                onChange={(e) => handleMetadataChange("date", e.target.value)}
                disabled={readonly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Scale Legend */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500">1</Badge>
              <span>Very Low</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-500">2</Badge>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500">3</Badge>
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500">4</Badge>
              <span>High</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500">5</Badge>
              <span>Very High</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">N/A</Badge>
              <span>Not Applicable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Sections */}
      {Object.entries(currentEvaluationSections).map(([key, section]) => {
        const Icon = section.icon
        const criteria = getSectionCriteria(key)
        return (
          <Card key={key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Avg: {calculateSectionAverage(key)}
                  </Badge>
                  {!readonly && (
                    <Button variant="ghost" size="sm" onClick={() => handleAddQuestion(key)} className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Question
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {criteria.map((criterion, index) => {
                const ratingKey = `${key}-${index}`
                return (
                  <div key={index} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {!readonly && (
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-move mt-1" />
                        )}
                        <span className="text-sm font-medium text-muted-foreground mt-1">
                          {index + 1}.
                        </span>
                        {readonly ? (
                          <Label className="text-sm flex-1">{criterion}</Label>
                        ) : (
                          <Input
                            value={criterion}
                            onChange={(e) => handleQuestionEdit(key, index, e.target.value)}
                            className="flex-1 text-sm"
                            placeholder="Enter question..."
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!readonly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(key, index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`na-${ratingKey}`}
                            checked={notApplicable[ratingKey] || false}
                            onCheckedChange={(checked) => 
                              handleNotApplicableChange(key, index, checked as boolean)
                            }
                            disabled={readonly}
                          />
                          <Label htmlFor={`na-${ratingKey}`} className="text-xs">
                            N/A
                          </Label>
                        </div>
                        {ratings[ratingKey] && (
                          <Badge variant="secondary">{ratings[ratingKey]}/5</Badge>
                        )}
                      </div>
                    </div>
                    {!notApplicable[ratingKey] && (
                      <RatingScale
                        value={ratings[ratingKey]}
                        onChange={(value) => handleRatingChange(key, index, value)}
                        maxRating={5}
                        disabled={readonly}
                        size="sm"
                      />
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )
      })}

      {/* Overall Average */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Overall Performance Rating</h3>
              <p className="text-sm text-muted-foreground">Based on all applicable criteria</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{calculateOverallAverage()}/5</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Comments</CardTitle>
          <CardDescription>
            Provide detailed feedback on the instructor's performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="general-comments">General comments about the instructor</Label>
            <Textarea
              id="general-comments"
              placeholder="Enter your general comments here..."
              value={comments.general}
              onChange={(e) => handleCommentChange("general", e.target.value)}
              rows={4}
              disabled={readonly}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="strengths">Strengths of the instructor</Label>
            <Textarea
              id="strengths"
              placeholder="List the instructor's key strengths..."
              value={comments.strengths}
              onChange={(e) => handleCommentChange("strengths", e.target.value)}
              rows={3}
              disabled={readonly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="improvements">Suggested points/aspects the instructor should improve</Label>
            <Textarea
              id="improvements"
              placeholder="List areas where improvement is needed..."
              value={comments.improvements}
              onChange={(e) => handleCommentChange("improvements", e.target.value)}
              rows={3}
              disabled={readonly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!readonly && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Publish Evaluation
          </Button>
        </div>
      )}
    </div>
  )
}
