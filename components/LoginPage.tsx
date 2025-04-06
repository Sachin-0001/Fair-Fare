"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

interface LoginResponse {
  token: string;
  role: string;
  error?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData: LoginFormData = {
        email,
        password,
      }

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data: LoginResponse = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("role", data.role)
        router.push("/user/dashboard")
      } else {
        setError(data.error || "An error occurred")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = (): void => {
    router.push("/")
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Go Back Button */}
        <motion.div 
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-gray-800/50 focus:ring-2 focus:ring-purple-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </motion.div>

        <motion.aside 
          className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm"></div>
          <img
            alt="Login Illustration"
            src="/assets/fairfarefrontimage.png"
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-50"
          />
        </motion.aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 relative z-10">
          <motion.div 
            className="max-w-xl lg:max-w-3xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative inline-block mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-purple-400" />
              </motion.div>
            </div>
            <p className="mt-4 leading-relaxed text-gray-400">
              Enter your email and password to access your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border border-red-500/50 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="mt-1 block w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400
                           focus:border-purple-500 focus:ring-purple-500 rounded-lg backdrop-blur-sm"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  className="mt-1 block w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400
                           focus:border-purple-500 focus:ring-purple-500 rounded-lg backdrop-blur-sm"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg
                           hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                           focus:ring-offset-gray-900 transform hover:scale-[1.02] transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed relative group overflow-hidden"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </motion.div>
              <motion.p 
                className="text-center text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Don't have an account?{" "}
                <Link 
                  href="./register" 
                  className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Create an account
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </main>
      </div>
    </section>
  )
}

export default LoginPage