
// API utility functions for handling database operations with Supabase

import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

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

// Function to register user with Supabase
export const registerUserWithWebhook = async (userData: VerificationRequest): Promise<VerificationResponse> => {
  try {
    console.log('Sending registration data to Supabase:', userData);
    
    // Check if user with this email or phone already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email, remotejid')
      .or(`email.eq.${userData.email},remotejid.eq.${userData.remotejid}`);
    
    if (checkError) {
      console.error('Error checking existing user:', checkError);
      throw new Error(checkError.message);
    }
    
    if (existingUsers && existingUsers.length > 0) {
      // Check which field already exists
      const emailExists = existingUsers.some(user => user.email === userData.email);
      const phoneExists = existingUsers.some(user => user.remotejid === userData.remotejid);
      
      if (emailExists) {
        return { 
          success: false, 
          message: 'Este correo electrónico ya está registrado.',
          error: 'Email already exists'
        };
      }
      
      if (phoneExists) {
        return { 
          success: false, 
          message: 'Este número de teléfono ya está registrado.',
          error: 'Phone number already exists'
        };
      }
    }
    
    // Generate a unique ID for the new user
    const userId = uuidv4();
    
    // Insert user data into the Supabase users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        remotejid: userData.remotejid,
        push_name: null,
        pic: null,
        status: 'verified', // Set as verified immediately to allow login
        last_message: null,
        credits: '0',
        type_user: 'regular',
        name: userData.name,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password, // In a production app, this should be hashed
      })
      .select();
    
    if (error) {
      console.error('Error registering user:', error);
      throw new Error(error.message);
    }
    
    console.log('Registration response:', data);
    
    return { 
      success: true, 
      message: 'Registro exitoso. Ahora puedes iniciar sesión.' 
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

// Function to verify code - now simplified since we immediately verify users
export const verifyCodeWithWebhook = async (verificationData: CodeVerificationRequest): Promise<CodeVerificationResponse> => {
  try {
    console.log('Verification code is not needed anymore, users are immediately verified');
    
    // Return success - in a real application, you might want to implement actual code verification
    return { 
      success: true, 
      message: 'Usuario verificado correctamente.' 
    };
  } catch (error) {
    console.error('Error in verification flow:', error);
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
    console.log('Authenticating user with phone:', loginData.phone);
    
    // Query the users table to find the user with matching phone and password
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('remotejid', loginData.phone)
      .eq('password', loginData.password) // In a production app, passwords should be hashed
      .eq('status', 'verified');
    
    if (error) {
      console.error('Error logging in:', error);
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
      return { 
        success: false, 
        message: 'Credenciales incorrectas o usuario no verificado.',
        error: 'Invalid credentials or unverified user.'
      };
    }
    
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
    if (!purchaseData.phone) {
      return {
        success: false,
        message: 'Número de teléfono no proporcionado.',
        error: 'Phone number not provided.'
      };
    }
    
    console.log('Processing token purchase for user:', purchaseData.phone);
    
    // Get current user tokens
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('remotejid', purchaseData.phone)
      .single();
    
    if (fetchError) {
      console.error('Error fetching user data:', fetchError);
      throw new Error(fetchError.message);
    }
    
    if (!userData) {
      return {
        success: false,
        message: 'Usuario no encontrado.',
        error: 'User not found.'
      };
    }
    
    // Calculate new token amount
    const currentTokens = parseInt(userData.credits) || 0;
    const newTokens = currentTokens + purchaseData.amount;
    
    // Update user tokens
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newTokens.toString() })
      .eq('remotejid', purchaseData.phone);
    
    if (updateError) {
      console.error('Error updating tokens:', updateError);
      throw new Error(updateError.message);
    }
    
    return { 
      success: true, 
      message: 'Compra de tokens exitosa',
      tokensAdded: purchaseData.amount
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
