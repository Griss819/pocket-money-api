import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'node:fs';
import * as handlebars from 'handlebars';
import * as path from 'node:path';

interface TemplateVariables {
  year: string;
  link: string;
}
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const confirmationLink = `${process.env.DOMAIN_URL}/auth/confirm-email?code=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirma tu correo electrónico',
      html: this.loadTemplate('../html-templates/register-mail.template.html', {
        year: new Date(Date.now()).getFullYear().toString(),
        link: confirmationLink,
      }),
    };

    await this.transporter.sendMail(mailOptions);
  }

  loadTemplate(templateName: string, variables: TemplateVariables): string {
    try {
      // __dirname no funciona directamente en ES Modules, usamos alternativas
      const templatesDir = path.join(
        process.cwd(),
        'src/shared/html-templates',
      ); // Ajusta esta ruta

      // Verifica si existe el directorio
      if (!fs.existsSync(templatesDir)) {
        throw new Error(
          `El directorio de templates no existe en: ${templatesDir}`,
        );
      }

      const templatePath = path.join(templatesDir, templateName);

      // Verifica si el archivo existe
      if (!fs.existsSync(templatePath)) {
        throw new Error(
          `El archivo ${templateName} no existe en: ${templatesDir}`,
        );
      }

      // Lee el archivo con encoding UTF-8
      const templateContent = fs.readFileSync(templatePath, 'utf-8');

      // Compila el template
      return handlebars.compile<TemplateVariables>(templateContent)(variables);
    } catch (error) {
      // Manejo detallado de errores
      console.error(
        '❌ Error al cargar el template:',
        error instanceof Error ? error.message : String(error),
      );
      throw error; // Relanza el error para manejo superior
    }
  }
}
