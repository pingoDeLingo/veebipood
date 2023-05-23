import { Router, Request, Response } from 'express';
import Kategooria from '../models/kategooria';

const router: Router = Router();

router.get('/kategooria', async (req: Request, res: Response) => {
    try {
        const kategooriaData = await Kategooria.find();
        res.json(kategooriaData);
    } catch (error) {
        console.error('Error retrieving kategooria data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/kategooria', async (req: Request, res: Response) => {
    try {
        const { nimetus } = req.body;
        const newKategooria = new Kategooria({ nimetus });
        const savedKategooria = await newKategooria.save();
        res.status(201).json(savedKategooria);
    } catch (error) {
        console.error('Error adding kategooria data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/kategooria/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nimetus } = req.body;
        const updatedKategooria = await Kategooria.findByIdAndUpdate(id, { nimetus }, { new: true });
        if (!updatedKategooria) {
            return res.status(404).json({ error: 'Kategooria not found' });
        }
        res.json(updatedKategooria);
    } catch (error) {
        console.error('Error updating kategooria data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/kategooria/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedKategooria = await Kategooria.findByIdAndDelete(id);
        if (!deletedKategooria) {
            return res.status(404).json({ error: 'Kategooria not found' });
        }
        res.json({ message: 'Kategooria deleted successfully' });
    } catch (error) {
        console.error('Error deleting kategooria data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
