"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RatingDisplay } from "@/components/evaluations/rating-scale"
import { BarChart3, Download, TrendingUp, TrendingDown, Users, FileText } from "lucide-react"
import { toast } from "sonner"

const mockEvaluationData = [
  { id: 1, instructor: "Dr. John Smith", department: "Computer Science", course: "CS101", average: 4.2, totalEvaluations: 45, status: "Excellent" },
  { id: 2, instructor: "Dr. Sarah Johnson", department: "Computer Science", course: "CS102", average: 3.8, totalEvaluations: 38, status: "Good" },
  { id: 3, instructor: "Dr. Michael Brown", department: "Software Engineering", course: "CS201", average: 4.5, totalEvaluations: 52, status: "Excellent" },
  { id: 4, instructor: "Dr. Emily Davis", department: "Information Systems", course: "CS202", average: 3.5, totalEvaluations: 30, status: "Good" },
  { id: 5, instructor: "Dr. Robert Wilson", department: "Computer Science", course: "CS301", average: 4.0, totalEvaluations: 41, status: "Very Good" },
]

const categoryAverages = {
  "Teaching Effectiveness": 4.1,
  "Course Organization": 3.9,
  "Communication": 4.2,
  "Availability": 3.7,
  "Fairness": 4.0,
}

export default function ReportsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const handleExportPDF = () => {
    toast.success("Exporting to PDF", {
      description: "Your report is being generated and will download shortly."
    })
  }

  const handleExportExcel = () => {
    toast.success("Exporting to Excel", {
      description: "Your report is being generated and will download shortly."
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-green-500"
      case "Very Good":
        return "bg-blue-500"
      case "Good":
        return "bg-yellow-500"
      case "Fair":
        return "bg-orange-500"
      case "Poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredData = mockEvaluationData.filter((item) => {
    const departmentMatch = selectedDepartment === "all" || item.department.toLowerCase().includes(selectedDepartment.toLowerCase())
    return departmentMatch
  })

  const overallAverage = (filteredData.reduce((sum, item) => sum + item.average, 0) / filteredData.length).toFixed(1)
  const totalEvaluations = filteredData.reduce((sum, item) => sum + item.totalEvaluations, 0)

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Evaluation Reports</h2>
        <p className="text-muted-foreground">
          View analytics, trends, and export evaluation results.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value || "")}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="computer-science">Computer Science</SelectItem>
            <SelectItem value="software-engineering">Software Engineering</SelectItem>
            <SelectItem value="information-systems">Information Systems</SelectItem>
            <SelectItem value="information-technology">Information Technology</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={(value) => setSelectedType(value || "")}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Evaluation Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="head">Head</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={handleExportPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="gap-2">
            <FileText className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvaluations}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAverage}/5</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Instructors rated 4.0+
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Evaluation completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>
            Average ratings across different evaluation categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryAverages).map(([category, average]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-sm text-muted-foreground">{average}/5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(average / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Evaluation Results</CardTitle>
          <CardDescription>
            Individual instructor and course evaluation summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instructor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Average Rating</TableHead>
                <TableHead>Evaluations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell className="font-medium">{evaluation.instructor}</TableCell>
                  <TableCell>{evaluation.department}</TableCell>
                  <TableCell>{evaluation.course}</TableCell>
                  <TableCell>
                    <RatingDisplay value={evaluation.average} />
                  </TableCell>
                  <TableCell>{evaluation.totalEvaluations}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(evaluation.status)}>
                      {evaluation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
