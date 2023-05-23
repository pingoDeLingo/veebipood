import { Router, Request, Response } from 'express';
import KontaktAndmed from "../models/kontaktAndmed";
import Maksestaatus from "../models/maksestaatus";
import Kategooria from "../models/kategooria";

const router: Router = Router();

router.get('/kontaktandmed', async (req: Request, res: Response) => {
    try {
        const kontaktAndmedData = await KontaktAndmed.find();
        res.json(kontaktAndmedData);
    } catch (error) {
        console.error('Error retrieving kontaktAndmed data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/kontaktandmed', async (req: Request, res: Response) => {
    try {
        const { telefoninumber, email } = req.body;
        const newKontaktAndmed = new KontaktAndmed({ telefoninumber, email });
        const savedKontaktAndmed = await newKontaktAndmed.save();
        res.status(201).json(savedKontaktAndmed);
    } catch (error) {
        console.error('Error adding kontaktAndmed data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/kontaktandmed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const  { telefoninumber, email } = req.body;
        const updatedKontaktAndmed = await KontaktAndmed.findByIdAndUpdate(id, { telefoninumber, email }, { new: true });
        if (!updatedKontaktAndmed) {
            return res.status(404).json({ error: 'Kontaktandmed not found' });
        }
        res.json(updatedKontaktAndmed);
    } catch (error) {
        console.error('Error updating kontaktandmed data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/kontaktandmed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedKontaktAndmed = await KontaktAndmed.findByIdAndDelete(id);
        if (!deletedKontaktAndmed) {
            return res.status(404).json({ error: 'Kontaktandmed not found' });
        }
        res.json({ message: 'Kontaktandmed deleted successfully' });
    } catch (error) {
        console.error('Error deleting kontaktandmed data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router