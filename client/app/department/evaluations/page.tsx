"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Crown, User, GraduationCap, BarChart3, FileText, Users } from "lucide-react"

export default function EvaluationsPage() {
  return (
    <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Evaluations</h2>
        <p className="text-muted-foreground">
          Manage and conduct evaluations for instructors, courses, and departments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/department/evaluations/head">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Crown className="h-8 w-8 text-primary" />
                <Badge variant="secondary">Admin</Badge>
              </div>
              <CardTitle className="mt-4">Head Evaluation</CardTitle>
              <CardDescription>
                Create evaluation templates and manage department-wide assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Upload templates (PDF, DOCX)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Evaluate instructors</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/department/evaluations/teacher">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <User className="h-8 w-8 text-blue-600" />
                <Badge variant="outline">Faculty</Badge>
              </div>
              <CardTitle className="mt-4">Teacher Evaluation</CardTitle>
              <CardDescription>
                Peer evaluations and self-assessment for faculty members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Peer reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Self-assessment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/department/evaluations/student">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <GraduationCap className="h-8 w-8 text-green-600" />
                <Badge variant="outline">Student</Badge>
              </div>
              <CardTitle className="mt-4">Student Evaluation</CardTitle>
              <CardDescription>
                Course and instructor feedback from students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Course feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Instructor ratings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/department/evaluations/reports">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <Badge variant="outline">Analytics</Badge>
              </div>
              <CardTitle className="mt-4">Reports</CardTitle>
              <CardDescription>
                View analytics, export results, and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Export to PDF/Excel</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
