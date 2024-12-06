import express from 'express';
import dotenv from 'dotenv';
import { registerUser, activateAccount } from './controllers/authController.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/register', registerUser);

app.get('/activate/:token', activateAccount);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
