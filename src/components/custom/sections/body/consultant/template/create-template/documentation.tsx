'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

import { AlertCircle } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export const Documentation = ({ onProceed }: { onProceed: () => void }) => {
    const [hasRead, setHasRead] = useState(false)
    const [timeSpent, setTimeSpent] = useState(0)
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1)
      }, 1000)
  
      return () => clearInterval(timer)
    }, [])
  
    return (
      <Card className="w-full max-w-8xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Template Creation Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Please read all instructions carefully before proceeding to create a template.
            </AlertDescription>
          </Alert>
          
          <ScrollArea className="h-[400px] pr-4">
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">1. About Creating the Template</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Choose a clear and descriptive name for your template.</li>
                  <li>Ensure your template design is original and does not infringe on any copyrights.</li>
                  <li>Use high-quality images that are relevant to the template's theme.</li>
                  <li>Select at least 5 product models that complement the template's design.</li>
                  <li>Consider the target audience and purpose of the template when designing.</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-2xl font-semibold mb-2">2. Design Best Practices</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintain a consistent color scheme throughout the template.</li>
                  <li>Use appropriate spacing and alignment for a clean, professional look.</li>
                  <li>Ensure text is legible and contrasts well with the background.</li>
                  <li>Optimize the template for various screen sizes and devices.</li>
                  <li>Consider accessibility guidelines in your design choices.</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-2xl font-semibold mb-2">3. Publishing Guidelines</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Review your template thoroughly before submission.</li>
                  <li>Provide accurate and detailed descriptions for your template.</li>
                  <li>Tag your template with relevant categories and keywords.</li>
                  <li>Be prepared to make revisions based on reviewer feedback.</li>
                  <li>Understand that published templates may be subject to user ratings and reviews.</li>
                </ul>
              </div>
            </section>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={hasRead}
              onCheckedChange={(checked) => setHasRead(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              I have read and understood all the instructions provided above.
            </Label>
          </div>
          <Button 
            onClick={onProceed} 
            disabled={!hasRead || timeSpent < 30}
            className="w-full"
          >
            Proceed to Sketch Phase
          </Button>
          {timeSpent < 30 && (
            <p className="text-sm text-muted-foreground text-center">
              Please spend at least {30 - timeSpent} more seconds reviewing the instructions.
            </p>
          )}
        </CardFooter>
      </Card>
    )
  }