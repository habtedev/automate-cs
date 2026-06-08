"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const studentFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional().or(z.literal("")),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["male", "female", "other"]),
  dob: z.date({
    message: "Date of birth is required.",
  }),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  
  studentId: z.string().min(3, "Student ID is required"),
  department: z.string().min(2, "Department is required"),
  program: z.string().min(2, "Program is required"),
  year: z.string().min(1, "Year is required"),
  section: z.string().min(1, "Section is required"),
  enrollmentDate: z.date({
    message: "Enrollment date is required.",
  }),
  status: z.string().default("Active"),

  allowPasswordSet: z.boolean().default(true),
})

type StudentFormValues = z.infer<typeof studentFormSchema>

const steps = [
  { id: "personal", title: "Personal Info", description: "Basic student details" },
  { id: "academic", title: "Academic Info", description: "Program and enrollment" },
  { id: "system", title: "System Account", description: "Access credentials" },
  { id: "review", title: "Review", description: "Confirm and submit" },
]

export function AddStudentForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema) as any,
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      studentId: `CS${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      department: "Computer Science",
      program: "BSc Computer Science",
      year: "1st Year",
      section: "A",
      status: "Active",
      allowPasswordSet: true,
    },
    mode: "onChange",
  })

  // Simulated API call
  const createStudentMutation = useMutation({
    mutationFn: async (data: StudentFormValues) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return data
    },
    onSuccess: () => {
      toast.success("Student Created Successfully", {
        description: "The student has been added and requires password setup on first login.",
      })
      router.push("/department/students")
    },
    onError: () => {
      toast.error("Failed to create student", {
        description: "Please try again later.",
      })
    },
  })

  const processNext = async () => {
    let fieldsToValidate: any[] = []
    
    if (currentStep === 0) {
      fieldsToValidate = ["firstName", "lastName", "gender", "dob", "phone", "email", "address"]
    } else if (currentStep === 1) {
      fieldsToValidate = ["studentId", "department", "program", "year", "section", "enrollmentDate"]
    } else if (currentStep === 2) {
      fieldsToValidate = ["allowPasswordSet"]
    }

    const output = await form.trigger(fieldsToValidate as any, { shouldFocus: true })
    if (!output) return

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1)
    } else {
      createStudentMutation.mutate(form.getValues())
    }
  }

  const processPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Stepper Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center gap-4">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                currentStep > index
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentStep === index
                  ? "border-primary text-primary"
                  : "border-muted text-muted-foreground"
              )}
            >
              {currentStep > index ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-sm font-semibold",
                  currentStep >= index ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
              <span className="hidden text-xs text-muted-foreground md:block">
                {step.description}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "ml-auto hidden h-[2px] w-full max-w-[50px] flex-1 bg-muted md:block",
                  currentStep > index && "bg-primary"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* STEP 1: Personal Info */}
                  {currentStep === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter middle name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger render={
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              } />
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 234 567 890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Email Address (Optional)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="student@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Home Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 2: Academic Info */}
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student ID</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. CS2026001" {...field} />
                            </FormControl>
                            <FormDescription>Auto-generated or enter manually</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                                <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                                <SelectItem value="Information Systems">Information Systems</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="program"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Program</FormLabel>
                            <FormControl>
                              <Input placeholder="BSc Computer Science" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="enrollmentDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col mt-2.5">
                            <FormLabel>Enrollment Date</FormLabel>
                            <Popover>
                              <PopoverTrigger render={
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              } />
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}

                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1st Year">1st Year</SelectItem>
                                <SelectItem value="2nd Year">2nd Year</SelectItem>
                                <SelectItem value="3rd Year">3rd Year</SelectItem>
                                <SelectItem value="4th Year">4th Year</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="section"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A">Section A</SelectItem>
                                <SelectItem value="B">Section B</SelectItem>
                                <SelectItem value="C">Section C</SelectItem>
                                <SelectItem value="D">Section D</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 3: System Account */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                        <div className="grid gap-2">
                          <h3 className="font-semibold leading-none tracking-tight">Generated System Fields</h3>
                          <p className="text-sm text-muted-foreground">
                            The student's password will not be generated here. They must set it upon their first login.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                          <div className="space-y-1">
                            <Label className="text-muted-foreground">Username / Login ID</Label>
                            <p className="font-medium text-lg">{form.getValues("studentId")}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-muted-foreground">Password Status</Label>
                            <p className="font-medium text-lg flex items-center gap-2">
                              NOT SET <Badge variant="secondary">Pending Setup</Badge>
                            </p>
                          </div>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="allowPasswordSet"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Allow student to set password on first login
                              </FormLabel>
                              <FormDescription>
                                If checked, the student will be redirected to the password setup page automatically when they attempt to log in using their Student ID.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 4: Review Screen */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="p-6 bg-muted/50 border-b">
                          <h3 className="font-semibold text-lg">Student Summary Card</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Full Name</p>
                            <p className="text-base">{form.getValues("firstName")} {form.getValues("middleName")} {form.getValues("lastName")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Student ID</p>
                            <p className="text-base font-mono bg-muted inline-flex px-2 py-0.5 rounded">{form.getValues("studentId")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Department</p>
                            <p className="text-base">{form.getValues("department")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Program</p>
                            <p className="text-base">{form.getValues("program")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Academic Year</p>
                            <p className="text-base">{form.getValues("year")} - Section {form.getValues("section")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Account Status</p>
                            <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/10">Pending Password Setup</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            onClick={processPrev}
            disabled={currentStep === 0 || createStudentMutation.isPending}
          >
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => toast.info("Draft Saved", { description: "You can resume editing this later." })}
              disabled={createStudentMutation.isPending}
            >
              Save Draft
            </Button>
            <Button 
              onClick={processNext} 
              disabled={createStudentMutation.isPending}
            >
              {createStudentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentStep === steps.length - 1 ? "Confirm & Create Student" : "Continue"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
