import { Box, CheckCircle, Clock, Package, Truck } from 'lucide-react'
import { cn } from "@/lib/utils"

interface PackagingStatusProps {
  status: string;
  role: string;
  onUpdateStatus?: () => void;
}

export function PackagingStatus({ status, onUpdateStatus, role }: PackagingStatusProps) {
    const stages = [
        { key: "PENDING", label: "Pending", icon: Clock, description: "Waiting for merchant confirmation" },
        { key: "SHIPPED", label: "Shipped", icon: Truck, description: "Order has been packaged and shipped" },
        { key: "COMPLETED", label: "Completed", icon: CheckCircle, description: "Order has been received" },
      ]

  const currentStageIndex = stages.findIndex((s) => s.key === status)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
        <Package className="mr-2 h-5 w-5" />
        Delivery Status
      </h2>
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.key} className="flex items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mr-4",
                status === stage.key
                  ? "bg-primary text-primary-foreground"
                  : index < stages.findIndex((s) => s.key === status)
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <stage.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className={cn(
                "font-medium",
                status === stage.key ? "text-primary" : "dark:text-white"
              )}>
                {stage.label}
              </p>
              <p className="text-sm text-muted-foreground dark:text-gray-400">{stage.description}</p>
            </div>
            {status === stage.key && (
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            )}
          </div>
        ))}
      </div>
      {status === "SHIPPED" && role === "CUSTOMER"  && (
        <button
          onClick={onUpdateStatus}
          className="mt-6 w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Confirm Received
        </button>
      )}
    </div>
  )
}

