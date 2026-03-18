import { Table, Text, HStack } from "@chakra-ui/react";
import {
    MdOutlineCalendarToday,
    MdOutlineSell,
    MdOutlineNotes,
    MdNotes,
} from "react-icons/md";

interface DesktopTableHeaderProps {
    showDragColumn?: boolean;
}

export function DesktopTableHeader({ showDragColumn }: DesktopTableHeaderProps) {
    return (
        <Table.Header bg="white">
            <Table.Row bg="white" borderColor="gray.200">
                {/* Drag handle column — only shown for sortable lists */}
                {showDragColumn && (
                    <Table.ColumnHeader w="32px" bg="white" />
                )}
                {/* Checkbox */}
                <Table.ColumnHeader w="40px" bg="white">
                </Table.ColumnHeader>
                {/* Task name — takes most space */}
                <Table.ColumnHeader bg="white">
                    <HStack gap={1}>
                        <MdNotes color="#4A5568" />
                        <Text color="gray.700">Task name</Text>
                    </HStack>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="140px" bg="white">
                    <HStack gap={1}>
                        <MdOutlineCalendarToday color="#4A5568" />
                        <Text color="gray.700">Due date</Text>
                    </HStack>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="120px" bg="white">
                    <HStack gap={1}>
                        <MdOutlineSell color="#4A5568" />
                        <Text color="gray.700">Tag</Text>
                    </HStack>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="160px" bg="white">
                    <HStack gap={1}>
                        <MdOutlineNotes color="#4A5568" />
                        <Text color="gray.700">Note</Text>
                    </HStack>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="80px" textAlign="center" color="gray.700" bg="white">
                    Actions
                </Table.ColumnHeader>
            </Table.Row>
        </Table.Header>
    );
}