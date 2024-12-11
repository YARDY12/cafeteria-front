import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Select,
  Box,
} from '@chakra-ui/react';
import UserService from '../services/UserService';
import { User } from '../types/Auth';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
  onUserUpdated: (user: User) => void;
  userToEdit?: User;
}

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onUserAdded,
  onUserUpdated,
  userToEdit
}) => {
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    nombre: string;
    apellido: string;
    email: string;
    roleId: string;
  }>({
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    email: '',
    roleId: '1'
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        username: userToEdit.username,
        password: '',
        nombre: userToEdit.nombre,
        apellido: userToEdit.apellido,
        email: userToEdit.email,
        roleId: userToEdit.roles && userToEdit.roles.length > 0 && userToEdit.roles[0].name === 'ADMIN' ? '2' : '1'
      });
      setIsEditMode(true);
    } else {
      resetForm();
      setIsEditMode(false);
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditMode && userToEdit) {
        const updateData: Partial<typeof formData> = {
          ...formData,
          roleId: formData.roleId
        };
        
        if (!formData.password) {
          delete updateData.password;
        }

        const response = await UserService.updateUser(userToEdit.id!, updateData);
        onUserUpdated(response.data);
        toast({
          title: 'Usuario actualizado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const response = await UserService.createUser({
          ...formData,
          roleId: parseInt(formData.roleId)
        });
        onUserAdded(response.data);
        toast({
          title: 'Usuario creado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: `No se pudo ${isEditMode ? 'actualizar' : 'crear'} el usuario`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      nombre: '',
      apellido: '',
      email: '',
      roleId: '1'
    });
    setIsEditMode(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditMode ? 'Actualizar Usuario' : 'Registrar Usuario'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w={['100%', '90%', '70%', '50%']} maxW="md" mx="auto">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Usuario</FormLabel>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </FormControl>
                <FormControl isRequired={!isEditMode}>
                  <FormLabel>{isEditMode ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</FormLabel>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder={isEditMode ? 'Dejar en blanco para mantener la actual' : ''}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Apellido</FormLabel>
                  <Input
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Rol</FormLabel>
                  <Select 
                    value={formData.roleId}
                    onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                  >
                    <option value="1">Usuario</option>
                    <option value="2">Administrador</option>
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText="Guardando..."
                >
                  {isEditMode ? 'Actualizar Usuario' : 'Registrar Usuario'}
                </Button>
              </VStack>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserForm;

