"use client"

import Link from "next/link"
import { Plus, Search, MoreHorizontal } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const students = [
  {
    id: "CS2026001",
    name: "Habtamu Amare",
    email: "habtamu@example.com",
    department: "Computer Science",
    year: "4th Year",
    section: "A",
    status: "Active",
  },
  {
    id: "CS2026002",
    name: "Sarah Miller",
    email: "sarah@example.com",
    department: "Computer Science",
    year: "3rd Year",
    section: "B",
    status: "Active",
  },
  {
    id: "CS2026003",
    name: "James Wilson",
    email: "james@example.com",
    department: "Software Engineering",
    year: "2nd Year",
    section: "A",
    status: "Pending Password Setup",
  },
  {
    id: "CS2026004",
    name: "Elena Rodriguez",
    email: "elena@example.com",
    department: "Information Systems",
    year: "1st Year",
    section: "C",
    status: "Inactive",
  },
]

export default function StudentsPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage all students in the department.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/department/students/add" className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Year & Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{student.name}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline-block">
                        {student.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{student.department}</TableCell>
                  <TableCell className="hidden lg:table-cell">{student.year} - {student.section}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "Active"
                          ? "default"
                          : student.status === "Pending Password Setup"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.id)}>
                          Copy Student ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Student</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
