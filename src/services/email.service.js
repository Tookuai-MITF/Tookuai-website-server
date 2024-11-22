import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendPartnerNotification = async (partnerData) => {
  try {
    const { partnerType, idDocumentPath, ...data } = partnerData;
    
    // Create email content based on partner type
    const subject = partnerType === 'company' 
      ? 'New Company Partner Registration'
      : 'New Individual Partner Registration';
    
    let emailContent = '<h2>New Partner Registration Details</h2>';
    
    // Add partner type specific fields
    if (partnerType === 'company') {
      emailContent += `
        <p><strong>Company Name:</strong> ${data.companyName}</p>
        <p><strong>Contact Name:</strong> ${data.contactName}</p>
        <p><strong>Fleet Size:</strong> ${data.fleetSize}</p>
      `;
    } else {
      emailContent += `
        <p><strong>First Name:</strong> ${data.firstName}</p>
        <p><strong>Last Name:</strong> ${data.lastName}</p>
        <p><strong>Car Make:</strong> ${data.carMake}</p>
        <p><strong>Car Model:</strong> ${data.carModel}</p>
        <p><strong>Car Year:</strong> ${data.carYear}</p>
      `;
    }
    
    // Add common fields
    emailContent += `
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>City:</strong> ${data.city}</p>
      <p><strong>Bank Account Name:</strong> ${data.bankAccountName}</p>
      <p><strong>Bank Name:</strong> ${data.bankName}</p>
      <p><strong>Bank Account Number:</strong> ${data.bankAccountNumber}</p>
      ${data.message ? `<p><strong>Additional Information:</strong> ${data.message}</p>` : ''}
    `;
    
    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: subject,
      html: emailContent
    };
    
    // Add attachment if ID document exists
    if (idDocumentPath) {
      mailOptions.attachments = [{
        filename: path.basename(idDocumentPath),
        path: idDocumentPath
      }];
    }
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
