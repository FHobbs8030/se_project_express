import mongoose from 'mongoose';

const mongoURI = 'mongodb://127.0.0.1:27017/wtwr'; // MongoDB connection string

const clothingItemSchema = new mongoose.Schema({
  name: String,
  weather: String,
  imageUrl: String,
  likes: { type: Number, default: 0 },
});

const ClothingItem = mongoose.model('ClothingItem', clothingItemSchema);

const sampleItems = [
  {
    name: 'Beanie',
    weather: 'cold',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Beanie.png',
  },
  {
    name: 'Boot',
    weather: 'cold',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Boot.png',
  },
  {
    name: 'Cap',
    weather: 'hot',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Cap.png',
  },
  {
    name: 'Coat',
    weather: 'cold',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Coat.png',
  },
  {
    name: 'Hoodie',
    weather: 'cold',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Hoodie.png',
  },
  {
    name: 'Jacket',
    weather: 'cold',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Jacket.png',
  },
  {
    name: 'Jeans',
    weather: 'warm',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Jeans.png',
  },
  {
    name: 'Loafers',
    weather: 'warm',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Loafers.png',
  },
  {
    name: 'Sandals',
    weather: 'hot',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sandals.png',
  },
  {
    name: 'Scarf',
    weather: 'cold',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Scarf.png',
  },
  {
    name: 'Shorts',
    weather: 'hot',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Shorts.png',
  },
  {
    name: 'Sneakers',
    weather: 'warm',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sneakers.png',
  },
  {
    name: 'Sunglasses',
    weather: 'hot',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sunglasses.png',
  },
  {
    name: 'Sweatshirt',
    weather: 'warm',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sweatshirt.png',
  },
  {
    name: 'T-Shirt',
    weather: 'hot',
    imageUrl:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/T-Shirt.png',
  },
];

async function seedDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    await ClothingItem.deleteMany({});
    console.log('Cleared existing items');

    await ClothingItem.insertMany(sampleItems);
    console.log('Sample WTWR items inserted');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding DB:', error);
  }
}

seedDB();
