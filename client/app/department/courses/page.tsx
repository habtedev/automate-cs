"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mockCourses = [
  { id: 1, code: "CS101", name: "Introduction to Programming", title: "Introduction to Programming", department: "Computer Science", semester: "1st", credits: 3, type: "core", instructor: "Dr. John Smith", capacity: 50 },
  { id: 2, code: "CS102", name: "Data Structures", title: "Data Structures and Algorithms", department: "Computer Science", semester: "2nd", credits: 4, type: "core", instructor: "Dr. Sarah Johnson", capacity: 40 },
  { id: 3, code: "CS201", name: "Algorithms", title: "Design and Analysis of Algorithms", department: "Computer Science", semester: "3rd", credits: 3, type: "core", instructor: "Dr. Michael Brown", capacity: 35 },
  { id: 4, code: "CS202", name: "Database Systems", title: "Database Management Systems", department: "Computer Science", semester: "4th", credits: 3, type: "core", instructor: "Dr. Emily Davis", capacity: 45 },
  { id: 5, code: "CS301", name: "Operating Systems", title: "Operating Systems Concepts", department: "Computer Science", semester: "5th", credits: 4, type: "core", instructor: "Dr. Robert Wilson", capacity: 30 },
]

export default function CoursesPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            Manage department courses and curriculum.
          </p>
        </div>
        <Link href="/department/courses/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Capacity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-muted-foreground">{course.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>
                    <Badge variant={course.type === "core" ? "default" : "secondary"}>
                      {course.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.capacity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
