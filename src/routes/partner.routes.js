import express from 'express';
import Partner from '../models/partner.model.js';
import { sendPartnerNotification } from '../services/email.service.js';
import upload from '../config/multer.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create new partner request
router.post('/', upload.single('idDocument'), async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);
    
    // Determine partner type based on submitted fields
    const partnerType = req.body.companyName ? 'company' : 'individual';
    
    let partnerData;
    if (partnerType === 'individual' && req.file) {
      // Store the absolute path to the uploaded file
      const filePath = path.resolve(req.file.path);
      console.log('File saved at:', filePath);
      
      // For individual partners with ID document
      partnerData = new Partner({
        ...req.body,
        partnerType,
        idDocumentPath: filePath
      });
      console.log('Creating individual partner with document:', partnerData);
    } else {
      // For company partners or individuals without ID document
      partnerData = new Partner({
        ...req.body,
        partnerType
      });
      console.log('Creating partner without document:', partnerData);
    }
    
    const savedPartner = await partnerData.save();
    console.log('Saved partner:', savedPartner);
    
    // Send email notification with appropriate template
    await sendPartnerNotification({
      ...savedPartner.toObject(),
      partnerType,
      idDocumentPath: savedPartner.idDocumentPath
    });
    
    res.status(201).json({
      success: true,
      message: 'Partner request submitted successfully',
      data: savedPartner
    });
  } catch (error) {
    console.error('Error processing partner request:', error);
    // If there was an uploaded file but the request failed, clean it up
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Cleaned up file:', req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up uploaded file:', unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Failed to process partner request',
      error: error.message
    });
  }
});

// Get all partner requests (admin endpoint)
router.get('/', async (req, res) => {
  try {
    const partners = await Partner.find({});
    res.json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partners',
      error: error.message
    });
  }
});

export default router;
