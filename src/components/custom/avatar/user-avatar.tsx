import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserUIProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  avatarSrc?: string
}

const UserUI = React.forwardRef<HTMLDivElement, UserUIProps>(
  ({ className, name, avatarSrc, ...props }, ref) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()

    return (
      <div
        ref={ref}
        className={cn("flex items-center space-x-3", className)}
        {...props}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{name}</span>
      </div>
    )
  }
)
UserUI.displayName = "UserUI"

export default function User() {
  return (
    <div className="p-4 w-fit">
      <UserUI 
        name="John Doe" 
        avatarSrc="https://github.com/shadcn.png"
      />
    </div>
  )
}