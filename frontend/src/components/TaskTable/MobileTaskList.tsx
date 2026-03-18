import { Stack, Text, Box, Input, Button, HStack } from "@chakra-ui/react";
import {
    AccordionItem,
    AccordionItemTrigger,
    AccordionItemContent,
} from "@/components/ui/accordion";
import { MobileTaskCard } from "./MobileTaskCard";
import { Checkbox } from "@/components/ui/checkbox";
import { MdCheck, MdClose } from "react-icons/md";
import { useState } from "react";
import type { Task } from "@/types/task";
import type { CreateTaskInput, UpdateTaskInput } from "@/types/index";

interface MobileTaskListProps {
    title: string;
    tasks: Task[];
    isDone?: boolean;
    showAddCard?: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, input: UpdateTaskInput) => void;
    onAdd: (input: CreateTaskInput) => void;
    onCancelAdd: () => void;
}

export function MobileTaskList({
    title,
    tasks,
    isDone,
    showAddCard,
    onToggle,
    onDelete,
    onUpdate,
    onAdd,
    onCancelAdd,
}: MobileTaskListProps) {
    const [newTitle, setNewTitle] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [newTag, setNewTag] = useState("");
    const [newNote, setNewNote] = useState("");

    function handleSave() {
        if (!newTitle.trim()) return;
        onAdd({
            title: newTitle.trim(),
            dueDate: newDueDate || undefined,
            tag: newTag || undefined,
            note: newNote || undefined,
            order: tasks.length,
        });
        handleCancel();
    }

    function handleCancel() {
        setNewTitle("");
        setNewDueDate("");
        setNewTag("");
        setNewNote("");
        onCancelAdd();
    }

    return (
        <AccordionItem value={title.toLowerCase()} borderBottom="none">
            <AccordionItemTrigger mb={2} px={0} _hover={{ bg: "transparent" }}>
                <Text fontWeight="bold" fontSize="lg">{title}</Text>
            </AccordionItemTrigger>
            <AccordionItemContent px={0} pb={6}>
                <Stack
                    gap={0}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="8px"
                    bg="white"
                    overflow="hidden"
                >
                    {tasks.map((task) => (
                        <MobileTaskCard
                            key={task.id}
                            task={task}
                            isDone={isDone}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                        />
                    ))}

                    {/* Mobile Add Task Card */}
                    {showAddCard && (
                        <Box
                            p={4}
                            borderTopWidth={tasks.length > 0 ? "1px" : "0"}
                            borderColor="gray.200"
                        >
                            <Stack gap={3}>
                                <HStack align="center">
                                    <Checkbox disabled />
                                    <Input
                                        placeholder="Write a task here..."
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Escape") handleCancel(); }}
                                        size="sm"
                                        variant="flushed"
                                        autoFocus
                                        borderColor="teal.400"
                                        flex="1"
                                    />
                                </HStack>
                                <Input
                                    type="date"
                                    value={newDueDate}
                                    onChange={(e) => setNewDueDate(e.target.value)}
                                    size="sm"
                                    borderColor="gray.300"
                                />
                                <select
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    style={{
                                        border: "1px solid #CBD5E0",
                                        borderRadius: "4px",
                                        padding: "6px 8px",
                                        fontSize: "14px",
                                        width: "100%",
                                        backgroundColor: "white",
                                    }}
                                >
                                    <option value="">No tag</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                                <Input
                                    placeholder="Add a note..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    size="sm"
                                    borderColor="gray.300"
                                    maxLength={150}
                                />
                                <HStack gap={2}>
                                    <Button
                                        size="sm"
                                        bg="#00C896"
                                        color="white"
                                        _hover={{ bg: "#00a67c" }}
                                        onClick={handleSave}
                                        disabled={!newTitle.trim()}
                                        flex="1"
                                    >
                                        <MdCheck />
                                        Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCancel} flex="1">
                                        <MdClose />
                                        Cancel
                                    </Button>
                                </HStack>
                            </Stack>
                        </Box>
                    )}
                </Stack>
            </AccordionItemContent>
        </AccordionItem>
    );
}