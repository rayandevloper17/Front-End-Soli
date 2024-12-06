import React from 'react';
import { Box, Flex, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Progress } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const StatCard = ({ stat, index, colorMode }) => (
  <MotionBox
    key={stat.title}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    bg={colorMode === 'dark' ? 'gray.800' : 'white'}
    p={6}
    borderRadius="xl"
    boxShadow="lg"
    _hover={{ 
      transform: 'translateY(-5px)',
      transition: 'transform 0.3s ease',
      boxShadow: 'xl'
    }}
  >
    <Flex direction="column">
      <Flex align="center" mb={4}>
        <Box
          p={3}
          borderRadius="lg"
          bg={`${stat.color}20`}
          color={stat.color}
        >
          <stat.icon size={24} />
        </Box>
      </Flex>
      <Stat>
        <StatLabel color="gray.500">{stat.title}</StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">{stat.count}</StatNumber>
        <StatHelpText>
          <StatArrow type={stat.trend.startsWith('+') ? 'increase' : 'decrease'} />
          {stat.trend}
        </StatHelpText>
      </Stat>
      <Progress 
        value={parseInt(stat.trend)} 
        size="xs" 
        colorScheme={stat.trend.startsWith('+') ? 'green' : 'red'} 
        mt={2}
      />
    </Flex>
  </MotionBox>
);

export default StatCard;