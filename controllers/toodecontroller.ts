import { Router, Request, Response } from 'express';
import Toode from "../models/toode";
import Kategooria from "../models/kategooria";

const router: Router = Router();

router.get('/toode', async (req: Request, res: Response) => {
    try {
        const toodeData = await Toode.find().populate('kategooria');
        res.json(toodeData);
    } catch (error) {
        console.error('Error retrieving toode data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/aegunud-toode', async (req: Request, res: Response) => {
    try {
        const currentDate = new Date();

        const expiredDevices = await Toode.find({ vananemisaeg: { $lt: currentDate } });

        res.json(expiredDevices);
    } catch (error) {
        console.error('Error retrieving expired devices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
router.get('/hinnad-kokku', async (req: Request, res: Response) => {
    try {
        const totalCost = await Toode.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$hind" }
                }
            }
        ]);

        const cost = totalCost[0].total;

        res.json({ totalCost: cost });
    } catch (error) {
        console.error('Error calculating total cost:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/aegunud-hind-kokku', async (req: Request, res: Response) => {
    try {
        const currentDate = new Date();

        const totalCostExpired = await Toode.aggregate([
            {
                $match: {
                    vananemisaeg: { $lt: currentDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$hind" }
                }
            }
        ]);

        const costExpired = totalCostExpired[0] ? totalCostExpired[0].total : 0;

        res.json({ totalCostExpired: costExpired });
    } catch (error) {
        console.error('Error calculating total cost of expired products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/unactive-toode', async (req, res) => {
    try {
        const inactiveProducts = await Toode.find({ aktiivne: false });

        res.json(inactiveProducts);
    } catch (error) {
        console.error('Error retrieving inactive products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/active-toode', async (req, res) => {
    try {
        const activeProducts = await Toode.find({ aktiivne: true });

        res.json(activeProducts);
    } catch (error) {
        console.error('Error retrieving active products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/toode', async (req: Request, res: Response) => {

    const kategooria = new Kategooria({
        nimetus: req.body.kategooria.nimetus
    })

    try {
        const savedkategooria = await kategooria.save();
        const newToode = new Toode({
            nimetus: req.body.nimetus,
            kategooria: savedkategooria._id,
            hind: req.body.hind,
            pildiURL: req.body.pildiURL,
            aktiivne: req.body.aktiivne,
            laokogus: req.body.laokogus,
            vananemisaeg: req.body.vananemisaeg
        });
        if (newToode.hind <= 0) {
            return res.status(404).json({ error: 'Price suck kys' });
        }
        if (newToode.vananemisaeg && newToode.vananemisaeg < new Date()) {
            return res.status(400).json({ error: 'Aging time cannot be in the past' });
        }
        const savedToode = await newToode.save();
        res.status(201).json(savedToode);
    } catch (error) {
        console.error('Error adding toode data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/toode/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const  {nimetus, kategooria, hind, pildiURL, aktiivne, laokogus, vananemisaeg } = req.body;
        const updatedToode = await Toode.findByIdAndUpdate(id, { nimetus, kategooria, hind, pildiURL, aktiivne, laokogus, vananemisaeg }, { new: true });
        if (!updatedToode) {
            return res.status(404).json({ error: 'Toode not found' });
        }
        res.json(updatedToode);
    } catch (error) {
        console.error('Error updating toode data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/toode/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedToode = await Toode.findByIdAndDelete(id);
        if (!deletedToode) {
            return res.status(404).json({ error: 'Toode not found' });
        }
        res.json({ message: 'Toode deleted successfully' });
    } catch (error) {
        console.error('Error deleting toode data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
