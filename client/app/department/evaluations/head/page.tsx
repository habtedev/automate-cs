"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, FileText, X, AlertCircle, Plus, Trash2, Table, Eye } from "lucide-react"
import { toast } from "sonner"
import { InstructorEvaluationForm } from "@/components/evaluations/instructor-evaluation-form"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HeadEvaluationPage() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [showEvaluationForm, setShowEvaluationForm] = useState(false)
  const [templateTitle, setTemplateTitle] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [evaluationData, setEvaluationData] = useState<any>(null)
  const [csvData, setCsvData] = useState<any[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'text/csv', 'application/vnd.ms-excel']
      
      if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
        toast.error("Invalid file type", {
          description: "Please upload PDF, DOCX, CSV, or image files only."
        })
        return
      }
      
      setSelectedFile(file)
      setShowEvaluationForm(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
    
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
        localStorage.setItem('headCsvData', JSON.stringify(data))
        
        toast.success("CSV uploaded successfully", {
          description: `Loaded ${data.length} evaluation criteria. Redirecting to preview...`
        })
        
        // Redirect to preview page
        setTimeout(() => {
          router.push('/department/evaluations/preview')
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
          router.push('/department/evaluations/preview')
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

  const handleCreateTemplate = () => {
    if (!templateTitle || !templateDescription || !selectedDepartment) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields."
      })
      return
    }
    
    toast.success("Template created successfully", {
      description: "Evaluation template has been saved and is now active."
    })
    
    // Reset form
    setSelectedFile(null)
    setTemplateTitle("")
    setTemplateDescription("")
    setSelectedDepartment("")
    setShowEvaluationForm(false)
  }

  const handleEvaluationDataChange = (data: any) => {
    setEvaluationData(data)
  }

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Head Evaluation</h2>
        <p className="text-muted-foreground">
          Create evaluation templates and manage department-wide assessments for instructors.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Evaluation Template</CardTitle>
            <CardDescription>
              Upload a PDF, DOCX, or image file containing evaluation questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.csv"
                onChange={handleFileChange}
              />
              {!selectedFile ? (
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOCX, CSV, or Image (Max 10MB)
                  </p>
                </label>
              ) : (
                <div className="space-y-4">
                  <FileText className="h-12 w-12 mx-auto text-primary" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{uploadProgress}% uploaded</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove File
                  </Button>
                </div>
              )}
            </div>
            
            {selectedFile && !isUploading && (
              <Button onClick={handleUpload} className="w-full">
                Upload & Process Document
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Template Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
            <CardDescription>
              Configure the evaluation template settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-title">Template Title *</Label>
              <Input
                id="template-title"
                placeholder="e.g., Instructor Evaluation 2024"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-description">Description *</Label>
              <Textarea
                id="template-description"
                placeholder="Describe the purpose and scope of this evaluation template"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="software-engineering">Software Engineering</SelectItem>
                  <SelectItem value="information-systems">Information Systems</SelectItem>
                  <SelectItem value="information-technology">Information Technology</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Evaluation Form */}
      {showEvaluationForm && (
        <InstructorEvaluationForm 
          data={evaluationData}
          onDataChange={handleEvaluationDataChange}
          csvData={csvData}
        />
      )}
    </div>
  )
}
