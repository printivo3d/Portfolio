'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChevronDown, Mail, Github, Linkedin, ExternalLink, Menu, X, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      toast.success('Message sent successfully! I\'ll get back to you soon.')
      reset()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Calculate scroll progress
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Add fade-in animation to sections
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in')
        }
      })
    }, observerOptions)

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md border-b' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Portfolio
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-primary transition-colors">
              Skills
            </button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-primary transition-colors">
              Projects
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">
              Contact
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button onClick={() => scrollToSection('contact')} className="hidden sm:flex">
              Get in Touch
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Theme</span>
                    <ThemeToggle />
                  </div>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="text-lg hover:text-primary transition-colors text-left py-2"
                  >
                    About
                  </button>
                  <button 
                    onClick={() => scrollToSection('skills')} 
                    className="text-lg hover:text-primary transition-colors text-left py-2"
                  >
                    Skills
                  </button>
                  <button 
                    onClick={() => scrollToSection('projects')} 
                    className="text-lg hover:text-primary transition-colors text-left py-2"
                  >
                    Projects
                  </button>
                  <button 
                    onClick={() => scrollToSection('contact')} 
                    className="text-lg hover:text-primary transition-colors text-left py-2"
                  >
                    Contact
                  </button>
                  <Button onClick={() => scrollToSection('contact')} className="mt-4">
                    Get in Touch
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5"></div>
        <div className="container mx-auto px-4 z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Welcome to my portfolio
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Hi, I'm a Full Stack Developer
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              I create beautiful, functional, and user-centered digital experiences with modern web technologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" onClick={() => scrollToSection('projects')}>
                View My Work
              </Button>
              <Button variant="outline" size="lg" onClick={() => scrollToSection('contact')}>
                Contact Me
              </Button>
            </div>
            <div className="flex justify-center space-x-6">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About Me</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-lg text-muted-foreground mb-4">
                      I'm a passionate full-stack developer with expertise in modern web technologies. 
                      I love building scalable applications that solve real-world problems and provide 
                      exceptional user experiences.
                    </p>
                    <p className="text-lg text-muted-foreground mb-4">
                      With a strong foundation in both frontend and backend development, I bring ideas 
                      to life through clean, efficient code and thoughtful design.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-6">
                      <Badge variant="secondary">Next.js</Badge>
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Node.js</Badge>
                      <Badge variant="secondary">Prisma</Badge>
                      <Badge variant="secondary">Tailwind CSS</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <div className="text-6xl">👨‍💻</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Skills & Expertise</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-all duration-300 dark:shadow-primary/5">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Frontend Development</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>React/Next.js</span>
                    <Badge>Expert</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>TypeScript</span>
                    <Badge>Expert</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tailwind CSS</span>
                    <Badge>Advanced</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>shadcn/ui</span>
                    <Badge>Advanced</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 dark:shadow-primary/5">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Backend Development</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Node.js</span>
                    <Badge>Advanced</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Prisma ORM</span>
                    <Badge>Advanced</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SQLite/PostgreSQL</span>
                    <Badge>Intermediate</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>REST APIs</span>
                    <Badge>Expert</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 dark:shadow-primary/5">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tools & Others</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Git/GitHub</span>
                    <Badge>Expert</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Docker</span>
                    <Badge>Intermediate</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Vercel</span>
                    <Badge>Advanced</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Figma</span>
                    <Badge>Intermediate</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-300 dark:shadow-primary/5 hover:scale-105">
              <CardContent className="p-6">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-4xl">🚀</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">E-Commerce Platform</h3>
                <p className="text-muted-foreground mb-4">
                  A full-stack e-commerce solution with user authentication, payment processing, and admin dashboard.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">Next.js</Badge>
                  <Badge variant="outline">Prisma</Badge>
                  <Badge variant="outline">Stripe</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 dark:shadow-primary/5 hover:scale-105">
              <CardContent className="p-6">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-4xl">📱</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Task Management App</h3>
                <p className="text-muted-foreground mb-4">
                  A collaborative task management application with real-time updates and team collaboration features.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">Socket.io</Badge>
                  <Badge variant="outline">Zustand</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 dark:shadow-primary/5 hover:scale-105">
              <CardContent className="p-6">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-4xl">📊</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  A comprehensive analytics dashboard with data visualization and real-time reporting capabilities.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">Next.js</Badge>
                  <Badge variant="outline">Recharts</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Get In Touch</h2>
          <div className="max-w-2xl mx-auto">
            <Card className="dark:shadow-primary/5">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Your name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="your@email.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Your message..."
                      rows={5}
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-muted-foreground">
                © 2024 Portfolio. Built with Next.js and shadcn/ui.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}