"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RatingScale } from "@/components/evaluations/rating-scale"
import { GraduationCap, Search, BookOpen, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const mockCourses = [
  { id: 1, code: "CS101", name: "Introduction to Programming", instructor: "Dr. John Smith", department: "Computer Science" },
  { id: 2, code: "CS102", name: "Data Structures", instructor: "Dr. Sarah Johnson", department: "Computer Science" },
  { id: 3, code: "CS201", name: "Algorithms", instructor: "Dr. Michael Brown", department: "Computer Science" },
  { id: 4, code: "CS202", name: "Database Systems", instructor: "Dr. Emily Davis", department: "Software Engineering" },
]

const evaluationQuestions = [
  "Course content was well-organized and structured",
  "Instructor explained concepts clearly",
  "Course materials were helpful and relevant",
  "Assignments were fair and contributed to learning",
  "Instructor was available for questions and help",
  "The pace of the course was appropriate",
  "I learned a lot from this course",
  "I would recommend this course to others",
]

export default function StudentEvaluationPage() {
  const router = useRouter()
  const [selectedCourse, setSelectedCourse] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [csvData, setCsvData] = useState<any[]>([])
  const [showEvaluationForm, setShowEvaluationForm] = useState(false)

  const handleRatingChange = (questionIndex: number, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [questionIndex]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/csv',
      'application/vnd.ms-excel',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ]

    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      toast.error("Invalid file type", {
        description: "Please upload a PDF, DOCX, CSV, or image file."
      })
      return
    }

    setSelectedFile(file)
    setUploadProgress(0)
  }

  const handleUpload = () => {
    if (!selectedFile) return

    setIsUploading(true)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 100)

    // Process file
    if (selectedFile.name.endsWith('.csv') || selectedFile.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split('\n')
        
        // Parse CSV with better handling of quoted values
        const parseCSVLine = (line: string) => {
          const result: string[] = []
          let current = ''
          let inQuotes = false
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i]
            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim())
              current = ''
            } else {
              current += char
            }
          }
          result.push(current.trim())
          return result
        }
        
        const headers = parseCSVLine(lines[0])
        const data = lines.slice(1).map(line => {
          const values = parseCSVLine(line)
          const row: any = {}
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || ''
          })
          return row
        }).filter(row => row['No'] && row['No'] !== '')
        
        setCsvData(data)
        setIsUploading(false)
        
        // Store CSV data in localStorage for preview page
        localStorage.setItem('studentCsvData', JSON.stringify(data))
        
        toast.success("CSV uploaded successfully", {
          description: `Loaded ${data.length} evaluation criteria. Redirecting to preview...`
        })
        
        // Redirect to preview page
        setTimeout(() => {
          router.push('/department/evaluations/student/preview')
        }, 1000)
      }
      reader.readAsText(selectedFile)
    } else {
      // For PDF, DOCX, images
      setTimeout(() => {
        setIsUploading(false)
        
        toast.success("File uploaded successfully", {
          description: "Document has been processed. Redirecting to preview..."
        })
        
        // Redirect to preview page
        setTimeout(() => {
          router.push('/department/evaluations/student/preview')
        }, 1000)
      }, 2000)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    setShowEvaluationForm(false)
    setCsvData([])
  }

  const handleSubmit = () => {
    if (!selectedCourse) {
      toast.error("Please select a course", {
        description: "You must select a course to evaluate."
      })
      return
    }

    const answeredQuestions = Object.keys(ratings).length
    if (answeredQuestions < evaluationQuestions.length) {
      toast.error("Incomplete evaluation", {
        description: `Please answer all ${evaluationQuestions.length} questions before submitting.`
      })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Evaluation submitted successfully", {
        description: "Thank you for your feedback."
      })
      setRatings({})
      setFeedback("")
      setSelectedCourse("")
    }, 1500)
  }

  const calculateAverage = () => {
    const values = Object.values(ratings)
    if (values.length === 0) return 0
    const sum = values.reduce((a, b) => a + b, 0)
    return (sum / values.length).toFixed(1)
  }

  const filteredCourses = mockCourses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedCourseData = mockCourses.find((c) => c.id.toString() === selectedCourse)

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Evaluation</h2>
        <p className="text-muted-foreground">
          Provide feedback on courses and instructors to help improve the learning experience.
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Evaluation Template</CardTitle>
          <CardDescription>
            Upload a PDF, DOCX, CSV, or image file containing evaluation questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedFile ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <Input
                type="file"
                accept=".pdf,.docx,.doc,.csv,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="max-w-xs mx-auto"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: PDF, DOCX, CSV, JPG, PNG
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <Button onClick={handleUpload} className="w-full">
                  Upload and Process
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Course</CardTitle>
            <CardDescription>
              Choose the course you want to evaluate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCourse === course.id.toString()
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedCourse(course.id.toString())}
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{course.code}</p>
                        <Badge variant="outline" className="text-xs">
                          {course.department}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{course.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Instructor: {course.instructor}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Course Evaluation</CardTitle>
                <CardDescription>
                  Rate each criterion on a scale of 1-5
                </CardDescription>
              </div>
              {selectedCourse && (
                <Badge variant="outline">
                  Average: {calculateAverage()}/5
                </Badge>
              )}
            </div>
            {selectedCourseData && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">{selectedCourseData.code} - {selectedCourseData.name}</p>
                <p className="text-xs text-muted-foreground">Instructor: {selectedCourseData.instructor}</p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedCourse ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Select a course from the list to begin evaluation
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {evaluationQuestions.map((question, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <Label className="text-base">
                          {index + 1}. {question}
                        </Label>
                        {ratings[index] && (
                          <Badge variant="secondary">{ratings[index]}/5</Badge>
                        )}
                      </div>
                      <RatingScale
                        value={ratings[index]}
                        onChange={(value) => handleRatingChange(index, value)}
                        maxRating={5}
                        showLabels
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Label htmlFor="feedback">Additional Comments (Optional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share any additional feedback or suggestions..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRatings({})
                      setFeedback("")
                      setSelectedCourse("")
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
