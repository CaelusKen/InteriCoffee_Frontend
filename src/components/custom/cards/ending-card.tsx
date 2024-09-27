import { Button } from "@/components/ui/button"

interface CardProps {
  title: string
  heading: string
  description: string
  buttonText: string
  backgroundImage: string
}

export default function EndingCard({ title, heading, description, buttonText, backgroundImage }: CardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-8 min-h-[400px] flex flex-col justify-between">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="relative z-10">
        <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">{title}</h3>
        <h2 className="text-4xl font-bold mb-4">{heading}</h2>
        <p className="text-xl mb-6">{description}</p>
        <Button variant="outline" className="bg-transparent border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-primary dark:hover:border-primary dark:hover:text-white">
          {buttonText}
        </Button>
      </div>
      <div className="relative z-10 text-sm mt-4 text-gray-600 dark:text-gray-400">
        Got questions? Read our FAQs
      </div>
    </div>
  )
}