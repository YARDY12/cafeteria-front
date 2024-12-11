import React, { useState } from 'react';
import { 
  Button, FormControl, FormLabel, Input, useToast, VStack, 
  Image, Text, Heading, InputGroup, InputLeftElement
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUser, FaLock } from 'react-icons/fa';
import AuthService from '../services/AuthService';
import { User } from '../types/Auth';
import { Box } from '@chakra-ui/react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const MotionBox = motion(Box as any); // Desactiva el chequeo de tipos

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.login(username, password);

      if (response.user) {
        toast({
          title: '¡Bienvenido!',
          description: 'Login exitoso. ¡Disfruta tu café!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onLoginSuccess(response.user);
      } else {
        throw new Error('No se pudo autenticar al usuario');
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast({
        title: 'Error en login',
        description: 'Usuario o contraseña incorrectos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      bgGradient="linear(to-b, #D2B48C, #8B4513)"
      margin="0"
      overflow="hidden"
    >
      <MotionBox
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        width="100%"
        maxWidth="400px"
        padding="30px"
        borderRadius="20px"
        boxShadow="0 10px 25px rgba(0, 0, 0, 0.2)"
        backgroundColor="rgba(255, 248, 220, 0.9)"
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        <MotionBox
          position="absolute"
          top="-50px"
          left="-50px"
          width="100px"
          height="100px"
          borderRadius="50%"
          backgroundColor="#A0522D"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <MotionBox
          position="absolute"
          bottom="-30px"
          right="-30px"
          width="80px"
          height="80px"
          borderRadius="50%"
          backgroundColor="#D2B48C"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <VStack spacing={6} position="relative" zIndex={1}>
          <MotionBox
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Image
              src="https://scontent.flim1-2.fna.fbcdn.net/v/t39.30808-6/297028427_104101122405950_7133737936724523807_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=u9vr9nbXS6oQ7kNvgGfhKk6&_nc_zt=23&_nc_ht=scontent.flim1-2.fna&_nc_gid=ATt9eJLD1DnkpazdK_kZjOo&oh=00_AYAWyfSO071q1jA_OHVDIs5Pj2n0RCpCEAoDbnJLQ0wiow&oe=6753E0B4"
              alt="Cafetería Agosto 18"
              borderRadius="full"
              boxSize="100px"
              objectFit="cover"
              border="3px solid #A0522D"
            />
          </MotionBox>
          <Heading as="h1" size="xl" color="#8B4513">
            Cafetería Agosto 18
          </Heading>
          <Text fontSize="lg" color="#A0522D">
            Inicia sesión para disfrutar
          </Text>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel color="#8B4513">Nombre de usuario</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<FaUser color="#A0522D" />} />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    border="2px solid #A0522D"
                    borderRadius="full"
                    focusBorderColor="#8B4513"
                    placeholder="Ingresa tu usuario"
                    _placeholder={{ color: '#D2B48C' }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel color="#8B4513">Contraseña</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<FaLock color="#A0522D" />} />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    border="2px solid #A0522D"
                    borderRadius="full"
                    focusBorderColor="#8B4513"
                    placeholder="Ingresa tu contraseña"
                    _placeholder={{ color: '#D2B48C' }}
                  />
                </InputGroup>
              </FormControl>
              <Button
                type="submit"
                backgroundColor="#A0522D"
                color="white"
                _hover={{ backgroundColor: "#8B4513" }}
                isLoading={isLoading}
                width="full"
                borderRadius="full"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                transition="all 0.3s ease"
                _active={{
                  transform: 'scale(0.98)',
                  boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                Iniciar sesión
              </Button>
            </VStack>
          </form>
        </VStack>
      </MotionBox>
    </Box>
  );
};

export default Login;

