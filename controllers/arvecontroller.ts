import { Router, Request, Response} from "express";
import Arve from "../models/arve";
import Arverida from "../models/arverida";
import Klient from "../models/klient";
import Maksestaatus from "../models/maksestaatus";

const router: Router = Router();

router.get('/arve', async (req: Request, res: Response) => {
    try {
        const arveData = await Arve.find().populate("arverida").populate("klient").populate("maksestaatus");
        res.json(arveData);
    } catch (error) {
        console.error('Error retrieving arve data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/arve', async (req: Request, res: Response) => {

    const arveridaid = req.body.arverida._id;
    const klientid = req.body.klient._id;
    const maksestaatusid = req.body.maksestaatus._id;

    const arveridaPromise = Arverida.findById(arveridaid).exec();
    const klientPromise = Klient.findById(klientid).exec();
    const maksestaatusPromise = Maksestaatus.findById(maksestaatusid).exec();

    try {
        const arverida = await arveridaPromise;
        const klient = await klientPromise;
        const maksestaatus = await maksestaatusPromise;

        if (!arverida) {
            throw new Error('Invalid arverida ID');
        }

        if (!klient) {
            throw new Error('Invalid klient ID');
        }

        if (!maksestaatus) {
            throw new Error('Invalid maksestaatus ID');
        }

        const savedArverida = await arverida.save();
        const savedKlient = await klient.save();
        const savedMaksestaatus = await maksestaatus.save();

        const newArve = new Arve({
            kuupaev: req.body.kuupaev,
            arverida: savedArverida._id,
            klient: savedKlient._id,
            maksestaatus: savedMaksestaatus._id,
            kogusumma: req.body.kogusumma
        });

        const savedArve = await newArve.save();

        const populatedArve = await Arve.findById(savedArve._id).populate("arverida").populate("klient").populate("maksestaatus").exec()

        res.status(201).json(populatedArve);
    } catch (error) {
        console.error('Error adding arve data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/arve/unpaid', async (req: Request, res: Response) => {
    try {
        const unpaidMaksestaatus = await Maksestaatus.find({ makseseisund: false });

        const unpaidArves = await Arve.find({ maksestaatus: { $in: unpaidMaksestaatus } })
            .populate('arverida')
            .populate('klient')
            .populate('maksestaatus');

        res.json(unpaidArves);
    } catch (error) {
        console.error('Error retrieving unpaid arve data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/arve/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const  { kuupaev, arverida, klient, maksestaatus, kogusumma } = req.body;
        const updatedArve = await Arve.findByIdAndUpdate(id, { kuupaev, arverida, klient, maksestaatus, kogusumma }, { new: true });
        if (!updatedArve) {
            return res.status(404).json({ error: 'Arve not found' });
        }
        res.json(updatedArve);
    } catch (error) {
        console.error('Error updating arve data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/arve/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedArve = await Arve.findByIdAndRemove(id);
        if (!deletedArve) {
            return res.status(404).json({ error: 'Arve not found' });
        }
        res.json(deletedArve);
    } catch (error) {
        console.error('Error deleting arve data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Kõik maksmata arved kõikide klientide osas millel on maksetähtaeg ületatud
router.get('/arved/maksetahtaeg-yletatud', async (req, res) => {
    try {
        const currentDate = new Date();

        const overdueInvoices = await Arve.find({
            'maksestaatus.makseseisund': false,
            'maksestaatus.maksmiseTahtaeg': { $not: currentDate }
        })
            .populate('klient')
            .populate('maksestaatus');

        res.json(overdueInvoices);
    } catch (error) {
        console.error('Error retrieving overdue invoices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Kõik ühe kliendi maksmata arved
router.get('/klient/:id/arved/maksmata', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const unpaidInvoices = await Arve.find({ klient: id, maksestaatus: { $ne: null } }).populate('klient').populate('maksestaatus');

        res.json(unpaidInvoices);
    } catch (error) {
        console.error('Error retrieving unpaid invoices for a client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Kõik ühe kliendi maksmata arved millel on maksetähtaeg ületatud
router.get('/klient/:id/arved/maksetahtaeg-yletatud', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const currentDate = new Date();

        const overdueInvoices = await Arve.find({ klient: id, maksestaatus: { $ne: null }, 'maksestaatus.maksmiseTahtaeg': { $lt: currentDate } })
            .populate('klient')
            .populate('maksestaatus');

        res.json(overdueInvoices);
    } catch (error) {
        console.error('Error retrieving overdue invoices for a client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Kõik ühe kliendi arved
router.get('/klient/:id/arved', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const clientInvoices = await Arve.find({ klient: id }).populate('klient').populate('maksestaatus');

        res.json(clientInvoices);
    } catch (error) {
        console.error('Error retrieving client invoices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Ühe kliendi kõikide arvete summa kokku
router.get('/klient/:id/arved/summa', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const client = await Klient.findById(id);
        const invoices = await Arve.find({ klient: id });

        let totalSum = 0;
        invoices.forEach((invoice) => {
            totalSum += invoice.kogusumma;
        });

        res.json({ klient: client.nimi, summa: totalSum });
    } catch (error) {
        console.error('Error calculating total invoice sum for a client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;