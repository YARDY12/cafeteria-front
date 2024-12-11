import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  VStack,
  Box,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import UserService from '../services/UserService';
import { User } from '../types/Auth';

interface UserTableProps {
  onEditUser: (user: User) => void;
  onDeleteUser: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ onEditUser, onDeleteUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const deleteDialog = useDisclosure();
  const cancelRef = React.useRef(null);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await UserService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    deleteDialog.onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await UserService.deleteUser(deleteId);
        setUsers(users.filter(user => user.id !== deleteId));
        onDeleteUser(deleteId);
        toast({
          title: 'Usuario eliminado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el usuario',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    deleteDialog.onClose();
  };

  return (
    <VStack spacing={[4, 6, 8]} w="100%">
      <Box overflowX="auto" w="100%" px={[2, 4, 6]}>
        {users.length > 0 ? (
          <Table variant="simple" size={['sm', 'md']}>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Usuario</Th>
                <Th>Nombre</Th>
                <Th>Apellido</Th>
                <Th>Email</Th>
                <Th>Rol</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.nombre}</Td>
                  <Td>{user.apellido}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.roles && user.roles.length > 0 ? user.roles[0].name : 'N/A'}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      mr={2}
                      onClick={() => onEditUser(user)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteClick(user.id!)}
                    >
                      Eliminar
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text>No hay usuarios registrados</Text>
        )}
      </Box>

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Eliminar Usuario</AlertDialogHeader>
            <AlertDialogBody>
              ¿Está seguro? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDialog.onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default UserTable;

