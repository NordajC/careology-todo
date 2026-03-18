import { Box, Flex, Stack, Text, Badge, IconButton, Input, Button, HStack, DialogPositioner, DialogBackdrop } from "@chakra-ui/react";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogCloseTrigger,
} from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { MdDeleteOutline, MdEdit, MdCheck, MdClose } from "react-icons/md";
import { useState } from "react";
import type { Task } from "@/types/task";
import type { UpdateTaskInput } from "@/types/index";
import { getTagStyle } from "@/utils/tagStyles";
import { createPortal } from "react-dom";

interface MobileTaskCardProps {
    task: Task;
    isDone?: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, input: UpdateTaskInput) => void;
}

export function MobileTaskCard({ task, isDone, onToggle, onDelete, onUpdate }: MobileTaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDueDate, setEditDueDate] = useState(task.dueDate ?? "");
    const [editTag, setEditTag] = useState(task.tag ?? "");
    const [editNote, setEditNote] = useState(task.note ?? "");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const tagStyle = task.tag ? getTagStyle(task.tag) : null;

    // Only show weather if city was actually detected
    const noteContent = task.weather?.city
        ? `(${task.weather.icon ?? "☀️"} ${task.weather.temp})`
        : task.note ?? "";

    function handleSave() {
        onUpdate(task.id, {
            title: editTitle.trim() || task.title,
            dueDate: editDueDate || undefined,
            tag: editTag || undefined,
            note: editNote || undefined,
        });
        setIsEditing(false);
    }

    function handleCancel() {
        setEditTitle(task.title);
        setEditDueDate(task.dueDate ?? "");
        setEditTag(task.tag ?? "");
        setEditNote(task.note ?? "");
        setIsEditing(false);
    }

    return (
        <>
            <Box
                p={4}
                borderBottomWidth="1px"
                borderColor="gray.200"
                _last={{ borderBottomWidth: 0 }}
            >
                {isEditing ? (
                    <Stack gap={3}>
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            size="sm"
                            autoFocus
                            borderColor="teal.400"
                            placeholder="Task name"
                        />
                        <Input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            size="sm"
                            borderColor="gray.300"
                        />
                        <select
                            value={editTag}
                            onChange={(e) => setEditTag(e.target.value)}
                            style={{
                                border: "1px solid #CBD5E0",
                                borderRadius: "4px",
                                padding: "6px 8px",
                                fontSize: "14px",
                                width: "100%",
                                backgroundColor: "white",
                                height: "36px"
                            }}
                        >
                            <option value="">No tag</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <Input
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            size="sm"
                            borderColor="gray.300"
                            placeholder="Add a note..."
                            maxLength={150}
                        />
                        <HStack gap={2}>
                            <Button size="sm" bg="#00C896" color="white" _hover={{ bg: "#00a67c" }} onClick={handleSave} flex="1">
                                <MdCheck />
                                Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel} flex="1" color="grey" border="none">
                                <MdClose />
                                Cancel
                            </Button>
                        </HStack>
                    </Stack>
                ) : (
                    <Flex align="flex-start" gap={4}>
                        <Box pt={1}>
                            <Checkbox
                                checked={isDone}
                                colorPalette="teal"
                                size="lg"
                                onChange={() => onToggle(task.id)}
                            />
                        </Box>
                        <Stack gap={1} flex="1">
                            <Flex justify="space-between" align="center">
                                <Text
                                    fontSize="md"
                                    color={isDone ? "gray.500" : "black"}
                                    textDecoration={isDone ? "line-through" : "none"}
                                    flex="1"
                                    mr={2}
                                >
                                    {task.title}
                                </Text>
                                <HStack gap={1}>
                                    <IconButton aria-label="Edit" size="xs" variant="ghost" onClick={() => setIsEditing(true)}>
                                        <MdEdit color="#4A5568" />
                                    </IconButton>
                                    <IconButton aria-label="Delete" size="xs" variant="ghost" onClick={() => setShowDeleteDialog(true)}>
                                        <MdDeleteOutline color="#4A5568" />
                                    </IconButton>
                                </HStack>
                            </Flex>

                            {task.dueDate && (
                                <Text fontSize="sm" color="gray.500">
                                    {new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short"
                                    })}
                                </Text>
                            )}

                            {noteContent && (
                                <Text fontSize="sm" color="gray.500">Note: {noteContent}</Text>
                            )}

                            {tagStyle && task.tag && (
                                <Badge
                                    bg={tagStyle.bg}
                                    color={tagStyle.color}
                                    variant="solid"
                                    size="sm"
                                    alignSelf="flex-start"
                                    mt={1}
                                    opacity={isDone ? 0.7 : 1}
                                >
                                    {task.tag}
                                </Badge>
                            )}
                        </Stack>
                    </Flex>
                )}
            </Box>

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && createPortal(
                <DialogRoot open={showDeleteDialog} onOpenChange={(e) => setShowDeleteDialog(e.open)}>
                    <DialogBackdrop />
                    <DialogPositioner
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="fixed"
                        inset="0"
                    >
                        <DialogContent bg="white">
                            <DialogHeader color="gray.800">Delete Task</DialogHeader>
                            <DialogCloseTrigger />
                            <DialogBody color="gray.700">
                                Are you sure you want to delete <strong>"{task.title}"</strong>? This cannot be undone.
                            </DialogBody>
                            <DialogFooter>
                                <HStack gap={3}>
                                    <Button variant="outline" color="gray.700" onClick={() => setShowDeleteDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        bg="red.500"
                                        color="white"
                                        _hover={{ bg: "red.600" }}
                                        onClick={() => { onDelete(task.id); setShowDeleteDialog(false); }}
                                    >
                                        Delete
                                    </Button>
                                </HStack>
                            </DialogFooter>
                        </DialogContent>
                    </DialogPositioner>
                </DialogRoot>,
                document.body
            )}
        </>
    );
}