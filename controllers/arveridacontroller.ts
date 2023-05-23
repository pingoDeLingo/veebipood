import { Router, Request, Response } from 'express';
import Arverida from '../models/arverida';
import Toode from '../models/toode';

const router: Router = Router();

router.get('/arverida', async (req: Request, res: Response) => {
    try {
        const arveridaData = await Arverida.find().populate('toode');
        res.json(arveridaData);
    } catch (error) {
        console.error('Error retrieving arverida data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/arverida', async (req: Request, res: Response) => {

    const toode = new Toode({
        nimetus: req.body.toode.nimetus,
        kategooria: req.body.toode.kategooria,
        hind: req.body.toode.hind,
        pildiURL: req.body.toode.pildiURL,
        aktiivne: req.body.toode.aktiivne,
        laokogus: req.body.toode.laokogus,
        vananemisaeg: req.body.toode.vananemisaeg
    })

    try {
        const savedToode = await toode.save();
        const newArverida = new Arverida({
            toode: savedToode._id,
            kogus: req.body.kogus
        })
        const savedArverida = await newArverida.save();
        res.status(201).json(savedArverida);
    } catch (error) {
        console.error('Error adding arverida data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/arverida/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const  { arve, toode, kogus, yhikuhind, summa } = req.body;
        const updatedArverida = await Arverida.findByIdAndUpdate(id, { arve, toode, kogus, yhikuhind, summa }, { new: true });
        if (!updatedArverida) {
            return res.status(404).json({ error: 'Arverida not found' });
        }
        res.json(updatedArverida);
    } catch (error) {
        console.error('Error updating arverida data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/arverida/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedArverida = await Arverida.findByIdAndDelete(id);
        if (!deletedArverida) {
            return res.status(404).json({ error: 'Arverida not found' });
        }
        res.json(deletedArverida);
    } catch (error) {
        console.error('Error deleting arverida data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;