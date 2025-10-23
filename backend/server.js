import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import AuthRoutes from './routes/authRoutes.js'
import MenuRoutes from './routes/menuRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import favoritesRoutes from './routes/favoritesRoutes.js';

dotenv.config()

const app = express()
const PORT = 5001

app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("MongoDB connected successfully")

  app.listen(PORT, () => { //starting the server after the connection
    //with the data base in complete
      console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => console.log("MongoDB connection error", err))



app.get('/', (req, res)=>{ //test route
  res.status(200).send("API CALL TO TEST STUFF")
})

app.use('/api/auth', AuthRoutes) //send all the auth related tasks to this route
app.use('/api/menu', MenuRoutes)
app.use('/api/orders', orderRoutes);


app.use('/api/favorites', favoritesRoutes)