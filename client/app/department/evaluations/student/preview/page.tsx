"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RatingScale } from "@/components/evaluations/rating-scale"
import { Building, Award, Clock, Shield, ArrowLeft, Save, Send, Printer } from "lucide-react"
import Link from "next/link"

export default function StudentPreviewPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [notApplicable, setNotApplicable] = useState<Record<string, boolean>>({})
  const [comments, setComments] = useState({
    general: "",
    strengths: "",
    improvements: ""
  })
  const [metadata, setMetadata] = useState({
    student: "",
    college: "",
    department: "",
    academicYear: "",
    semester: "",
    date: new Date().toISOString().split('T')[0]
  })
  const [csvData, setCsvData] = useState<any[]>([])

  // Load CSV data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('studentCsvData')
    if (storedData) {
      try {
        setCsvData(JSON.parse(storedData))
      } catch (error) {
        console.error('Error parsing CSV data:', error)
      }
    }
  }, [])

  const defaultEvaluationSections = {
    courseContent: {
      title: "Course Content",
      icon: Award,
      description: "Course organization and structure",
      criteria: [
        "Course content was well-organized and structured",
        "Instructor explained concepts clearly",
        "Course materials were helpful and relevant",
        "Assignments were fair and contributed to learning"
      ]
    },
    instructorPerformance: {
      title: "Instructor Performance",
      icon: Building,
      description: "Teaching effectiveness and communication",
      criteria: [
        "Instructor was available for questions and help",
        "The pace of the course was appropriate",
        "Instructor encouraged student participation",
        "Instructor provided timely feedback"
      ]
    },
    learningOutcomes: {
      title: "Learning Outcomes",
      icon: Clock,
      description: "Knowledge gained and skills developed",
      criteria: [
        "I learned a lot from this course",
        "Course objectives were clearly stated",
        "Assessment methods were fair and appropriate",
        "Course improved my understanding of the subject"
      ]
    },
    overallExperience: {
      title: "Overall Experience",
      icon: Shield,
      description: "General satisfaction and recommendations",
      criteria: [
        "I would recommend this course to others",
        "Course workload was manageable",
        "Classroom environment was conducive to learning",
        "Overall course quality was excellent"
      ]
    }
  }

  // Transform CSV data to evaluation sections
  const getEvaluationSections = () => {
    if (csvData && csvData.length > 0) {
      const sections: Record<string, typeof defaultEvaluationSections.courseContent> = {}
      const iconMap: Record<string, any> = {
        'Course Content': Award,
        'Instructor Performance': Building,
        'Learning Outcomes': Clock,
        'Overall Experience': Shield,
        'Core Competency': Award,
        'Professional Competence': Building,
        'Time Management': Clock,
        'Ethical Competence': Shield
      }
      
      csvData.forEach((row: any) => {
        const category = row['Category'] || row['category']
        const criteria = row['Evaluation Criteria (Amharic)'] || row['Evaluation Criteria'] || row['Evaluation Criteria'] || row['criteria'] || row['question'] || ''
        
        if (category && criteria) {
          if (!sections[category]) {
            sections[category] = {
              title: category,
              icon: iconMap[category] || Award,
              description: category,
              criteria: []
            }
          }
          sections[category].criteria.push(criteria)
        }
      })
      
      return sections
    }
    return defaultEvaluationSections
  }

  const evaluationSections = getEvaluationSections()

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
  }

  const handleCommentChange = (field: string, value: string) => {
    setComments((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMetadataChange = (field: string, value: string) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateSectionAverage = (section: string) => {
    const sectionCriteria = evaluationSections[section as keyof typeof evaluationSections]?.criteria || []
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
      const sectionCriteria = evaluationSections[section as keyof typeof evaluationSections]?.criteria || []
      sectionCriteria.forEach((_, index) => {
        const key = `${section}-${index}`
        if (!notApplicable[key] && ratings[key]) {
          sum += ratings[key]
          count++
        }
      })
    })
    
    return count > 0 ? (sum / count).toFixed(1) : "N/A"
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/department/evaluations/student">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">Student Evaluation Preview</h1>
                <p className="text-sm text-muted-foreground">View and print evaluation form</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button size="sm" className="gap-2">
                <Send className="h-4 w-4" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b">
            <h1 className="text-2xl font-bold tracking-tight">STUDENT EVALUATION FORM</h1>
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
                  <Label htmlFor="student">Student Name *</Label>
                  <Input
                    id="student"
                    placeholder="Enter student name"
                    value={metadata.student}
                    onChange={(e) => handleMetadataChange("student", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="college">College *</Label>
                  <Input
                    id="college"
                    placeholder="Enter college name"
                    value={metadata.college}
                    onChange={(e) => handleMetadataChange("college", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    placeholder="Enter department name"
                    value={metadata.department}
                    onChange={(e) => handleMetadataChange("department", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Input
                    id="academicYear"
                    placeholder="e.g., 2024/2025"
                    value={metadata.academicYear}
                    onChange={(e) => handleMetadataChange("academicYear", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester *</Label>
                  <Input
                    id="semester"
                    placeholder="e.g., Semester I"
                    value={metadata.semester}
                    onChange={(e) => handleMetadataChange("semester", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={metadata.date}
                    onChange={(e) => handleMetadataChange("date", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Scale Legend */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500">1</Badge>
                  <span>Very Poor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500">2</Badge>
                  <span>Poor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500">3</Badge>
                  <span>Fair</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500">4</Badge>
                  <span>Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">5</Badge>
                  <span>Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">N/A</Badge>
                  <span>Not Applicable</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Sections */}
          {Object.entries(evaluationSections).map(([key, section]) => {
            const Icon = section.icon
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
                    <Badge variant="outline">
                      Avg: {calculateSectionAverage(key)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.criteria.map((criterion, index) => {
                    const ratingKey = `${key}-${index}`
                    return (
                      <div key={index} className="space-y-3 p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <span className="text-sm font-medium text-muted-foreground mt-1">
                              {index + 1}.
                            </span>
                            <Label className="text-sm flex-1">{criterion}</Label>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`na-${ratingKey}`}
                                checked={notApplicable[ratingKey] || false}
                                onCheckedChange={(checked) => 
                                  handleNotApplicableChange(key, index, checked as boolean)
                                }
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
                  <h3 className="font-semibold">Overall Course Rating</h3>
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
              <CardTitle>ተጨማሪ አስተያየቶች</CardTitle>
              <CardDescription>
                ስለ ኮርሱ እና ስራ አስኪያጁ ዝርዝር አስተያየት ይስጡ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="general-comments">ስለ ኮርሱ የጠቅላላ አስተያየቶች</Label>
                <Textarea
                  id="general-comments"
                  placeholder="የጠቅላላ አስተያየቶችዎን እዚህ ይጻፉ..."
                  value={comments.general}
                  onChange={(e) => handleCommentChange("general", e.target.value)}
                  rows={4}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="strengths">በጥንካሬ የሚገለፁ እና አርአያነት ያላቸው ጎኖች</Label>
                <Textarea
                  id="strengths"
                  placeholder="መምህሩ ጥንካሬ የሚችሉ አካባቢዎችን ..."
                  value={comments.strengths}
                  onChange={(e) => handleCommentChange("strengths", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="improvements">መምህሩ እንዲያሻሽላቸው የሚገቡ</Label>
                <Textarea
                  id="improvements"
                  placeholder="መምህሩ ሊሻሻል የሚችሉ አካባቢዎችን ..."
                  value={comments.improvements}
                  onChange={(e) => handleCommentChange("improvements", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
