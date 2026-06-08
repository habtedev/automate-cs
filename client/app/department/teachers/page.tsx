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

const teachers = [
  {
    id: "EMP2026101",
    name: "Dr. Robert Smith",
    email: "robert.smith@example.com",
    department: "Computer Science",
    role: "Professor",
    degree: "PhD",
    status: "Active",
  },
  {
    id: "EMP2026102",
    name: "Abebe Kebede",
    email: "abebe@example.com",
    department: "Computer Science",
    role: "Lecturer",
    degree: "MSc",
    status: "Active",
  },
  {
    id: "EMP2026103",
    name: "Dr. Lisa Wong",
    email: "lisa.wong@example.com",
    department: "Software Engineering",
    role: "Assistant Professor",
    degree: "PhD",
    status: "On Leave",
  },
]

export default function TeachersPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
          <p className="text-muted-foreground">
            Manage faculty members and instructors in the department.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/department/teachers/add" className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> Add Teacher
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search teachers..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Role</TableHead>
              <TableHead className="hidden lg:table-cell">Degree</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No teachers found.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{teacher.name}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline-block">
                        {teacher.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{teacher.department}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teacher.role}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teacher.degree}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        teacher.status === "Active"
                          ? "default"
                          : teacher.status === "On Leave"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {teacher.status}
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(teacher.id)}>
                          Copy Employee ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign Courses</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove Teacher</DropdownMenuItem>
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
