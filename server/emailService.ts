import { Resend } from 'resend';

// Initialize Resend (you'll need to add RESEND_API_KEY to your env)
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private from = process.env.FROM_EMAIL || 'noreply@kimscript.com';

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: options.from || this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        console.error('Email sending failed:', error);
        return false;
      }

      console.log('Email sent successfully:', data?.id);
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  // Email confirmation template
  async sendEmailConfirmation(email: string, confirmationToken: string): Promise<boolean> {
    const confirmationUrl = `${process.env.DOMAIN || 'https://www.kimscript.com'}/confirm-email?token=${confirmationToken}`;
    
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">KimScript</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Plataforma de Scripts Virales con IA</p>
        </div>
        
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333; margin-top: 0;">¡Confirma tu email!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Gracias por unirte a KimScript. Para completar tu registro y acceder a todas las funcionalidades, 
            necesitamos que confirmes tu dirección de email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; text-decoration: none; padding: 15px 30px; 
                      border-radius: 8px; display: inline-block; font-weight: bold;">
              Confirmar Email
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px;">
            Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
            <a href="${confirmationUrl}" style="color: #667eea;">${confirmationUrl}</a>
          </p>
          
          <p style="color: #888; font-size: 14px; margin-top: 30px;">
            Si no te registraste en KimScript, puedes ignorar este email.
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 14px;">
            © 2025 KimScript - Plataforma de Scripts Virales con IA
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: email,
      subject: '🚀 Confirma tu email en KimScript',
      html,
    });
  }

  // Password reset template
  async sendPasswordReset(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.DOMAIN || 'https://www.kimscript.com'}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">KimScript</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Recuperación de Contraseña</p>
        </div>
        
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333; margin-top: 0;">Restablecer Contraseña</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta en KimScript. 
            Haz clic en el botón de abajo para crear una nueva contraseña.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                      color: white; text-decoration: none; padding: 15px 30px; 
                      border-radius: 8px; display: inline-block; font-weight: bold;">
              Restablecer Contraseña
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px;">
            Este enlace expirará en 1 hora por seguridad.<br>
            Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
            <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
          </p>
          
          <p style="color: #888; font-size: 14px; margin-top: 30px;">
            Si no solicitaste este restablecimiento, puedes ignorar este email.
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 14px;">
            © 2025 KimScript - Plataforma de Scripts Virales con IA
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: email,
      subject: '🔑 Restablecer contraseña - KimScript',
      html,
    });
  }

  // Welcome email template
  async sendWelcomeEmail(email: string, firstName?: string): Promise<boolean> {
    const name = firstName ? `${firstName}` : 'Usuario';
    
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">¡Bienvenido a KimScript!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Tu cuenta está lista</p>
        </div>
        
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333; margin-top: 0;">¡Hola ${name}! 👋</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            ¡Felicidades! Tu cuenta en KimScript ha sido confirmada exitosamente. 
            Ya puedes acceder a todas las funcionalidades de nuestra plataforma de IA para crear scripts virales.
          </p>
          
          <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #333;">🚀 ¿Qué puedes hacer ahora?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>Analizar videos</strong> de TikTok, Instagram y YouTube</li>
              <li><strong>Generar scripts virales</strong> con IA avanzada</li>
              <li><strong>Usar frameworks</strong> como AIDA, PAS, Hook-Story-CTA</li>
              <li><strong>Crear hashtags</strong> optimizados para cada plataforma</li>
              <li><strong>Ver analytics</strong> de performance de tus scripts</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.DOMAIN || 'https://www.kimscript.com'}/dashboard" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; text-decoration: none; padding: 15px 30px; 
                      border-radius: 8px; display: inline-block; font-weight: bold;">
              Ir al Dashboard
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px;">
            Si tienes alguna pregunta, no dudes en contactarnos. ¡Estamos aquí para ayudarte a crear contenido viral!
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 14px;">
            © 2025 KimScript - Plataforma de Scripts Virales con IA
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: email,
      subject: '🎉 ¡Bienvenido a KimScript! Tu cuenta está lista',
      html,
    });
  }
}

export const emailService = new EmailService();