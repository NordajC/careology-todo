import { Button, Flex, Input, Text, Link as ChakraLink } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import AuthLayout from "@/components/AuthLayout"
import { signUp } from "@/services/auth"
import { useEffect, useState } from "react"
import { toaster } from "@/components/ui/toaster"
import { useAuth } from "@/context/AuthContext"

export default function Register() {
  const { user, loading } = useAuth()

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard")
    }
  }, [user, loading, navigate])
  if (loading) return null

  async function signUpTrigger() {
    // validate password
    if (password !== confirmPassword) {
      toaster.create({
        title: "Passwords do not match",
        type: "error",
        duration: 3000,
      })
      return
    }

    try {
      setIsLoading(true)

      await signUp(email, password, username)

      toaster.create({
        title: "Sign in successful. Welcome!",
        type: "success",
        duration: 3000,
      })

      // navigate to sign in on success
      navigate("/dashboard")
    } catch (error: any) {
      toaster.create({
        title: "Registration failed",
        description: error.message,
        type: "error",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Sign up to" subtitle="get things done ✨">
      <Flex direction="column" gap={4}>
        <Field label="Enter your email">
          <Input placeholder="yours@example.com" size="md" borderColor="gray.300" value={email} onChange={(e) => { setEmail(e.target.value) }} />
        </Field>

        <Field label="Enter your user name">
          <Input placeholder="task master" size="md" borderColor="gray.300" value={username} onChange={(e) => { setUsername(e.target.value) }} />
        </Field>

        <Field label="Enter your password">
          <PasswordInput placeholder="Create password" size="md" borderColor="gray.300" value={password} onChange={(e) => { setPassword(e.target.value) }} />
        </Field>

        <Field label="Confirm your password">
          <PasswordInput placeholder="Confirm password" size="md" borderColor="gray.300" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
        </Field>

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
          onClick={signUpTrigger}
        >
          Register
        </Button>
      </Flex>

      <Text textAlign="center" mt={6} fontSize="sm">
        Already have an Account?{" "}
        <ChakraLink asChild color="teal.500" fontWeight="bold">
          <RouterLink to="/login">Login</RouterLink>
        </ChakraLink>
      </Text>
    </AuthLayout>
  )
}