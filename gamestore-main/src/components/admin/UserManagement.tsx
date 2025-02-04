import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Box,
  Alert,
  Snackbar,
  FormControlLabel
} from '@mui/material';
import { adminService, User } from '../../services/adminService';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      // Convertir is_admin de número a booleano
      const formattedUsers = data.map(user => ({
        ...user,
        is_admin: Boolean(user.is_admin)
      }));
      setUsers(formattedUsers || []);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error('Error loading users:', err);
    }
  };

  const handleAdminToggle = async (userId: number, currentValue: boolean) => {
    try {
      await adminService.updateUserAdmin(userId, !currentValue);
      setSuccess('Permisos de administrador actualizados exitosamente');
      loadUsers();
    } catch (err) {
      setError('Error al actualizar los permisos de administrador');
      console.error('Error updating user role:', err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Gestión de Usuarios
      </Typography>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Fecha de Registro</TableCell>
              <TableCell>Administrador</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.is_admin}
                        onChange={() => handleAdminToggle(user.id, user.is_admin)}
                        color="primary"
                      />
                    }
                    label={user.is_admin ? 'Administrador' : 'Usuario'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
