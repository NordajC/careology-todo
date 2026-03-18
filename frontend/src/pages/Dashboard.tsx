import { Box, Flex, Heading, Button, Spinner, Text } from "@chakra-ui/react";
import { AccordionRoot } from "@/components/ui/accordion";
import { MdAdd } from "react-icons/md";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { GET_TASKS, CREATE_TASK, UPDATE_TASK, DELETE_TASK, TOGGLE_TASK } from "@/graphql/tasks";
import type { Task } from "@/types/task";
import { Navbar } from "@/components/Navbar";
import { DesktopTaskList } from "@/components/TaskTable/DesktopTaskList";
import { MobileTaskList } from "@/components/TaskTable/MobileTaskList";
import type { CreateTaskInput, UpdateTaskInput } from "@/types/index";
import { REORDER_TASKS } from "@/graphql/tasks"

interface GetTasksData {
    getTasks: Task[];
}

interface ReorderTasksData {
    reorderTasks: {
        __typename: string
        id: string
        order: number
    }[]
}

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showAddRow, setShowAddRow] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // ── Queries ──
    const { data, loading, error } = useQuery<GetTasksData>(GET_TASKS);

    // ── Mutations ──
    const [createTask] = useMutation(CREATE_TASK, {
        refetchQueries: [{ query: GET_TASKS }],
    });

    const [deleteTask] = useMutation(DELETE_TASK, {
        refetchQueries: [{ query: GET_TASKS }],
    });

    const [toggleTask] = useMutation(TOGGLE_TASK, {
        refetchQueries: [{ query: GET_TASKS }],
    });

    const [updateTask] = useMutation(UPDATE_TASK, {
        refetchQueries: [{ query: GET_TASKS }],
    });

    const [reorderTasks] = useMutation(REORDER_TASKS, {
        refetchQueries: [{ query: GET_TASKS }],
    })
    // ── Derived Data ──
    const allTasks: Task[] = data?.getTasks ?? [];

    const filtered = searchQuery.trim()
        ? allTasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : allTasks;

    const tasksToDo = filtered.filter((t) => !t.isDone);
    const tasksDone = filtered.filter((t) => t.isDone);

    // ── Handlers ──
    async function handleAdd(input: CreateTaskInput) {
        try {
            await createTask({ variables: { input } });
            toaster.create({ title: "Task added", type: "success", duration: 2000 });
            setShowAddRow(false);
        } catch {
            toaster.create({ title: "Failed to add task", type: "error", duration: 3000 });
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteTask({ variables: { id } });
            toaster.create({ title: "Task deleted", type: "success", duration: 2000 });
        } catch {
            toaster.create({ title: "Failed to delete task", type: "error", duration: 3000 });
        }
    }

    async function handleToggle(id: string) {
        try {
            await toggleTask({ variables: { id } });
        } catch {
            toaster.create({ title: "Failed to update task", type: "error", duration: 3000 });
        }
    }

    async function handleUpdate(id: string, input: UpdateTaskInput) {
        try {
            await updateTask({ variables: { id, input } });
            toaster.create({ title: "Task updated", type: "success", duration: 2000 });
        } catch {
            toaster.create({ title: "Failed to update task", type: "error", duration: 3000 });
        }
    }

    async function handleReorder(orderedIds: string[]) {
        try {
            await reorderTasks({ variables: { orderedIds } })
        } catch {
            toaster.create({ title: "Failed to reorder tasks", type: "error", duration: 3000 })
        }
    }

    async function handleLogout() {
        try {
            await signOut();
            navigate("/login");
        } catch {
            toaster.create({ title: "Failed to log out", type: "error", duration: 3000 });
        }
    }

    // ── Loading / Error States ──
    if (loading) {
        return (
            <Flex minH="100vh" align="center" justify="center">
                <Spinner size="xl" color="teal.500" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex minH="100vh" align="center" justify="center">
                <Text color="red.500">Failed to load tasks. Please refresh.</Text>
            </Flex>
        );
    }

    return (
        <Box bg="#FFFEFC" minH="100vh" color="black">
            <Navbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onLogout={handleLogout}
            />

            <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
                <Box mb={{ base: 6, md: 10 }}>
                    <Heading
                        size="xl"
                        fontWeight="bold"
                        mb={6}
                        display={{ base: "block", md: "none" }}
                    >
                        My Tasks for the next month
                    </Heading>
                    <Button
                        colorPalette="teal"
                        bg="#00C896"
                        color="white"
                        _hover={{ bg: "#00a67c" }}
                        size="md"
                        px={6}
                        onClick={() => setShowAddRow(true)}
                    >
                        <MdAdd />
                        Add task
                    </Button>
                </Box>

                {/* Desktop View */}
                <Box display={{ base: "none", md: "block" }}>
                    <AccordionRoot multiple defaultValue={["tasks to do", "tasks done"]}>
                        <DesktopTaskList
                            title="Tasks to do"
                            tasks={tasksToDo}
                            showAddRow={showAddRow}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            onAdd={handleAdd}
                            onCancelAdd={() => setShowAddRow(false)}
                            onReorder={handleReorder}
                        />
                        <DesktopTaskList
                            title="Tasks done"
                            tasks={tasksDone}
                            isDone
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            onAdd={handleAdd}
                            onCancelAdd={() => { }}
                        />
                    </AccordionRoot>
                </Box>

                {/* Mobile View */}
                {/* Mobile View */}
                <Box display={{ base: "block", md: "none" }}>
                    <AccordionRoot multiple defaultValue={["tasks to do", "tasks done"]}>
                        <MobileTaskList
                            title="Tasks to do"
                            tasks={tasksToDo}
                            showAddCard={showAddRow}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            onAdd={(input) => { handleAdd(input); }}
                            onCancelAdd={() => setShowAddRow(false)}
                        />
                        <MobileTaskList
                            title="Tasks done"
                            tasks={tasksDone}
                            isDone
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            onAdd={handleAdd}
                            onCancelAdd={() => { }}
                        />
                    </AccordionRoot>
                </Box>
            </Box>
        </Box>
    );
}