import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Check, Gift, LogOut } from 'lucide-react';

const CheckoutSteps = ({ currentStep, isAuthenticated }: { currentStep: number, isAuthenticated: boolean }) => {
  const steps = [
    { title: 'Resumen', description: 'Detalles del producto' },
    ...(!isAuthenticated ? [{ title: 'Usuario', description: 'Información de usuario' }] : []),
    { title: 'Pago', description: 'Confirmar y pagar' }
  ];

  return (
    <div className="flex justify-between">
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;

        return (
          <div key={step.title} className="flex-1">
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const OrderSummary = ({ item, onContinue }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">Detalles del Producto</h2>
    <div className="flex gap-8 mb-8">
      <div className="w-1/3">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={item.image}
            alt={item.displayName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.displayName}</h3>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Gift className="w-5 h-5 text-primary-500" />
            <span>Regalo Especial</span>
          </div>
          <p className="text-gray-600">Cantidad: 1</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-primary-600">{item.price}</span>
            <span className="text-gray-500">V-Bucks</span>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
      <button
        onClick={() => window.history.back()}
        className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        Volver a la tienda
      </button>
      <button
        onClick={onContinue}
        className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
      >
        Continuar
      </button>
    </div>
  </div>
);

const UserInformation = ({ onContinue, onBack }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor ingresa tu nombre de usuario');
      return;
    }
    onContinue(username);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Información de Usuario</h2>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de Usuario de Fortnite
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            placeholder="Ingresa tu usuario de Fortnite"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};

const Payment = ({ item, username, onBack }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">Resumen de la Orden</h2>
    <div className="max-w-xl mx-auto">
      <div className="space-y-4 mb-8">
        <div className="flex justify-between py-4 border-b border-gray-100">
          <span className="text-gray-600">Producto</span>
          <span className="font-medium text-gray-900">{item.displayName}</span>
        </div>
        <div className="flex justify-between py-4 border-b border-gray-100">
          <span className="text-gray-600">Usuario de Fortnite</span>
          <span className="font-medium text-gray-900">{username}</span>
        </div>
        <div className="flex justify-between py-4 border-b border-gray-100">
          <span className="text-gray-600">Precio</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{item.price}</span>
            <span className="text-gray-500">V-Bucks</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-6 rounded-2xl mb-8">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Total a Pagar</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-primary-600">{item.price}</span>
            <span className="text-gray-500">V-Bucks</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={() => alert('¡Pago procesado!')}
          className="px-12 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold text-lg shadow-lg shadow-primary-600/20"
        >
          Pagar
        </button>
      </div>
    </div>
  </div>
);

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { items } = useCart();
  const item = items[0]; // Asumimos que solo hay un item en el carrito

  // Obtener información del usuario del localStorage
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    if (!item) {
      navigate('/shop');
    }
    // Si hay un usuario autenticado, establecer su nombre de usuario
    if (user) {
      setUsername(user.username);
    }
  }, [item, navigate, user]);

  const handleContinue = () => {
    if (user) {
      // Si el usuario está autenticado, saltar directamente al paso de pago
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleUserSubmit = (username: string) => {
    setUsername(username);
    setStep(3);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  if (!item) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <CheckoutSteps currentStep={step} isAuthenticated={!!user} />
          
          {step === 1 && <OrderSummary item={item} onContinue={handleContinue} />}
          {step === 2 && !user && (
            <UserInformation onContinue={handleUserSubmit} onBack={handleBack} />
          )}
          {step === 3 && <Payment item={item} username={username} onBack={handleBack} />}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
