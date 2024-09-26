'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { toast } from '@/hooks/use-toast'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the email to your API
    console.log('Subscribing email:', email)
    toast({
      title: "Subscribed!",
      description: "You've successfully subscribed to our newsletter.",
    })
    setEmail('')
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85 }}
      className="bg-gray-100 text-gray-600 py-12 px-10 dark:bg-gray-900 dark:text-white"
    >
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo and Company Info */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-bold mb-4">Logo</h2>
          <p className="text-sm mb-4">Your trusted partner in innovation and excellence.</p>
          <div className="flex space-x-4">
            {[
              { icon: Facebook, label: 'Facebook' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Instagram, label: 'Instagram' },
            ].map(({ icon: Icon, label }) => (
              <Link 
                key={label}
                href="#" 
                className="hover:text-neutral-700 dark:hover:text-secondary-400 transition-colors duration-300"
                aria-label={label}
              >
                <Icon size={20} />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {['Home', 'About', 'Styles', 'Products'].map((item) => (
              <li key={item}>
                <Link 
                  href="#" 
                  className="hover:text-neutral-700 dark:hover:text-secondary-400 transition-colors duration-300"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            {[
              { icon: Mail, content: 'info@example.com', href: 'mailto:info@example.com' },
              { icon: Phone, content: '(123) 456-7890', href: 'tel:+1234567890' },
              { icon: MapPin, content: '123 Main St, City, Country' },
            ].map(({ icon: Icon, content, href }, index) => (
              <li key={index} className="flex items-center">
                <Icon size={16} className="mr-2 flex-shrink-0" />
                {href ? (
                  <a 
                    href={href} 
                    className="hover:text-neutral-700 dark:hover:text-secondary-400 transition-colors duration-300"
                  >
                    {content}
                  </a>
                ) : (
                  <span>{content}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm mb-4">Subscribe to our newsletter for the latest updates.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 w-full border border-gray-300 rounded-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              className="mt-2 sm:mt-0 px-4 py-2 bg-primary text-white rounded-md sm:rounded-l-none hover:bg-primary-600 transition-colors duration-300"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            {['Terms of Service', 'Privacy Policy'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-sm hover:text-gray-900 transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer