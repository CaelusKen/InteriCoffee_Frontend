import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface BanWarningDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  accountName: string
}

export function BanWarningDialog({ isOpen, onClose, onConfirm, accountName }: BanWarningDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to ban the account for {accountName}? This action can be reversed later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Ban Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}