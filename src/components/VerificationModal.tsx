
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import Button from './Button';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

type VerificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
};

const VerificationModal: React.FC<VerificationModalProps> = ({ 
  isOpen, 
  onClose,
  email
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Redirect to login page after registration
      navigate('/');
      
      toast({
        title: "Registro completado",
        description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-[#142126] rounded-lg w-full max-w-md shadow-xl animate-fade-in-up text-claudia-white">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-claudia-white">Registro Exitoso</h2>
            <p className="text-claudia-white/70 mb-6">
              ¡Tu cuenta ha sido creada correctamente! Ya puedes iniciar sesión con tus credenciales.
            </p>
            
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="primary"
                onClick={handleClose}
                className="w-full"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default VerificationModal;
