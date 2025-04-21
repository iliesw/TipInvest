import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "mail67.lwspanel.com", // ou mail67.lwspanel.com
  port: 465, // Use STARTTLS
  secure: true, // ❌ No SSL, so set to false
  auth: {
    user: "noreply@tipsinvest.fr",
    pass: "13579@azerty%G", // Utiliser une variable d'environnement pour le mot de passe
  },
});

/**
 * Envoie un email de vérification à l'utilisateur
 * @param to Adresse email du destinataire
 * @param name Nom de l'utilisateur
 * @param verificationToken Token de vérification
 * @returns Promise<boolean> Indique si l'email a été envoyé avec succès
 */
export const sendVerificationEmail = async (
  to: string,
  name: string,
  verificationToken: string
): Promise<boolean> => {
  try {
    // Construire l'URL de vérification
    const verificationUrl = `${"http://localhost:3000"}/verify-email?token=${verificationToken}`;

    // Options de l'email
    const mailOptions = {
      from: '"TipInvest" <noreply@tipsinvest.fr>',
      to,
      subject: "Vérification de votre adresse email - TipInvest",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3b82f6;">TipInvest</h1>
          </div>
          <div>
            <p>Bonjour ${name},</p>
            <p>Merci de vous être inscrit sur TipInvest. Pour activer votre compte et accéder à toutes les fonctionnalités, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Vérifier mon email</a>
            </div>
            <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p>Ce lien expirera dans 24 heures.</p>
            <p>Si vous n'avez pas créé de compte sur TipInvest, veuillez ignorer cet email.</p>
            <p>Cordialement,<br>L'équipe TipInvest</p>
          </div>
        </div>
      `,
    };

    // Envoyer l'email
    const r = await transporter.sendMail(mailOptions);
    console.log(r)
    return true;
  } catch (error) {
    console.error("Erreur lors de lenvoi de l'email de vérification:", error);
    return false;
  }
};

/**
 * Envoie un email de confirmation après vérification réussie
 * @param to Adresse email du destinataire
 * @param name Nom de l'utilisateur
 * @returns Promise<boolean> Indique si l'email a été envoyé avec succès
 */
export const sendConfirmationEmail = async (
  to: string,
  name: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: '"TipInvest" <noreply@tipsinvest.fr>',
      to,
      subject: "Bienvenue sur TipInvest - Email vérifié avec succès",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3b82f6;">TipInvest</h1>
          </div>
          <div>
            <p>Bonjour ${name},</p>
            <p>Félicitations ! Votre adresse email a été vérifiée avec succès et votre compte est maintenant activé.</p>
            <p>Vous pouvez désormais accéder à toutes les fonctionnalités de TipInvest et commencer à explorer les opportunités d'investissement immobilier.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${
                process.env.FRONTEND_URL || "http://localhost:3000"
              }/client" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Accéder à mon compte</a>
            </div>
            <p>Cordialement,<br>L'équipe TipInvest</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
    return false;
  }
};
