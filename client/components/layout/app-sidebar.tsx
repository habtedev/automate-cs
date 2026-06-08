"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  FileText,
  BarChart3,
  Megaphone,
  Calendar,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Main Menu",
      items: [
        {
          title: "Overview",
          url: "/department/overview",
          icon: LayoutDashboard,
        },
        {
          title: "Students",
          url: "/department/students",
          icon: Users,
        },
        {
          title: "Teachers",
          url: "/department/teachers",
          icon: GraduationCap,
        },
        {
          title: "Courses",
          url: "/department/courses",
          icon: BookOpen,
        },
        {
          title: "Evaluations",
          url: "/department/evaluations",
          icon: ClipboardList,
        },
        {
          title: "Results",
          url: "/department/results",
          icon: FileText,
        },
        {
          title: "Analytics",
          url: "/department/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Communications & Planning",
      items: [
        {
          title: "Announcements",
          url: "/department/announcements",
          icon: Megaphone,
        },
        {
          title: "Schedules",
          url: "/department/schedules",
          icon: Calendar,
        },
        {
          title: "Reports",
          url: "/department/reports",
          icon: FileText,
        },
      ],
    },
  ],
  navFooter: [
    {
      title: "Settings",
      url: "/department/settings",
      icon: Settings,
    },
    {
      title: "Profile",
      url: "/department/profile",
      icon: UserCircle,
    },
  ],
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="flex h-14 items-center border-b border-border px-4 py-2 lg:h-[60px]">
        <Link href="/department/overview" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-lg">Academia OS</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={pathname.startsWith(item.url)} render={<Link href={item.url} />}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {data.navFooter.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={pathname.startsWith(item.url)} render={<Link href={item.url} />}>
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => console.log('logout')}>
              <LogOut className="text-destructive" />
              <span className="text-destructive">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
