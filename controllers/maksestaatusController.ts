import { Router, Request, Response } from 'express';
import Maksestaatus from "../models/maksestaatus";

const router: Router = Router();

router.get('/maksestaatus', async (req: Request, res: Response) => {
    try {
        const maksestaatusData = await Maksestaatus.find();
        res.json(maksestaatusData);
    } catch (error) {
        console.error('Error retrieving maksestaatus data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/maksestaatus', async (req: Request, res: Response) => {
    try {
        const { makseseisund, maksmiseTahtaeg, makstudSumma, maksmiseKuupaev } = req.body;
        const newMaksestaatus = new Maksestaatus({ makseseisund, maksmiseTahtaeg, makstudSumma, maksmiseKuupaev });
        const savedMaksestaatus = await newMaksestaatus.save();
        res.status(201).json(savedMaksestaatus);
    } catch (error) {
        console.error('Error adding maksestaatus data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/maksestaatus/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const  { makseseisund, maksmiseTahtaeg, makstudSumma, maksmiseKuupaev } = req.body;
        const updatedMaksestaatus = await Maksestaatus.findByIdAndUpdate(id, { makseseisund, maksmiseTahtaeg, makstudSumma, maksmiseKuupaev }, { new: true });
        if (!updatedMaksestaatus) {
            return res.status(404).json({ error: 'Maksestaatus not found' });
        }
        res.json(updatedMaksestaatus);
    } catch (error) {
        console.error('Error updating maksestaatus data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;