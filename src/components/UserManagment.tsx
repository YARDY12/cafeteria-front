import React, { useState } from 'react';
import { Box, Button, Flex, useDisclosure, useToast } from '@chakra-ui/react';
import UserTable from './UserTable';
import UserForm from './UserForm';
import { User } from '../types/Auth';


const UserManagement: React.FC = () => {
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const formModal = useDisclosure();
  const toast = useToast();


  const handleAddUser = () => {
    setUserToEdit(undefined);
    formModal.onOpen();
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    formModal.onOpen();
  };

  const handleUserAdded = (_newUser: User) => {
    toast({
      title: 'Usuario creado',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    formModal.onClose();
  };

  const handleUserUpdated = (_updatedUser: User) => {
    toast({
      title: 'Usuario actualizado',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    formModal.onClose();
  };

  const handleDeleteUser = (_id: number) => {
    // La lógica de eliminación ya está en UserTable, 
    // pero podríamos añadir alguna lógica adicional aquí si fuera necesario
  };
  return (
    <Box>
      <Flex w="100%" justify="flex-end" mb={4}>
        <Button colorScheme="green" onClick={handleAddUser}>
          Agregar Usuario
        </Button>
      </Flex>

      <UserTable onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />

      <UserForm
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
        onUserAdded={handleUserAdded}
        onUserUpdated={handleUserUpdated}
        userToEdit={userToEdit}
      />
    </Box>
  );
};

export default UserManagement;

