import { Router, Request, Response } from 'express';
import Klient from "../models/klient";
import KontaktAndmed from "../models/kontaktandmed";
import Aadress from "../models/aadress";

const router: Router = Router();

router.get('/klient', async (req: Request, res: Response) => {
    try {
        const klientData = await Klient.find().populate('kontaktandmed','maksestaatus');
        res.json(klientData);
    } catch (error) {
        console.error('Error retrieving klientdata:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/klient', async (req: Request, res: Response) => {
    const kontaktandmedid = req.body.kontaktandmed._id;
    const aadressid = req.body.aadress._id;

    const kontaktandmedPromise = KontaktAndmed.findById(kontaktandmedid).exec();
    const aadressPromise = Aadress.findById(aadressid).exec();

    try {
        const kontaktandmed = await kontaktandmedPromise;
        const aadress = await aadressPromise;

        if (!kontaktandmed) {
            throw new Error(kontaktandmedid);
        }

        if (!aadress) {
            throw new Error(aadressid);
        }

        const savedKontaktandmed = await kontaktandmed.save();
        const savedAadress = await aadress.save();
        const newKlient = new Klient({
            nimi: req.body.nimi,
            kontaktandmed: savedKontaktandmed._id,
            aadress: savedAadress._id
        });

        const savedKlient = await newKlient.save();

        // Populate the kontaktandmed and aadress fields in the response
        const populatedKlient = await Klient.findById(savedKlient._id)
            .populate('kontaktandmed')
            .populate('aadress')
            .exec();

        res.status(201).json(populatedKlient);
    } catch (error) {
        console.error('Error adding klient data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put('/klient/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {nimi, kontaktandmed, aadress} = req.body;
        const updatedKlient = await Klient.findByIdAndUpdate(id, {nimi, kontaktandmed, aadress}, { new: true });
        if (!updatedKlient) {
            return res.status(404).json({ error: 'Klient not found' });
        }
        res.json(updatedKlient);
    } catch (error) {
        console.error('Error updating klient data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/klient/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedKlient = await Klient.findByIdAndDelete(id);
        if (!deletedKlient) {
            return res.status(404).json({ error: 'Klient not found' });
        }
        res.json({ message: 'Klient deleted successfully' });
    } catch (error) {
        console.error('Error deleting klient data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router