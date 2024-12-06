import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Divider,
} from "@chakra-ui/react";

const PaymentDetailsModal = ({ isOpen, onClose, payment }) => {
  if (!payment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader
          bg="purple.500"
          color="white"
          borderTopRadius="md"
          fontSize="lg"
        >
          Payment Details
        </ModalHeader>
        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium" color="gray.600">Client</Text>
              <Text>{payment.clientName}</Text>
            </HStack>
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="medium" color="gray.600">Amount</Text>
              <Text color="green.500" fontWeight="semibold">
                ${payment.amountPaid}
              </Text>
            </HStack>
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="medium" color="gray.600">Date</Text>
              <Text>{new Date(payment.dateVersment).toLocaleDateString()}</Text>
            </HStack>
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="medium" color="gray.600">Note</Text>
              <Text>{payment.note}</Text>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="purple" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentDetailsModal;