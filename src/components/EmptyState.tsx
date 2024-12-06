import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import { AlertCircle } from "lucide-react";

export const EmptyState: React.FC = () => {
  return (
    <Box 
      p={8} 
      textAlign="center" 
      bg="white" 
      rounded="lg" 
      border="1px" 
      borderColor="gray.200"
      shadow="sm"
    >
      <AlertCircle size={40} className="mx-auto mb-4 text-gray-400" />
      <Text color="gray.600">No sold products available yet.</Text>
    </Box>
  );
};