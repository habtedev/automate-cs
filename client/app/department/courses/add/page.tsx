"use client"

import { useState, useRef } from "react"
import { Upload, FileSpreadsheet, AlertCircle, File as FileIcon, X } from "lucide-react"

import { AddCourseForm } from "@/components/courses/add-course-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

export default function AddCoursePage() {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setPreviewData(null)
      setParseError(null)
    }
  }

  const handlePreview = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setParseError(null)

    if (selectedFile.name.endsWith(".csv")) {
      try {
        const text = await selectedFile.text()
        const lines = text.split("\n").filter((line) => line.trim() !== "")
        if (lines.length > 0) {
          const headers = lines[0].toLowerCase().split(",").map((h) => h.trim().replace(/['"]/g, ""))
          const required = [
            "course_name", "course_code", "course_title", "department", "semester",
            "credit_hours", "ects", "course_type", "prerequisites",
            "description", "learning_outcomes"
          ]
          // Make sure at least the crucial ones exist, others can be blank
          const crucial = ["course_name", "course_code", "course_title", "department", "semester", "credit_hours", "course_type", "description", "learning_outcomes"]
          const hasCrucial = crucial.every((req) => headers.includes(req))

          if (!hasCrucial) {
            setIsUploading(false)
            setParseError(`Invalid format. Missing crucial columns. Please check the template.`)
            return
          }

          const parsed = lines.slice(1).map((line) => {
            const values = line.split(",")
            return headers.reduce((acc, header, idx) => {
              if (required.includes(header)) {
                acc[header] = values[idx]?.trim().replace(/['"]/g, "") || ""
              }
              return acc
            }, {} as Record<string, string>)
          })

          setTimeout(() => {
            setIsUploading(false)
            setPreviewData(parsed)
            setIsOpen(false)
          }, 600)
        } else {
          setIsUploading(false)
          setParseError("The CSV file is empty.")
        }
      } catch (err) {
        setIsUploading(false)
        setParseError("Failed to read the file.")
      }
    } else {
      // Mock for non-CSV files to allow demonstrating the UI
      setTimeout(() => {
        setIsUploading(false)
        setPreviewData([
          { course_code: "CS401", course_name: "Machine Learning", course_title: "Introduction to Machine Learning", department: "Computer Science", semester: "7th", credit_hours: "3", course_type: "elective", instructor: "Dr. AI Expert", description: "Introduction to ML algorithms", learning_outcomes: "Understand ML concepts" },
          { course_code: "CS402", course_name: "AI Systems", course_title: "Artificial Intelligence Systems", department: "Computer Science", semester: "8th", credit_hours: "4", course_type: "core", instructor: "Dr. Robotics", description: "Advanced AI concepts", learning_outcomes: "Build AI systems" },
        ])
        setIsOpen(false)
      }, 1000)
    }
  }

  const handleConfirm = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setSelectedFile(null)
      setPreviewData(null)
      setIsOpen(false)
      toast.success("Import Successful", {
        description: `Successfully created courses from ${selectedFile?.name}.`,
      })
    }, 1500)
  }

  const resetModal = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSelectedFile(null)
      setPreviewData(null)
      setParseError(null)
    }
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Course</h2>
          <p className="text-muted-foreground">
            Create a new course for the department management system.
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={resetModal}>
          <DialogTrigger render={
            <Button variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Bulk Import (CSV/Excel)
            </Button>
          } />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bulk Import Courses</DialogTitle>
              <DialogDescription>
                Upload an Excel (.xlsx) or CSV file containing course records.
              </DialogDescription>
            </DialogHeader>
            <div 
              className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-10 mt-4 bg-muted/20 transition-colors hover:bg-muted/50 cursor-pointer"
              onClick={() => !selectedFile && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv, .xlsx, .xls, .doc, .docx" 
                onChange={handleFileChange}
              />
              
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <FileIcon className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                      setParseError(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                  >
                    <X className="h-4 w-4 mr-2" /> Remove File
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">XLSX, CSV, DOC (Max 10MB)</p>
                </>
              )}
            </div>
            
            {parseError ? (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Format Error</AlertTitle>
                <AlertDescription className="text-xs">{parseError}</AlertDescription>
              </Alert>
            ) : (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Format Requirements</AlertTitle>
                <AlertDescription className="text-xs">
                  Ensure your file has 11 columns matching the manual form: <code className="bg-muted px-1 py-0.5 rounded">course_name</code>, <code className="bg-muted px-1 py-0.5 rounded">course_code</code>, <code className="bg-muted px-1 py-0.5 rounded">course_title</code>, <code className="bg-muted px-1 py-0.5 rounded">department</code>, <code className="bg-muted px-1 py-0.5 rounded">semester</code>, <code className="bg-muted px-1 py-0.5 rounded">credit_hours</code>, <code className="bg-muted px-1 py-0.5 rounded">course_type</code>, <code className="bg-muted px-1 py-0.5 rounded">prerequisites</code>, <code className="bg-muted px-1 py-0.5 rounded">description</code>, <code className="bg-muted px-1 py-0.5 rounded">learning_outcomes</code>, etc.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end mt-4">
              <Button onClick={handlePreview} disabled={isUploading || !selectedFile}>
                {isUploading ? "Checking format..." : "Preview Data"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {previewData ? (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Data Preview</h3>
              <p className="text-sm text-muted-foreground">Please review the imported records before finalizing.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewData(null)} disabled={isUploading}>
                Cancel Import
              </Button>
              <Button onClick={handleConfirm} disabled={isUploading}>
                {isUploading ? "Creating Courses..." : "Confirm & Create All Courses"}
              </Button>
            </div>
          </div>
          <div className="rounded-md border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="whitespace-nowrap">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Credit Hours</TableHead>
                    <TableHead>ECTS</TableHead>
                    <TableHead>Course Type</TableHead>
                    <TableHead>Prerequisites</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Learning Outcomes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.course_code}</TableCell>
                      <TableCell>{row.course_name}</TableCell>
                      <TableCell>{row.course_title}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.semester}</TableCell>
                      <TableCell>{row.credit_hours}</TableCell>
                      <TableCell>{row.ects}</TableCell>
                      <TableCell className="capitalize">{row.course_type}</TableCell>
                      <TableCell>{row.prerequisites}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.learning_outcomes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center italic">
            Found {previewData.length} records ready for import.
          </p>
        </div>
      ) : (
        <AddCourseForm />
      )}
    </div>
  )
}
