import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from "@chakra-ui/react";
import { SoldProduct } from './types';
import { SoldProductRow } from './SoldProductRow.tsx';

interface SoldProductsTableProps {
  products: SoldProduct[];
  onUpdate: (product: SoldProduct) => void;
  onDelete: (product: SoldProduct) => void;
}

export const SoldProductsTable: React.FC<SoldProductsTableProps> = ({
  products,
  onUpdate,
  onDelete,
}) => {
  return (
    <TableContainer
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      overflow="hidden"
    >
      <Table variant="simple">
        <Thead bg="grey.90">
          <Tr>
            <Th>Product</Th>
            <Th>Order No.</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th isNumeric>Price</Th>
            <Th textAlign="right">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <SoldProductRow
              key={product._id}
              product={product}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};