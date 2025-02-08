import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, Alert } from '@mui/material';
import { FaMoneyBill, FaShoppingBag, FaUsers, FaGift } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { UserManagement } from '../components/admin/UserManagement';
import { ProductManagement } from '../components/admin/ProductManagement';
import { VBucksManagement } from '../components/admin/VBucksManagement';
import { GiftManagement } from '../components/admin/GiftManagement';
import { adminService } from '../services/adminService';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const handleCardClick = (section: string) => {
    setSelectedSection(section);
    setError(null);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'usuarios':
        return <UserManagement />;
      case 'productos':
        return <ProductManagement />;
      case 'vbucks':
        return <VBucksManagement />;
      case 'regalos':
        return <GiftManagement />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#141414',
      pt: { xs: 8, sm: 12 },
      pb: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 6,
          color: 'white'
        }}>
          <Typography variant="h4" component="h1">
            PANEL DE ADMINISTRACIÓN
          </Typography>
          <Button 
            onClick={handleLogout}
            variant="contained"
            sx={{ 
              backgroundColor: '#1a365d',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#2a4365'
              }
            }}
          >
            CERRAR SESIÓN
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!selectedSection ? (
          <Grid container spacing={3}>
            {[
              {
                title: 'GESTIONAR VBUCKS',
                description: 'Configura y actualiza las tasas de VBucks',
                icon: <FaMoneyBill size={40} style={{ color: '#fff' }} />,
                section: 'vbucks'
              },
              {
                title: 'GESTIONAR PRODUCTOS',
                description: 'Administra los productos de Roblox',
                icon: <FaShoppingBag size={40} style={{ color: '#fff' }} />,
                section: 'productos'
              },
              {
                title: 'GESTIONAR USUARIOS',
                description: 'Administra los usuarios y sus permisos',
                icon: <FaUsers size={40} style={{ color: '#fff' }} />,
                section: 'usuarios'
              },
              {
                title: 'GESTIONAR REGALOS',
                description: 'Administra las solicitudes de regalos',
                icon: <FaGift size={40} style={{ color: '#fff' }} />,
                section: 'regalos'
              }
            ].map((item) => (
              <Grid item xs={12} md={6} key={item.section}>
                <Card 
                  onClick={() => handleCardClick(item.section)}
                  sx={{ 
                    background: '#1a1a1a',
                    color: '#fff',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid #2d2d2d',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                      borderColor: '#3182ce'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      textAlign: 'center',
                      gap: 2
                    }}>
                      {item.icon}
                      <Typography variant="h6">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                        {item.description}
                      </Typography>
                      <Button 
                        variant="contained"
                        sx={{ 
                          mt: 'auto',
                          backgroundColor: '#1a365d',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: '#2a4365'
                          }
                        }}
                      >
                        {item.title}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            <Button 
              onClick={() => setSelectedSection(null)}
              variant="contained"
              sx={{ 
                mb: 3,
                backgroundColor: '#1a365d',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#2a4365'
                }
              }}
            >
              Volver al Panel
            </Button>
            {renderSection()}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminPanel;
