import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react"
import todoImage from "@/assets/todo-image.png"

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <Flex minH="100vh" direction="column" bg="white" color="black">
      {/* Header */}
      <Box px={8} py={4}>
        <Text fontSize="xl" fontWeight="bold">Checked</Text>
      </Box>

      {/* Main Content */}
      <Flex flex="1" align="center" justify="center" px={6} bg="#FFFEFC">
        <Flex
          bg="white"
          borderRadius="10px"
          overflow="hidden"
          w="full"
          maxW="7xl"
        >
          {/* Form Section */}
          <Box p={10} w={{ base: "full", md: "40%" }} border="1px solid" borderColor="gray.200" borderRadius="10px">
            <Text fontSize="lg" mb={1}>Welcome !</Text>
            <Heading size="3xl" fontWeight="bold" mb={1}>{title}</Heading>
            <Text mb={8}>{subtitle}</Text>
            {children}
          </Box>

          {/* Illustration Section */}
          <Flex
            w="60%"
            display={{ base: "none", md: "flex" }}
            align="center"
            justify="center"
            p={10}
          >
            <Image
              src={todoImage}
              alt="Todo illustration"
              maxW="320px"
              w="full"
              objectFit="contain"
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
