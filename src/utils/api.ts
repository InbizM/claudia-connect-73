
// API utility functions for handling webhook calls

type VerificationRequest = {
  name: string;
  lastname: string;
  email: string;
  remotejid: string;
  password: string; // Añadimos el campo de contraseña
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

// Function to send user registration data to webhook
export const registerUserWithWebhook = async (userData: VerificationRequest): Promise<VerificationResponse> => {
  try {
    console.log('Sending registration data to webhook:', userData);
    
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/9d6e3fae-6700-4314-aa41-8e1dadae0de1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Registration webhook response:', data);
    
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

// Function to verify code through webhook
export const verifyCodeWithWebhook = async (verificationData: CodeVerificationRequest): Promise<CodeVerificationResponse> => {
  try {
    console.log('Sending code verification data to webhook:', verificationData);
    
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/c1530bfd-a2c3-4c82-bb88-3e956d20b113', {
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
    console.log('Verification webhook response:', data);
    
    // Here we assume the API returns a success property
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
    
    // Aquí normalmente llamaríamos a un endpoint de login,
    // por ahora usaremos el mismo webhook para simular
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/9d6e3fae-6700-4314-aa41-8e1dadae0de1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...loginData,
        action: 'login'
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
    
    // Here we would normally call a payment processing API
    // For now, we'll simulate a successful purchase
    
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
