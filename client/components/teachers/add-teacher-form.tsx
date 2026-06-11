"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronRight, ChevronLeft, Building, GraduationCap, Briefcase, UserRound } from "lucide-react"

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

const teacherFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional().or(z.literal("")),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["male", "female", "other"]),
  dob: z.date({
    message: "Date of birth is required.",
  }),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email address"),
  address: z.string().optional().or(z.literal("")),
  
  degree: z.string().min(2, "Degree qualification is required"),
  specialization: z.string().min(2, "Specialization/Field of Study is required"),
  experienceYears: z.coerce.number().min(0, "Experience years cannot be negative"),

  employeeId: z.string().min(3, "Employee ID is required"),
  department: z.string().min(2, "Department is required"),
  role: z.string().min(2, "Academic rank/role is required"),
  employmentType: z.enum(["full-time", "part-time", "visiting"]),
  joinDate: z.date({
    message: "Join date is required.",
  }),
  status: z.string().default("Active"),

  allowPasswordSet: z.boolean().default(true),
})

type TeacherFormValues = z.infer<typeof teacherFormSchema>

const steps = [
  { id: "personal", title: "Personal Info", description: "Basic contact details", icon: UserRound },
  { id: "academic", title: "Qualifications", description: "Degrees and experience", icon: GraduationCap },
  { id: "employment", title: "Employment", description: "Role and department", icon: Briefcase },
  { id: "system", title: "System Account", description: "Access credentials", icon: Building },
  { id: "review", title: "Review", description: "Confirm and submit", icon: Check },
]

export function AddTeacherForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema) as any,
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      degree: "PhD",
      specialization: "",
      experienceYears: 0,
      employeeId: `EMP${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      department: "Computer Science",
      role: "Assistant Professor",
      employmentType: "full-time",
      status: "Active",
      allowPasswordSet: true,
    },
    mode: "onChange",
  })

  // Simulated API call
  const createTeacherMutation = useMutation({
    mutationFn: async (data: TeacherFormValues) => {
      return new Promise((resolve) => setTimeout(() => resolve({ ...data, id: "1" }), 1500))
    },
    onSuccess: () => {
      toast.success("Teacher created successfully", {
        description: "The teacher record has been created without a password. They will be prompted to set one upon their first login.",
      })
      router.push("/department/teachers")
    },
    onError: (error) => {
      toast.error("Failed to create teacher", {
        description: error.message || "An unexpected error occurred. Please try again.",
      })
    },
  })

  const processNext = async () => {
    let fieldsToValidate: (keyof TeacherFormValues)[] = []

    if (currentStep === 0) {
      fieldsToValidate = ["firstName", "lastName", "gender", "dob", "email"]
    } else if (currentStep === 1) {
      fieldsToValidate = ["degree", "specialization", "experienceYears"]
    } else if (currentStep === 2) {
      fieldsToValidate = ["employeeId", "department", "role", "employmentType", "joinDate"]
    }

    const isValid = await form.trigger(fieldsToValidate)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const processPrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const onSubmit = (data: TeacherFormValues) => {
    createTeacherMutation.mutate(data)
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
                  {/* STEP 1: PERSONAL INFO */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
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
                              <FormLabel>Middle Name</FormLabel>
                              <FormControl>
                                <Input placeholder="H." {...field} />
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
                              <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
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
                            <FormItem className="flex flex-col mt-2.5">
                              <FormLabel>Date of Birth <span className="text-destructive">*</span></FormLabel>
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john.doe@university.edu" {...field} />
                              </FormControl>
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
                                <Input placeholder="+1 (555) 000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Residential Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Education St, City, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 2: PROFESSIONAL QUALIFICATIONS */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="degree"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Highest Degree <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select degree" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="BSc">BSc / BA</SelectItem>
                                  <SelectItem value="MSc">MSc / MA</SelectItem>
                                  <SelectItem value="PhD">PhD / Doctorate</SelectItem>
                                  <SelectItem value="PostDoc">Postdoctoral</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="experienceYears"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years of Experience <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input type="number" min={0} placeholder="e.g. 5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field of Specialization <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Artificial Intelligence, Data Science" {...field} />
                            </FormControl>
                            <FormDescription>
                              The primary academic focus or expertise of the teacher.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 3: EMPLOYMENT DETAILS */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="employeeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employee ID <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="EMP-2026101" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Academic Rank / Role <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select rank" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Lab Assistant">Lab Assistant</SelectItem>
                                  <SelectItem value="Lecturer">Lecturer</SelectItem>
                                  <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                                  <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                                  <SelectItem value="Professor">Professor</SelectItem>
                                  <SelectItem value="Department Head">Department Head</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="employmentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employment Type <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="full-time">Full-Time</SelectItem>
                                  <SelectItem value="part-time">Part-Time</SelectItem>
                                  <SelectItem value="visiting">Visiting Faculty</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="joinDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col mt-2.5">
                            <FormLabel>Join Date <span className="text-destructive">*</span></FormLabel>
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
                            <FormDescription>The date the teacher officially joins the department.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 4: SYSTEM ACCOUNT & PERMISSIONS */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="rounded-lg border p-4 shadow-sm bg-muted/20">
                        <div className="flex items-start space-x-4">
                          <div className="mt-1 bg-primary/10 p-2 rounded-full">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Automated System Account
                            </p>
                            <p className="text-sm text-muted-foreground">
                              The system will automatically generate a profile linked to this teacher. No passwords will be sent via email.
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
                              <FormLabel>Require Password Setup</FormLabel>
                              <FormDescription>
                                Mark teacher as <code>password_set = false</code> in the database. They will set their password upon their first login attempt using their Employee ID.
                              </FormDescription>
                            </div>
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
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">Teacher Identity</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Full Name</p>
                              <p className="text-sm text-muted-foreground">
                                {form.getValues("firstName")} {form.getValues("middleName")} {form.getValues("lastName")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Contact Details</p>
                              <p className="text-sm text-muted-foreground">
                                {form.getValues("email")} <br />
                                {form.getValues("phone") || "No phone provided"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="h-px w-full bg-border" />

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">Qualifications & Experience</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Academic Degree</p>
                              <p className="text-sm text-muted-foreground">
                                <Badge variant="outline">{form.getValues("degree")}</Badge> in {form.getValues("specialization")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Experience</p>
                              <p className="text-sm text-muted-foreground">
                                {form.getValues("experienceYears")} Years
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="h-px w-full bg-border" />

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">Employment Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Department & Role</p>
                              <p className="text-sm text-muted-foreground">
                                {form.getValues("department")} — {form.getValues("role")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Employee Details</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                ID: {form.getValues("employeeId")} <br />
                                {form.getValues("employmentType").replace("-", " ")}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-px w-full bg-border" />

                        <div className="bg-primary/5 p-4 rounded-md flex items-center justify-between border border-primary/20">
                          <div>
                            <p className="text-sm font-medium text-primary">System Access</p>
                            <p className="text-xs text-muted-foreground mt-1">Pending first-time password setup</p>
                          </div>
                          <Badge variant={form.getValues("allowPasswordSet") ? "default" : "secondary"}>
                            {form.getValues("allowPasswordSet") ? "Setup Required" : "No Access"}
                          </Badge>
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
                  disabled={currentStep === 0 || createTeacherMutation.isPending}
                  className="w-28"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={processNext}
                    className="w-28"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createTeacherMutation.isPending}
                    className="w-auto gap-2"
                  >
                    {createTeacherMutation.isPending ? "Creating Teacher..." : "Confirm & Create Teacher"}
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
