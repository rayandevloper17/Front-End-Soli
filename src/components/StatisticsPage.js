import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Flex, Text, useColorMode, IconButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { TrendingUpIcon, TrendingDownIcon, UsersIcon, ShoppingCartIcon, PercentIcon, ActivityIcon, SunIcon, MoonIcon } from 'lucide-react';
import "./CSs/StatisticsPage.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Tooltip, Legend);

const MotionBox = motion(Box);

const StatisticsPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const statsData = [
    { title: 'Active Users', count: '1,234', trend: '+12.5%', icon: UsersIcon, color: '#6366f1' },
    { title: 'Total Sales', count: '$45,678', trend: '+8.2%', icon: ShoppingCartIcon, color: '#10b981' },
    { title: 'Conversion Rate', count: '3.2%', trend: '-2.4%', icon: PercentIcon, color: '#f59e0b' },
    { title: 'Avg. Session', count: '4m 32s', trend: '+5.3%', icon: ActivityIcon, color: '#8b5cf6' }
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'User Growth',
      data: [3000, 3500, 4200, 4800, 5200, 6000],
      borderColor: colorMode === 'dark' ? '#6366f1' : '#4f46e5',
      backgroundColor: colorMode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: colorMode === 'dark' ? '#e2e8f0' : '#1a202c',
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: colorMode === 'dark' ? 'rgba(226, 232, 240, 0.1)' : 'rgba(26, 32, 44, 0.1)'
        },
        ticks: {
          color: colorMode === 'dark' ? '#e2e8f0' : '#1a202c'
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          color: colorMode === 'dark' ? '#e2e8f0' : '#1a202c'
        }
      }
    }
  };

  return (
    <ChakraProvider>
      <Box
        minH="100vh"
        bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
        color={colorMode === 'dark' ? 'white' : 'gray.800'}
        transition="all 0.3s ease"
        p={6}
      >
        <Flex justify="space-between" align="center" mb={8}>
          <Text
            fontSize="3xl"
            fontWeight="bold"
            bgGradient={colorMode === 'dark' ? 'linear(to-r, blue.400, purple.400)' : 'linear(to-r, blue.600, purple.600)'}
            bgClip="text"
          >
            Analytics Dashboard
          </Text>
          <IconButton
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            colorScheme="blue"
            aria-label="Toggle theme"
          />
        </Flex>

        <Flex wrap="wrap" gap={6} mb={8}>
          {statsData.map((stat, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              flex="1"
              minW="250px"
              bg={colorMode === 'dark' ? 'gray.800' : 'white'}
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              _hover={{ transform: 'translateY(-5px)', transition: 'transform 0.3s ease' }}
            >
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
              <Text color="gray.500" fontSize="sm" mb={2}>{stat.title}</Text>
              <Text fontSize="2xl" fontWeight="bold" mb={2}>{stat.count}</Text>
              <Flex align="center" color={stat.trend.startsWith('+') ? 'green.400' : 'red.400'}>
                {stat.trend.startsWith('+') ? <TrendingUpIcon size={16} /> : <TrendingDownIcon size={16} />}
                <Text ml={1} fontSize="sm">{stat.trend}</Text>
              </Flex>
            </MotionBox>
          ))}
        </Flex>

        <Box
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          p={6}
          borderRadius="xl"
          boxShadow="lg"
          mb={8}
        >
          <Text fontSize="xl" fontWeight="semibold" mb={6}>User Growth Trend</Text>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default StatisticsPage;