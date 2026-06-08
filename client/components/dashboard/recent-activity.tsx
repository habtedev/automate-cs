import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  {
    user: "Dr. Sarah Miller",
    action: "published final grades for",
    target: "Advanced Database Systems",
    time: "2 hours ago",
    initials: "SM",
  },
  {
    user: "Prof. James Wilson",
    action: "updated the syllabus for",
    target: "Machine Learning 101",
    time: "4 hours ago",
    initials: "JW",
  },
  {
    user: "Admin Team",
    action: "posted a new announcement regarding",
    target: "Fall Semester Registration",
    time: "Yesterday",
    initials: "AT",
  },
  {
    user: "Elena Rodriguez",
    action: "submitted assignment for",
    target: "Data Structures",
    time: "Yesterday",
    initials: "ER",
  },
]

export function RecentActivity() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates across the department
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{activity.initials}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.action} <span className="font-medium text-foreground">{activity.target}</span>
                </p>
              </div>
              <div className="ml-auto font-medium text-xs text-muted-foreground">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
