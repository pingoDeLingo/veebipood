import { Router, Request, Response } from 'express';
import Aadress from '../models/aadress';

const router: Router = Router();

router.get('/aadress', async (req: Request, res: Response) => {
    try {
        const aadressData = await Aadress.find();
        res.json(aadressData);
    } catch (error) {
        console.error('Error retrieving aadress data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/aadress', async (req: Request, res: Response) => {
    try {
        const { tänav, maja, linn, postiindeks } = req.body;
        const newAadress = new Aadress({ tänav, maja, linn, postiindeks });
        const savedAadress = await newAadress.save();
        res.status(201).json(savedAadress);
    } catch (error) {
        console.error('Error adding aadress data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/aadress/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tänav, maja, linn, postiindeks } = req.body;
        const updatedAadress = await Aadress.findByIdAndUpdate(id, { tänav, maja, linn, postiindeks }, { new: true });
        if (!updatedAadress) {
            return res.status(404).json({ error: 'Aadress not found' });
        }
        res.json(updatedAadress);
    } catch (error) {
        console.error('Error updating aadress data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/aadress/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedAadress = await Aadress.findByIdAndDelete(id);
        if (!deletedAadress) {
            return res.status(404).json({ error: 'Aadress not found' });
        }
        res.json({ message: 'Aadress deleted successfully' });
    } catch (error) {
        console.error('Error deleting aadress data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;