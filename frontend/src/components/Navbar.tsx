import { Flex, Heading, HStack, Input, Button, InputGroup, IconButton, Box } from "@chakra-ui/react"
import { MdMenu, MdSearch, MdLockOutline } from "react-icons/md"
import { useState } from "react"

interface NavbarProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    onLogout: () => void
}

export function Navbar({ searchQuery, onSearchChange, onLogout }: NavbarProps) {

    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            {/* Mobile */}

            <Flex
                display={{ base: "flex", md: "none" }}
                bg="black"
                color="white"
                p={4}
                justify="space-between"
                align="center"
            >
                <Heading size="md" fontWeight="bold">Checked</Heading>
                <IconButton
                    aria-label="Menu"
                    variant="ghost"
                    color="white"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <MdMenu size={24} />
                </IconButton>
            </Flex>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <Box
                    display={{ base: "block", md: "none" }}
                    bg="black"
                    color="white"
                    px={4}
                    pb={4}
                >
                    <Input
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        size="sm"
                        bg="gray.800"
                        borderColor="gray.600"
                        color="white"
                        mb={3}
                        _placeholder={{ color: "gray.400" }}
                    />
                    <Button
                        w="full"
                        variant="outline"
                        color="white"
                        borderColor="gray.600"
                        onClick={onLogout}
                    >
                        <MdLockOutline />
                        Logout
                    </Button>
                </Box>
            )}


            {/* Desktop */}
            <Flex display={{ base: "none", md: "flex" }} justify="space-between" align="center" mb={12} px={8} pt={8}>
                <Heading size="2xl" fontWeight="bold">
                    My Tasks for the next month
                </Heading>
                <HStack gap={3}>
                    <InputGroup startElement={<MdSearch color="gray.500" />}>
                        <Input
                            placeholder="Search"
                            size="sm"
                            variant="outline"
                            bg="white"
                            w="250px"
                            borderColor="gray.300"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            _placeholder={{ color: "gray.500" }}
                        />
                    </InputGroup>
                    <Button size="sm" variant="outline" bg="white" color="black" borderColor="gray.300" onClick={onLogout}>
                        <MdLockOutline />
                        Logout
                    </Button>
                </HStack>
            </Flex>
        </>
    )
}