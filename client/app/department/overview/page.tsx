"use client"

import { Users, GraduationCap, BookOpen, Clock, Activity, Award } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { EnrollmentTrendChart, StudentPerformanceChart } from "@/components/dashboard/analytics-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"

const enrollmentData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1350 },
  { name: "Mar", total: 1400 },
  { name: "Apr", total: 1450 },
  { name: "May", total: 1500 },
  { name: "Jun", total: 1600 },
  { name: "Jul", total: 1750 },
  { name: "Aug", total: 1900 },
  { name: "Sep", total: 2200 },
  { name: "Oct", total: 2250 },
  { name: "Nov", total: 2300 },
  { name: "Dec", total: 2350 },
]

const performanceData = [
  { name: "CS101", gpa: 3.2 },
  { name: "Math202", gpa: 2.8 },
  { name: "Phys101", gpa: 3.1 },
  { name: "Eng101", gpa: 3.6 },
  { name: "Bio101", gpa: 3.4 },
]

export default function OverviewPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of the department's performance and activities.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value="2,350"
          description="Active enrollments"
          icon={<Users />}
          trend={{ value: 12.5, isPositive: true }}
          delay={0.1}
        />
        <StatsCard
          title="Total Teachers"
          value="145"
          description="Faculty members"
          icon={<GraduationCap />}
          trend={{ value: 2.1, isPositive: true }}
          delay={0.2}
        />
        <StatsCard
          title="Total Courses"
          value="84"
          description="Active this semester"
          icon={<BookOpen />}
          delay={0.3}
        />
        <StatsCard
          title="Attendance Rate"
          value="94.2%"
          description="Average this week"
          icon={<Clock />}
          trend={{ value: 1.1, isPositive: false }}
          delay={0.4}
        />
        <StatsCard
          title="Active Evaluations"
          value="12"
          description="Pending grading"
          icon={<Activity />}
          delay={0.5}
        />
        <StatsCard
          title="Department GPA"
          value="3.24"
          description="Overall average"
          icon={<Award />}
          trend={{ value: 0.4, isPositive: true }}
          delay={0.6}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <EnrollmentTrendChart
          title="Enrollment Trends"
          description="Student enrollments over the past year"
          data={enrollmentData}
        />
        <StudentPerformanceChart
          title="Performance by Course"
          description="Average GPA across top courses"
          data={performanceData}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity />
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Upcoming Schedule</h3>
            <p className="text-sm text-muted-foreground">Department meetings and events</p>
          </div>
          <div className="p-6 pt-0">
             <div className="flex items-center justify-center h-[300px] border-2 border-dashed border-muted rounded-lg">
                <span className="text-muted-foreground">Schedule Calendar Widget Placeholder</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
