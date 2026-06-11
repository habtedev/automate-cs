"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronRight, ChevronLeft, BookOpen, GraduationCap, Users, FileText } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const courseFormSchema = z.object({
  // Basic Course Information
  courseName: z.string().min(2, "Course name is required"),
  courseCode: z.string().min(2, "Course code is required"),
  courseTitle: z.string().min(2, "Course title is required"),
  department: z.string().min(2, "Department is required"),
  semester: z.string().min(1, "Semester is required"),
  
  // Academic Details
  creditHours: z.coerce.number().min(1, "Credit hours must be at least 1").max(6, "Credit hours cannot exceed 6"),
  ects: z.coerce.number().min(0, "ECTS cannot be negative").optional(),
  courseType: z.enum(["core", "elective", "general"]),
  
  // Teaching Setup
  prerequisites: z.array(z.string()).optional(),
  
  // Description Section
  description: z.string().min(10, "Description must be at least 10 characters"),
  learningOutcomes: z.string().min(10, "Learning outcomes must be at least 10 characters"),
})

type CourseFormValues = z.infer<typeof courseFormSchema>

const steps = [
  { id: "basic", title: "Basic Info", description: "Course identification", icon: BookOpen },
  { id: "academic", title: "Academic Details", description: "Credits and type", icon: GraduationCap },
  { id: "teaching", title: "Teaching Setup", description: "Instructor and capacity", icon: Users },
  { id: "description", title: "Description", description: "Course details", icon: FileText },
  { id: "review", title: "Review", description: "Confirm and submit", icon: Check },
]

const availablePrerequisites = [
  "CS101 - Introduction to Programming",
  "CS102 - Data Structures",
  "CS201 - Algorithms",
  "CS202 - Database Systems",
  "CS301 - Operating Systems",
  "CS302 - Computer Networks",
  "CS303 - Software Engineering",
  "CS401 - Machine Learning",
  "CS402 - Artificial Intelligence",
]

export function AddCourseForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema) as any,
    defaultValues: {
      courseName: "",
      courseCode: "",
      courseTitle: "",
      department: "Computer Science",
      semester: "1st",
      creditHours: 3,
      ects: 6,
      courseType: "core",
      prerequisites: [],
      description: "",
      learningOutcomes: "",
    },
    mode: "onChange",
  })

  // Simulated API call
  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      return new Promise((resolve) => setTimeout(() => resolve({ ...data, id: "1" }), 1500))
    },
    onSuccess: () => {
      toast.success("Course created successfully", {
        description: "The course has been added to the department.",
      })
      router.push("/department/courses")
    },
    onError: (error) => {
      toast.error("Failed to create course", {
        description: error.message || "An unexpected error occurred. Please try again.",
      })
    },
  })

  const processNext = async () => {
    let fieldsToValidate: (keyof CourseFormValues)[] = []

    if (currentStep === 0) {
      fieldsToValidate = ["courseName", "courseCode", "courseTitle", "department", "semester"]
    } else if (currentStep === 1) {
      fieldsToValidate = ["creditHours", "courseType"]
    } else if (currentStep === 2) {
      fieldsToValidate = []
    } else if (currentStep === 3) {
      fieldsToValidate = ["description", "learningOutcomes"]
    }

    const isValid = await form.trigger(fieldsToValidate)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const processPrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const onSubmit = (data: CourseFormValues) => {
    createCourseMutation.mutate(data)
  }

  const handlePrerequisiteToggle = (prerequisite: string) => {
    const currentPrerequisites = form.getValues("prerequisites") || []
    if (currentPrerequisites.includes(prerequisite)) {
      form.setValue("prerequisites", currentPrerequisites.filter((p) => p !== prerequisite))
    } else {
      form.setValue("prerequisites", [...currentPrerequisites, prerequisite])
    }
  }

  return (
    <div className="w-full max-w-4xl rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-muted/40 p-6 md:border-r">
          <nav aria-label="Progress">
            <ol role="list" className="overflow-hidden md:space-y-6 flex md:flex-col justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <li key={step.id} className="relative hidden md:block">
                    <div className="group flex items-center">
                      <span className="flex items-center space-x-3">
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                            currentStep > index
                              ? "bg-primary border-primary"
                              : currentStep === index
                              ? "border-primary text-primary"
                              : "border-muted-foreground/30 text-muted-foreground/50"
                          )}
                        >
                          {currentStep > index ? (
                            <Check className="h-4 w-4 text-primary-foreground" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </span>
                        <span className="flex flex-col">
                          <span
                            className={cn(
                              "text-sm font-medium transition-colors",
                              currentStep >= index ? "text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {step.title}
                          </span>
                          <span className="text-xs text-muted-foreground hidden lg:block">{step.description}</span>
                        </span>
                      </span>
                    </div>
                  </li>
                )
              })}
              
              {/* Mobile Stepper View */}
              <div className="flex md:hidden items-center justify-between w-full">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm font-bold">{steps[currentStep].title}</span>
              </div>
            </ol>
          </nav>
        </div>

        {/* Form Content Area */}
        <div className="flex-1 p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* STEP 1: BASIC COURSE INFORMATION */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="courseName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Name <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Data Structures" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="courseCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Code <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="CS201" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="courseTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Title / Full Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Data Structures and Algorithms" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                                  <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                                  <SelectItem value="Information Systems">Information Systems</SelectItem>
                                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                                  <SelectItem value="Data Science">Data Science</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>Auto-filled from department context</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="semester"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Semester <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select semester" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1st">1st Semester</SelectItem>
                                  <SelectItem value="2nd">2nd Semester</SelectItem>
                                  <SelectItem value="3rd">3rd Semester</SelectItem>
                                  <SelectItem value="4th">4th Semester</SelectItem>
                                  <SelectItem value="5th">5th Semester</SelectItem>
                                  <SelectItem value="6th">6th Semester</SelectItem>
                                  <SelectItem value="7th">7th Semester</SelectItem>
                                  <SelectItem value="8th">8th Semester</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: ACADEMIC DETAILS */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="creditHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Credit Hours <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input type="number" min={1} max={6} placeholder="3" {...field} />
                              </FormControl>
                              <FormDescription>1-6 hours</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ects"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ECTS</FormLabel>
                              <FormControl>
                                <Input type="number" min={0} placeholder="6" {...field} />
                              </FormControl>
                              <FormDescription>European Credit Transfer</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="courseType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Type <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="core">Core Course</SelectItem>
                                  <SelectItem value="elective">Elective Course</SelectItem>
                                  <SelectItem value="general">General Course</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: TEACHING SETUP */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="prerequisites"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Prerequisite Courses</FormLabel>
                              <FormDescription>Select courses that students must complete before this course</FormDescription>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {availablePrerequisites.map((prerequisite) => {
                                const isSelected = (form.getValues("prerequisites") || []).includes(prerequisite)
                                return (
                                  <div
                                    key={prerequisite}
                                    className={cn(
                                      "flex items-center space-x-2 border rounded-md p-3 cursor-pointer transition-colors",
                                      isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                                    )}
                                    onClick={() => handlePrerequisiteToggle(prerequisite)}
                                  >
                                    <Checkbox
                                      id={prerequisite}
                                      checked={isSelected}
                                      onCheckedChange={() => handlePrerequisiteToggle(prerequisite)}
                                    />
                                    <label
                                      htmlFor={prerequisite}
                                      className="text-sm font-medium cursor-pointer flex-1"
                                    >
                                      {prerequisite}
                                    </label>
                                  </div>
                                )
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 4: DESCRIPTION SECTION */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Description <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide a detailed description of the course content, objectives, and scope..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="learningOutcomes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Learning Outcomes <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List the key learning outcomes students will achieve after completing this course..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              What students will be able to do after completing this course
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 5: REVIEW */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="rounded-lg border bg-muted/20 p-6 space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">Course Identification</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Course Code & Name</p>
                              <p className="text-sm text-muted-foreground">
                                {form.getValues("courseCode")} - {form.getValues("courseName")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Full Title</p>
                              <p className="text-sm text-muted-foreground">
                                {form.getValues("courseTitle")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="h-px w-full bg-border" />

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">Academic Information</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm font-medium">Credit Hours</p>
                              <p className="text-sm text-muted-foreground">
                                {form.getValues("creditHours")} Hours
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">ECTS</p>
                              <p className="text-sm text-muted-foreground">
                                {form.getValues("ects") || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Course Type</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                <Badge variant="outline">{form.getValues("courseType")}</Badge>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="h-px w-full bg-border" />

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">Teaching Setup</h4>
                          <div>
                            <p className="text-sm font-medium">Prerequisites</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(form.getValues("prerequisites") || []).length > 0 ? (
                                (form.getValues("prerequisites") || []).map((prereq, idx) => (
                                  <Badge key={idx} variant="secondary">{prereq}</Badge>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No prerequisites</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="h-px w-full bg-border" />

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">Department & Semester</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Department</p>
                              <p className="text-sm text-muted-foreground">
                                {form.getValues("department")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Semester</p>
                              <p className="text-sm text-muted-foreground">
                                {form.getValues("semester")} Semester
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex w-full items-center justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={processPrevious}
                  disabled={currentStep === 0 || createCourseMutation.isPending}
                  className="w-28"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={processNext}
                    disabled={createCourseMutation.isPending}
                    className="w-28"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createCourseMutation.isPending}
                    className="w-40"
                  >
                    {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
