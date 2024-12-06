import React from 'react';
import { Tr, Td, HStack, IconButton, Text, Badge, Tooltip } from "@chakra-ui/react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const MotionTr = motion(Tr);

const PaymentTableRow = ({ payment, onView, onEdit, onDelete }) => {
  const statusColor = payment.status === "active" ? "green" : "red";
  
  return (
    <MotionTr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      _hover={{ bg: "gray.50" }}
    >
      <Td>
        <Text color="gray.700" fontWeight="medium">
          {payment.clientName}
        </Text>
      </Td>
      <Td>
        <Text color="gray.600">{payment.dateVersment}</Text>
      </Td>
      <Td>
        <Text color="gray.600">{payment.amountPaid}</Text>
      </Td>
      <Td>
        <Badge
          colorScheme={statusColor}
          px={2}
          py={1}
          borderRadius="full"
          textTransform="capitalize"
          bg={`${statusColor}.100`}
          color={`${statusColor}.700`}
        >
          {payment.status || 'Active'}
        </Badge>
      </Td>
      <Td>
        <HStack spacing={2} justifyContent="flex-end">
          <Tooltip label="View Details" hasArrow>
            <IconButton
              icon={<Eye size={16} />}
              variant="ghost"
              colorScheme="purple"
              size="sm"
              onClick={() => onView(payment)}
              _hover={{ transform: 'scale(1.1)', bg: 'purple.50' }}
            />
          </Tooltip>
          <Tooltip label="Edit" hasArrow>
            <IconButton
              icon={<Edit size={16} />}
              variant="ghost"
              colorScheme="purple"
              size="sm"
              onClick={() => onEdit(payment)}
              _hover={{ transform: 'scale(1.1)', bg: 'purple.50' }}
            />
          </Tooltip>
          <Tooltip label="Delete" hasArrow>
            <IconButton
              icon={<Trash2 size={16} />}
              variant="ghost"
              colorScheme="purple"
              size="sm"
              onClick={() => onDelete(payment._id)}
              _hover={{ transform: 'scale(1.1)', bg: 'red.50' }}
            />
          </Tooltip>
        </HStack>
      </Td>
    </MotionTr>
  );
};

export default PaymentTableRow;