import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, Alert } from '@mui/material';
import { FaMoneyBill, FaShoppingBag, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { UserManagement } from '../components/admin/UserManagement';
import { ProductManagement } from '../components/admin/ProductManagement';
import { VBucksManagement } from '../components/admin/VBucksManagement';
import { adminService } from '../services/adminService';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      // Intentar obtener datos de usuario para verificar que el token es válido y es admin
      await adminService.getUsers();
    } catch (err) {
      console.error('Error de autenticación:', err);
      localStorage.removeItem('token'); // Limpiar token inválido
      navigate('/admin/login');
    }
  };

  const handleCardClick = (section: string) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'usuarios':
        return <UserManagement />;
      case 'productos':
        return <ProductManagement />;
      case 'vbucks':
        return <VBucksManagement />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#FAFAFA',
      color: '#1a1a1a',
      pt: 12,
      pb: 4
    }}>
      <Container>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 6
        }}>
          <Typography variant="h4" component="h1" sx={{ color: '#1a1a1a' }}>
            PANEL DE ADMINISTRACIÓN
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleLogout}
            sx={{ 
              background: '#C7CAC6',
              color: '#1a1a1a',
              px: 3,
              py: 1,
              borderRadius: '8px',
              border: '2px solid transparent',
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                background: '#4dd5ff',
                color: 'white',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 15px rgba(77, 213, 255, 0.3)'
              }
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>

        {!activeSection ? (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card 
                onClick={() => handleCardClick('usuarios')}
                sx={{ 
                  background: '#C7CAC6',
                  color: '#1a1a1a',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FaUsers size={24} style={{ marginRight: '8px' }} />
                    <Typography variant="h6">
                      Gestionar Usuarios
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Administra los usuarios y sus roles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card 
                onClick={() => handleCardClick('productos')}
                sx={{ 
                  background: '#C7CAC6',
                  color: '#1a1a1a',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FaShoppingBag size={24} style={{ marginRight: '8px' }} />
                    <Typography variant="h6">
                      Gestionar Productos
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Administra el catálogo de productos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card 
                onClick={() => handleCardClick('vbucks')}
                sx={{ 
                  background: '#C7CAC6',
                  color: '#1a1a1a',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FaMoneyBill size={24} style={{ marginRight: '8px' }} />
                    <Typography variant="h6">
                      Gestionar VBucks
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Configura las tasas de VBucks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Box>
            <Button
              variant="outlined"
              onClick={() => setActiveSection('')}
              sx={{ mb: 4 }}
            >
              Volver al Panel Principal
            </Button>
            {renderContent()}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminPanel;
