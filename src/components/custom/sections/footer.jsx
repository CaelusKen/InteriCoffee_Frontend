import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Company Info */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-bold mb-4">Logo</h2>
          <p className="text-sm mb-4">Your trusted partner in innovation and excellence.</p>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {['Home', 'About', 'Styles', 'Products'].map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-gray-900 transition-colors duration-300">
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
            <li className="flex items-center">
              <Mail size={16} className="mr-2" />
              <a href="mailto:info@example.com" className="hover:text-primary-900 transition-colors duration-300">
                info@example.com
              </a>
            </li>
            <li className="flex items-center">
              <Phone size={16} className="mr-2" />
              <a href="tel:+1234567890" className="hover:text-primary-900 transition-colors duration-300">
                (123) 456-7890
              </a>
            </li>
            <li className="flex items-center">
              <MapPin size={16} className="mr-2" />
              <span>123 Main St, City, Country</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm mb-4">Subscribe to our newsletter for the latest updates.</p>
          <form className="flex">
            <Input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-full border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <Button
              type="submit"
              className="px-4 py-2 bg-primary-700 text-white rounded-r-md hover:bg-primary-800 transition-colors duration-300"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm hover:text-gray-900 transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm hover:text-gray-900 transition-colors duration-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer