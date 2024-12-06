import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ChartSection = ({ chartData, deviceData, performanceData, chartOptions, colorMode }) => (
  <>
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      mb={6}
    >
      <Text fontSize="xl" fontWeight="semibold" mb={6}>User Growth Trend</Text>
      <Line data={chartData} options={chartOptions} />
    </MotionBox>

    <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={8}>
      <MotionBox
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        bg={colorMode === 'dark' ? 'gray.800' : 'white'}
        p={6}
        borderRadius="xl"
        boxShadow="lg"
      >
        <Text fontSize="xl" fontWeight="semibold" mb={6}>Weekly Performance</Text>
        <Bar data={performanceData} options={chartOptions} />
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        bg={colorMode === 'dark' ? 'gray.800' : 'white'}
        p={6}
        borderRadius="xl"
        boxShadow="lg"
      >
        <Text fontSize="xl" fontWeight="semibold" mb={6}>Device Distribution</Text>
        <Box height="300px">
          <Doughnut data={deviceData} options={{ ...chartOptions, maintainAspectRatio: false }} />
        </Box>
      </MotionBox>
    </Box>
  </>
);

export default ChartSection;