import {pool} from '../db.js'
import { getExtensionFromMimeType } from '../helpers/Helper.js';

export const createVehiclePhoto = async (req, res) => {
    
  try {
    const photos = req.files;
    for (const photo of photos) {
        console.log(getExtensionFromMimeType(photo.mimetype))
        console.log(photo.filename)
    }
      res.sendStatus(200);
      // Envía una respuesta al cliente
  } catch (error) {
    return res.status(500).json({
        message:error.message
    })
  }
   
  };