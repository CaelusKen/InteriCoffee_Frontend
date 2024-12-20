import { CheckCircle, Truck, Clock } from 'lucide-react'
import { cn } from "@/lib/utils"

interface OrderDeliveryStatusProps {
  status: string
  onConfirmReceived?: () => void
}

export function OrderDeliveryStatus({ status, onConfirmReceived }: OrderDeliveryStatusProps) {
  const stages = [
    { key: "PENDING", label: "Pending", icon: Clock },
    { key: "SHIPPED", label: "Shipped", icon: Truck },
    { key: "COMPLETED", label: "Completed", icon: CheckCircle },
  ]

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold mb-2 dark:text-white">Delivery Status</h2>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.key} className="flex flex-col items-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                status === stage.key
                  ? "bg-primary text-primary-foreground"
                  : index < stages.findIndex((s) => s.key === status)
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <stage.icon className="w-6 h-6" />
            </div>
            <span className="text-sm mt-2 dark:text-gray-300">{stage.label}</span>
          </div>
        ))}
      </div>
      {status === "SHIPPED" && (
        <button
          onClick={onConfirmReceived}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Confirm Received
        </button>
      )}
    </div>
  )
}