import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConfirmEmail() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Supabase puede enviar parámetros en query string (?) o hash (#)
        // Extraer parámetros de ambos lugares
        let hash = window.location.hash.substring(1); // Remover el #
        const search = window.location.search.substring(1); // Remover el ?
        
        // Si el hash contiene una URL completa, extraer solo la parte de query
        if (hash.includes('?')) {
          hash = hash.split('?')[1];
        }
        // Si el hash contiene un fragmento de URL, intentar parsearlo
        if (hash.includes('/')) {
          const parts = hash.split('/');
          const lastPart = parts[parts.length - 1];
          if (lastPart.includes('=')) {
            hash = lastPart;
          }
        }
        
        // Crear URLSearchParams combinando ambos
        const urlParams = new URLSearchParams();
        
        // Primero agregar parámetros del query string
        if (search) {
          try {
            new URLSearchParams(search).forEach((value, key) => {
              urlParams.set(key, value);
            });
          } catch (e) {
            console.warn('Error parsing search params:', e);
          }
        }
        
        // Luego agregar parámetros del hash (tienen prioridad)
        if (hash) {
          try {
            new URLSearchParams(hash).forEach((value, key) => {
              urlParams.set(key, value);
            });
          } catch (e) {
            console.warn('Error parsing hash params:', e);
            // Intentar extraer manualmente si URLSearchParams falla
            const pairs = hash.split('&');
            pairs.forEach(pair => {
              const [key, value] = pair.split('=');
              if (key && value) {
                urlParams.set(key, decodeURIComponent(value));
              }
            });
          }
        }
        
        // Supabase puede enviar token como `token_hash` (nuevo) o `token` (legacy)
        const token = urlParams.get('token_hash') ?? urlParams.get('token');
        const type = urlParams.get('type') ?? 'signup'; // Default a 'signup' si no viene
        
        // También intentar extraer desde el hash completo si viene como URL
        let extractedToken = token;
        if (!extractedToken && hash) {
          // Intentar extraer token de diferentes formatos
          const tokenMatch = hash.match(/token[_-]?hash=([^&]+)/i) || hash.match(/token=([^&]+)/i);
          if (tokenMatch) {
            extractedToken = decodeURIComponent(tokenMatch[1]);
          }
        }

        // Debug logging
        console.log('Email confirmation params:', {
          fullUrl: window.location.href,
          hash: window.location.hash,
          search: window.location.search,
          extractedHash: hash,
          extractedSearch: search,
          token: extractedToken ? `${extractedToken.substring(0, 20)}...` : null,
          type,
          allParams: Object.fromEntries(urlParams.entries())
        });

        if (!extractedToken) {
          // Si no hay token, verificar si el usuario ya está autenticado
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Usuario ya autenticado, probablemente ya confirmó
            setStatus('success');
            setMessage('Tu email ya está confirmado. Redirigiendo...');
            setTimeout(() => {
              setLocation('/');
            }, 2000);
            return;
          }
          
          setStatus('error');
          setMessage('Enlace de confirmación inválido: No se encontró el token. Por favor, verifica que el enlace esté completo.');
          console.error('No token found in URL');
          return;
        }

        // Intentar confirmar el email con diferentes métodos
        try {
          // Método 1: verifyOtp con token_hash (método moderno)
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: extractedToken,
            type: type as 'signup' | 'email' | 'recovery' | 'email_change'
          });

          if (verifyError) {
            console.error('verifyOtp error:', verifyError);
            
            // Método 2: Intentar con verifyOtp usando solo el token sin type
            const { error: verifyError2 } = await supabase.auth.verifyOtp({
              token_hash: extractedToken,
              type: 'signup'
            });

            if (verifyError2) {
              console.error('verifyOtp retry error:', verifyError2);
              setStatus('error');
              setMessage('Error al confirmar el email: ' + verifyError2.message);
              return;
            }
          }

          // Éxito
          setStatus('success');
          setMessage('¡Email confirmado exitosamente! Redirigiendo al dashboard...');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            setLocation('/');
          }, 2000);
          
        } catch (error: any) {
          console.error('Confirmation error:', error);
          setStatus('error');
          setMessage('Error inesperado al confirmar el email: ' + (error.message || 'Error desconocido'));
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error inesperado al confirmar el email');
      }
    };

    handleEmailConfirmation();
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            KimScript
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {status === 'loading' && 'Confirmando email...'}
              {status === 'success' && '¡Email confirmado!'}
              {status === 'error' && 'Error de confirmación'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Por favor espera mientras confirmamos tu email'}
              {status === 'success' && 'Tu cuenta ha sido verificada exitosamente'}
              {status === 'error' && 'Hubo un problema al confirmar tu email'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'loading' && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <div className="text-green-600 text-4xl">✓</div>
                <p className="text-gray-600">{message}</p>
                <Button 
                  onClick={() => setLocation('/')}
                  className="bg-gradient-to-r from-violet-600 to-blue-600"
                >
                  Ir al Dashboard
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-4">
                <div className="text-red-600 text-4xl">✗</div>
                <p className="text-gray-600">{message}</p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => setLocation('/login')}
                    className="w-full bg-gradient-to-r from-violet-600 to-blue-600"
                  >
                    Ir a Login
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => setLocation('/')}
                    className="w-full"
                  >
                    Volver al Inicio
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
