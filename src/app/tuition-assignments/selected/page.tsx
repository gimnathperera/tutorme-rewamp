"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { TuitionAssignment } from "@/types/response-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, X } from "lucide-react"

const SelectedAssignmentsPage: React.FC = () => {
  const [selectedAssignments, setSelectedAssignments] = useState<TuitionAssignment[]>([])
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem("selectedAssignments")
      if (data) {
        setSelectedAssignments(JSON.parse(data))
      }
    }
  }, [])

  const removeAssignment = (assignmentId: string | number) => {
    const updatedAssignments = selectedAssignments.filter((a) => a.id !== assignmentId)
    setSelectedAssignments(updatedAssignments)

    // Update sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedAssignments", JSON.stringify(updatedAssignments))
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 sm:px-8 md:px-16 lg:px-32 py-10">
      <Card className="w-full sm:w-5/6 md:w-5/6 lg:w-2/5 bg-white">
        <CardHeader className="bg">
          <p className="font-extrabold text-3xl sm:text-4xl text-center">Selected Assignments</p>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="number">Mobile No.</Label>
                <Input id="number" type="number" placeholder="Mobile No." required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignmentCodes">Assignment Codes</Label>
                {selectedAssignments.map((a) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <Input
                      id={`assignmentCodes-${a.id}`}
                      type="number"
                      placeholder={a.assignmentNumber ?? ""}
                      defaultValue={a.assignmentNumber ?? ""}
                      readOnly
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAssignment(a.id)}
                      className="px-2 py-1 h-9 w-9 flex-shrink-0 bg-red-600"
                      aria-label={`Remove assignment ${a.assignmentNumber}`}
                    >
                      <X className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-row gap-10">
          <Button type="submit" className="w-full bg-blue-700 text-white hover:shadow-md" onClick={() => router.push("/tuition-assignments")}>
            View All Assignments
          </Button>
          <Button variant="outline" className="w-full bg-transparent bg-gray-200 hover:shadow-md">
            Next <ChevronRight color="#808080" strokeWidth={2} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SelectedAssignmentsPage