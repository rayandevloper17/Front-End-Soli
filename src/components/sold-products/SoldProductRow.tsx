import React from 'react';
import {
  Tr,
  Td,
  Badge,
  Flex,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { SoldProduct } from './types';

interface SoldProductRowProps {
  product: SoldProduct;
  onUpdate: (product: SoldProduct) => void;
  onDelete: (product: SoldProduct) => void;
}

export const SoldProductRow: React.FC<SoldProductRowProps> = ({
  product,
  onUpdate,
  onDelete,
}) => {
  return (
    <Tr
      _hover={{ bg: "gray.50" }}
      transition="all 0.2s"
      borderBottom="1px"
      borderColor="gray.100"
    >
      <Td fontWeight="medium">{product.Product}</Td>
      <Td color="gray.600">{product.Norder}</Td>
      <Td color="gray.600">
        {new Date(product.Dateorder).toLocaleDateString()}
      </Td>
      <Td>
        <Badge
          px="2"
          py="1"
          rounded="full"
          colorScheme="green"
          bg="green.100"
          color="green.800"
          fontSize="xs"
        >
          Active
        </Badge>
      </Td>
      <Td isNumeric fontWeight="medium" color="gray.700">
        ${product.Pricepay}
      </Td>
      <Td>
        <Flex justify="flex-end" gap="3">
          <Tooltip 
            label="View Details" 
            hasArrow 
            placement="top"
          >
            <IconButton
              aria-label="View details"
              icon={<FileText size={16} />}
              size="sm"
              variant="ghost"
              colorScheme="gray"
              _hover={{
                transform: 'translateY(-2px)',
                bg: 'gray.100'
              }}
              transition="all 0.2s"
            />
          </Tooltip>
          <Tooltip 
            label="Edit" 
            hasArrow 
            placement="top"
          >
            <IconButton
              aria-label="Edit product"
              icon={<Pencil size={16} />}
              size="sm"
              variant="ghost"
              colorScheme="purple"
              onClick={() => onUpdate(product)}
              _hover={{
                transform: 'translateY(-2px)',
                bg: 'purple.50'
              }}
              transition="all 0.2s"
            />
          </Tooltip>
          <Tooltip 
            label="Delete" 
            hasArrow 
            placement="top"
          >
            <IconButton
              aria-label="Delete product"
              icon={<Trash2 size={16} />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => onDelete(product)}
              _hover={{
                transform: 'translateY(-2px)',
                bg: 'red.50'
              }}
              transition="all 0.2s"
            />
          </Tooltip>
        </Flex>
      </Td>
    </Tr>
  );
};