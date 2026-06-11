"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface RatingScaleProps {
  value?: number
  onChange?: (value: number) => void
  disabled?: boolean
  maxRating?: number
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
}

const ratingLabels = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent"
}

export function RatingScale({
  value,
  onChange,
  disabled = false,
  maxRating = 5,
  showLabels = true,
  size = "md"
}: RatingScaleProps) {
  const [selected, setSelected] = useState<number | undefined>(value)

  const handleChange = (newValue: string) => {
    const numValue = parseInt(newValue)
    setSelected(numValue)
    onChange?.(numValue)
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  }

  return (
    <div className="space-y-2">
      <RadioGroup
        value={selected?.toString()}
        onValueChange={handleChange}
        disabled={disabled}
        className="flex gap-2"
      >
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
          <div key={rating} className="flex flex-col items-center gap-1">
            <RadioGroupItem
              value={rating.toString()}
              id={`rating-${rating}`}
              className={cn(
                "peer",
                sizeClasses[size]
              )}
            />
            <Label
              htmlFor={`rating-${rating}`}
              className={cn(
                "cursor-pointer font-medium transition-colors",
                "peer-data-[state=checked]:text-primary",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {rating}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      )}
    </div>
  )
}

export function RatingDisplay({ value, maxRating = 5 }: { value: number; maxRating?: number }) {
  const percentage = (value / maxRating) * 100
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
          <div
            key={rating}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              rating <= value ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium">{value}/{maxRating}</span>
    </div>
  )
}
