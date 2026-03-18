import { Button, Flex, Input, Text, Link as ChakraLink, HStack } from "@chakra-ui/react"
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogBackdrop,
  DialogPositioner,
} from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
import { Checkbox } from "@/components/ui/checkbox"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import AuthLayout from "@/components/AuthLayout"
import { logIn, resetPassword } from "@/services/auth"
import { useEffect, useState } from "react"
import { toaster } from "@/components/ui/toaster"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()


  //form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isResetting, setIsResetting] = useState(false)

  //navigates user to dashboard when already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard")
    }
  }, [user, loading, navigate])
  if (loading) return null

  async function loginTrigger() {
    try {
      setIsLoading(true)
      await logIn(email, password, rememberMe)
      toaster.create({
        title: "Log in successful. Welcome back!",
        type: "success",
        duration: 3000,
      })
      navigate("/dashboard")
    } catch (error) {
      toaster.create({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        type: "error",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResetPassword() {
    if (!resetEmail.trim()) return
    try {
      setIsResetting(true)
      await resetPassword(resetEmail)
      toaster.create({
        title: "Password reset email sent",
        description: "Check your inbox for reset instructions",
        type: "success",
        duration: 4000,
      })
      setShowForgotPassword(false)
      setResetEmail("")
    } catch (error) {
      toaster.create({
        title: "Failed to send reset email",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        type: "error",
        duration: 4000,
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <>
      <AuthLayout title="Sign in to" subtitle="get things done ✨">
        <Flex direction="column" gap={5}>
          <Field label="Enter your email">
            <Input
              placeholder="yours@example.com"
              size="md"
              borderColor="gray.300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Enter your password">
            <PasswordInput
              size="md"
              borderColor="gray.300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") loginTrigger() }}
            />
          </Field>

          <Flex justify="space-between" align="center" mt={1}>
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(e) => setRememberMe(!!e.checked)}
            >
              Remember me
            </Checkbox>
            <ChakraLink
              color="teal.500"
              fontWeight="medium"
              fontSize="sm"
              cursor="pointer"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </ChakraLink>
          </Flex>

          <Button
            bg="#2dd4a8"
            color="white"
            size="xl"
            mt={2}
            rounded="lg"
            w="full"
            _hover={{ bg: "#26b892" }}
            fontWeight="bold"
            loading={isLoading}
            disabled={isLoading}
            onClick={loginTrigger}
          >
            Login
          </Button>
        </Flex>

        <Text textAlign="center" mt={6} fontSize="sm">
          Don't have an Account?{" "}
          <ChakraLink asChild color="teal.500" fontWeight="bold">
            <RouterLink to="/register">Register</RouterLink>
          </ChakraLink>
        </Text>
      </AuthLayout>

      {/* Forgot Password Dialog */}
      <DialogRoot
        open={showForgotPassword}
        onOpenChange={(e) => setShowForgotPassword(e.open)}
      >
        <DialogBackdrop />
        <DialogPositioner
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="fixed"
          inset="0"
        >
          <DialogContent bg="white">
            <DialogHeader color="gray.800">Reset Password</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <Field label="Enter your email">
                <Input
                  placeholder="yours@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleResetPassword() }}
                  borderColor="gray.300"
                  bg="white"
                  color="gray.800"
                  size="md"
                />
              </Field>
            </DialogBody>
            <DialogFooter>
              <HStack gap={3}>
                <Button
                  variant="outline"
                  color="gray.700"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetEmail("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  bg="#2dd4a8"
                  color="white"
                  _hover={{ bg: "#26b892" }}
                  loading={isResetting}
                  disabled={isResetting || !resetEmail.trim()}
                  onClick={handleResetPassword}
                >
                  Send Reset Email
                </Button>
              </HStack>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  )
}