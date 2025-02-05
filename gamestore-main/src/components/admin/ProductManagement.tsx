import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { adminService, RobloxProduct } from '../../services/adminService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const ProductManagement = () => {
  const [products, setProducts] = useState<RobloxProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    image: null as File | null,
    imagePreview: '' as string,
    amount: '',
    type: 'vbucks'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await adminService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos');
    }
  };

  const handleCreateProduct = async () => {
    try {
      // Validar campos requeridos
      if (!newProduct.title.trim()) {
        setError('El título es requerido');
        return;
      }
      if (!newProduct.description.trim()) {
        setError('La descripción es requerida');
        return;
      }
      if (!newProduct.price || Number(newProduct.price) <= 0) {
        setError('El precio debe ser mayor a 0');
        return;
      }
      if (!newProduct.type) {
        setError('El tipo de producto es requerido');
        return;
      }
      if (!newProduct.image) {
        setError('La imagen es requerida');
        return;
      }

      const formData = new FormData();
      formData.append('title', newProduct.title.trim());
      formData.append('description', newProduct.description.trim());
      formData.append('price', newProduct.price.toString());
      formData.append('type', newProduct.type);
      
      if (newProduct.amount) {
        formData.append('amount', newProduct.amount.toString());
      }
      
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      await adminService.createProduct(formData);
      setSuccess('Producto creado exitosamente');
      setOpen(false);
      loadProducts();
      setNewProduct({
        title: '',
        description: '',
        price: '',
        image: null,
        imagePreview: '',
        amount: '',
        type: 'vbucks'
      });
    } catch (err: any) {
      console.error('Error al crear el producto:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Error al crear el producto';
      setError(errorMessage);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await adminService.deleteProduct(id);
      setSuccess('Producto eliminado exitosamente');
      loadProducts();
    } catch (err) {
      setError('Error al eliminar el producto');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h5" component="h2">
          Gestión de Productos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Nuevo Producto
        </Button>
      </Box>

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

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)',
                borderRadius: '16px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                }
              }}
            >
              {product.image_url && (
                <CardMedia
                  component="img"
                  sx={{
                    height: 200,
                    objectFit: 'contain',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '16px 16px 0 0',
                    padding: '1rem'
                  }}
                  image={`${API_URL}${product.image_url}`}
                  alt={product.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    mb: 2
                  }}
                >
                  {product.title}
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#2ecc71',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  Precio: ${product.price}
                </Typography>
                {product.amount && (
                  <Typography 
                    sx={{ 
                      color: '#7f8c8d',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>Cantidad:</span> {product.amount}
                  </Typography>
                )}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#34495e',
                    mb: 2,
                    lineHeight: 1.6
                  }}
                >
                  {product.description}
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#7f8c8d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>Tipo:</span> {product.type}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="medium" 
                  color="error"
                  variant="contained"
                  onClick={() => handleDeleteProduct(product.id)}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(231, 76, 60, 0.2)',
                    }
                  }}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Producto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título del Producto"
            fullWidth
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Precio"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Cantidad (opcional)"
            type="number"
            fullWidth
            value={newProduct.amount}
            onChange={(e) => setNewProduct({ ...newProduct, amount: e.target.value })}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setNewProduct({
                    ...newProduct,
                    image: file,
                    imagePreview: reader.result as string
                  });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <label htmlFor="raised-button-file">
            <Button variant="outlined" component="span" fullWidth sx={{ mt: 1, mb: 1 }}>
              Subir Imagen
            </Button>
          </label>
          {newProduct.imagePreview && (
            <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
              <img 
                src={newProduct.imagePreview} 
                alt="Vista previa" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  objectFit: 'contain' 
                }} 
              />
            </Box>
          )}
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={newProduct.type}
              label="Tipo"
              onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
            >
              <MenuItem value="vbucks">VBucks</MenuItem>
              <MenuItem value="item">Item</MenuItem>
              <MenuItem value="skin">Skin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateProduct} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
