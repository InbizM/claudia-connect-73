
// API utility functions for handling data

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

// API base URL - this should point to your backend service
const API_BASE_URL = 'https://nn.tumejorversionhoy.shop/api';

// Function to send user registration data to backend
export const registerUserWithWebhook = async (userData: VerificationRequest): Promise<VerificationResponse> => {
  try {
    console.log('Sending registration data to backend:', userData);
    
    // We're still using the webhook endpoint for now, but this could be changed to your own API
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/9d6e3fae-6700-4314-aa41-8e1dadae0de1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        // Add an indicator that this request is for database insertion
        action: 'register',
        // Database credentials should not be in client-side code
        // These will be handled on the server side
      }),
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

// Function to verify code through backend
export const verifyCodeWithWebhook = async (verificationData: CodeVerificationRequest): Promise<CodeVerificationResponse> => {
  try {
    console.log('Sending code verification data to backend:', verificationData);
    
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/c1530bfd-a2c3-4c82-bb88-3e956d20b113', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...verificationData,
        action: 'verify',
      }),
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
    
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/9d6e3fae-6700-4314-aa41-8e1dadae0de1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...loginData,
        action: 'login',
      }),
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
    
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/9d6e3fae-6700-4314-aa41-8e1dadae0de1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...purchaseData,
        action: 'purchase',
      }),
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
