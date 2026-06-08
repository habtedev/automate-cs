"use client"

import { useState, useRef } from "react"
import { Upload, FileSpreadsheet, AlertCircle, File as FileIcon, X } from "lucide-react"

import { AddTeacherForm } from "@/components/teachers/add-teacher-form"
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

export default function AddTeacherPage() {
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
            "first_name", "middle_name", "last_name", "gender", "dob", "email",
            "phone", "address", "employee_id", "department", "role", "degree",
            "specialization", "experience_years", "employment_type", "join_date"
          ]
          // Make sure at least the crucial ones exist, others can be blank
          const crucial = ["first_name", "last_name", "email", "employee_id", "department", "role", "degree", "specialization", "join_date"]
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
          { employee_id: "T001", first_name: "Mock", last_name: "Excel Data", department: "Computer Science", role: "Lecturer", degree: "MSc", specialization: "Software Engineering", join_date: "2024-01-15", email: "mock@example.com" },
          { employee_id: "T002", first_name: "Test", last_name: "User", department: "Computer Science", role: "Professor", degree: "PhD", specialization: "Artificial Intelligence", join_date: "2024-02-01", email: "test@example.com" },
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
        description: `Successfully created teachers from ${selectedFile?.name}.`,
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
          <h2 className="text-3xl font-bold tracking-tight">Add New Teacher</h2>
          <p className="text-muted-foreground">
            Create a faculty profile for the department management system.
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
              <DialogTitle>Bulk Import Teachers</DialogTitle>
              <DialogDescription>
                Upload an Excel (.xlsx) or CSV file containing teacher records.
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
                  Ensure your file has 16 columns matching the manual form: <code className="bg-muted px-1 py-0.5 rounded">first_name</code>, <code className="bg-muted px-1 py-0.5 rounded">last_name</code>, <code className="bg-muted px-1 py-0.5 rounded">email</code>, <code className="bg-muted px-1 py-0.5 rounded">employee_id</code>, <code className="bg-muted px-1 py-0.5 rounded">department</code>, <code className="bg-muted px-1 py-0.5 rounded">role</code>, <code className="bg-muted px-1 py-0.5 rounded">degree</code>, <code className="bg-muted px-1 py-0.5 rounded">specialization</code>, <code className="bg-muted px-1 py-0.5 rounded">join_date</code>, etc.
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
                {isUploading ? "Creating Teachers..." : "Confirm & Create All Teachers"}
              </Button>
            </div>
          </div>
          <div className="rounded-md border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="whitespace-nowrap">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Middle Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Degree</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Experience Years</TableHead>
                    <TableHead>Employment Type</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.first_name}</TableCell>
                      <TableCell>{row.middle_name}</TableCell>
                      <TableCell>{row.last_name}</TableCell>
                      <TableCell className="capitalize">{row.gender}</TableCell>
                      <TableCell>{row.dob}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell className="font-medium">{row.employee_id}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell>{row.degree}</TableCell>
                      <TableCell>{row.specialization}</TableCell>
                      <TableCell>{row.experience_years}</TableCell>
                      <TableCell className="capitalize">{row.employment_type}</TableCell>
                      <TableCell>{row.join_date}</TableCell>
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
        <AddTeacherForm />
      )}
    </div>
  )
}
