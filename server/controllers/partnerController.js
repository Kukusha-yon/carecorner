import Partner from '../models/Partner.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
export const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort('order');
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Error fetching partners', error: error.message });
  }
};

// @desc    Create a new partner
// @route   POST /api/partners
// @access  Private/Admin
export const createPartner = async (req, res) => {
  try {
    const { name, link, order } = req.body;
    let logoUrl = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);
      logoUrl = uploadResult.secure_url;
    }

    const partner = await Partner.create({
      name,
      logo: logoUrl,
      link,
      order: parseInt(order),
      isActive: true
    });

    res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ message: 'Error creating partner', error: error.message });
  }
};

// @desc    Update a partner
// @route   PUT /api/partners/:id
// @access  Private/Admin
export const updatePartner = async (req, res) => {
  try {
    const { name, link, order } = req.body;
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    let logoUrl = partner.logo;

    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (partner.logo) {
        await deleteFromCloudinary(partner.logo);
      }
      // Upload new image to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file);
      logoUrl = uploadResult.secure_url;
    }

    partner.name = name;
    partner.logo = logoUrl;
    partner.link = link;
    partner.order = parseInt(order);

    const updatedPartner = await partner.save();
    res.json(updatedPartner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ message: 'Error updating partner', error: error.message });
  }
};

// @desc    Delete a partner
// @route   DELETE /api/partners/:id
// @access  Private/Admin
export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Delete image from Cloudinary if it exists
    if (partner.logo) {
      await deleteFromCloudinary(partner.logo);
    }

    await partner.remove();
    res.json({ message: 'Partner removed' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ message: 'Error deleting partner', error: error.message });
  }
}; 