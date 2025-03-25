
// API utility functions for handling database operations

import { v4 as uuidv4 } from 'uuid';

// Database connection configuration
const DB_CONFIG = {
  host: 'es.inbizmanager.cloud',
  database: 'user_claudia',
  user: 'postgres',
  password: 'fd65bdc2b6386ee98f90',
  port: 5432,
  ssl: false
};

// Type definitions for API requests and responses
type VerificationRequest = {
  name: string;
  lastname: string;
  email: string;
  remotejid: string;
  password: string;
};

type VerificationResponse = {
  success: boolean;
  message: string;
  error?: string;
};

type CodeVerificationRequest = {
  code: string;
  email: string;
};

type CodeVerificationResponse = {
  success: boolean;
  message: string;
  error?: string;
};

type LoginRequest = {
  phone: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  error?: string;
};

type TokenPurchaseRequest = {
  amount: number;
  currency: 'USD' | 'COP';
  phone?: string;
};

type TokenPurchaseResponse = {
  success: boolean;
  message: string;
  tokensAdded?: number;
  error?: string;
};

// API base URL for our server-side operations that handle database interaction
const API_BASE_URL = 'https://nn.tumejorversionhoy.shop/api';

// Function to send user registration data directly to PostgreSQL database
export const registerUserWithWebhook = async (userData: VerificationRequest): Promise<VerificationResponse> => {
  try {
    console.log('Sending registration data to database:', userData);
    
    // Generate a unique ID for the new user
    const userId = uuidv4();
    
    // Prepare user data according to the table structure
    const userDataForDb = {
      id: userId,
      remotejid: userData.remotejid,
      push_name: null, // These fields are not provided during registration
      pic: null,
      status: 'pending', // New users start with pending status until verification
      last_message: null,
      credits: '0', // New users start with 0 credits
      type_user: 'regular', // Default user type
      name: userData.name,
      lastname: userData.lastname,
      email: userData.email,
      password: userData.password, // In a production app, this should be hashed
    };
    
    // Since we're in a browser environment, we can't directly connect to PostgreSQL
    // We need to use an API endpoint that will handle the connection securely
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDataForDb),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Registration response:', data);
    
    return { 
      success: true, 
      message: 'Registro exitoso, por favor verifica tu código.' 
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { 
      success: false, 
      message: 'Error al registrar usuario.',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Function to verify code
export const verifyCodeWithWebhook = async (verificationData: CodeVerificationRequest): Promise<CodeVerificationResponse> => {
  try {
    console.log('Sending code verification data:', verificationData);
    
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Verification response:', data);
    
    if (data.success) {
      return { 
        success: true, 
        message: 'Código verificado correctamente.' 
      };
    } else {
      return { 
        success: false, 
        message: 'Código de verificación incorrecto.',
        error: data.message || 'El código no coincide'
      };
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    return { 
      success: false, 
      message: 'Error al verificar el código.',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Function to login user
export const loginUser = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('Sending login data:', loginData);
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Login response:', data);
    
    return { 
      success: true, 
      message: 'Inicio de sesión exitoso' 
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return { 
      success: false, 
      message: 'Error al iniciar sesión.',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Function to purchase tokens
export const purchaseTokens = async (purchaseData: TokenPurchaseRequest): Promise<TokenPurchaseResponse> => {
  try {
    console.log('Processing token purchase:', purchaseData);
    
    const response = await fetch(`${API_BASE_URL}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Purchase response:', data);
    
    // Calculate tokens based on amount and currency
    const tokensAdded = purchaseData.amount;
    
    return { 
      success: true, 
      message: 'Compra de tokens exitosa',
      tokensAdded
    };
  } catch (error) {
    console.error('Error purchasing tokens:', error);
    return { 
      success: false, 
      message: 'Error al procesar la compra de tokens.',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};
