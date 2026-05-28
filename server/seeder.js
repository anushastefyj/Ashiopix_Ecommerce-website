import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';
import connectDB from './config/db.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

connectDB();

const seedData = async () => {
  try {
    // Clear collections
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    console.log('Database cleared...');

    // Seed Users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'password123',
        role: 'admin',
        phone: '1234567890',
        address: {
          street: '123 Admin Lane',
          city: 'Tech City',
          state: 'Silicon Valley',
          postalCode: '94025',
          country: 'USA',
        },
      },
      {
        name: 'Regular Customer',
        email: 'user@gmail.com',
        password: 'password123',
        role: 'user',
        phone: '9876543210',
        address: {
          street: '456 Buyer Boulevard',
          city: 'Market Town',
          state: 'Retail State',
          postalCode: '10001',
          country: 'USA',
        },
      },
    ]);

    console.log('Users seeded...');

    // Seed Products
    const products = await Product.create([
      {
        name: 'Vortex Quantum Pro Smartwatch',
        description: 'Next-generation smartwatch with holographic display, quantum heart-rate monitor, and 7-day solid-state battery life.',
        price: 299.99,
        discountPrice: 249.99,
        category: 'Electronics',
        brand: 'VortexTech',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
        ],
        stock: 50,
        rating: 4.8,
        numReviews: 0,
        tags: ['wearable', 'smartwatch', 'quantum', 'vortex'],
        specifications: {
          'Display': '1.8" Holographic AMOLED',
          'Battery Life': 'Up to 7 days',
          'Connectivity': 'Bluetooth 5.3, Wi-Fi 6',
          'Water Resistance': '50m (5 ATM)'
        }
      },
      {
        name: 'Aether SoundFlow ANC Headphones',
        description: 'Hybrid active noise-cancelling headphones featuring spatial audio tracking, custom EQ, and memory foam plush cups.',
        price: 349.99,
        discountPrice: 299.99,
        category: 'Audio',
        brand: 'AetherAudio',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
        ],
        stock: 120,
        rating: 4.7,
        numReviews: 0,
        tags: ['audio', 'headphones', 'noise-cancelling', 'wireless'],
        specifications: {
          'Drivers': '40mm Dynamic',
          'ANC Depth': '-45dB',
          'Playback Time': '40 Hours (ANC On)',
          'Charging': 'USB-C Fast Charge (10m = 5h)'
        }
      },
      {
        name: 'Lumina Arc Keyboard',
        description: 'Ergonomic split mechanical keyboard with premium hot-swappable switches, dynamic RGB glowing undertone, and wireless triple-mode pairing.',
        price: 189.99,
        discountPrice: 169.99,
        category: 'Accessories',
        brand: 'LuminaGear',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        images: [],
        stock: 80,
        rating: 4.9,
        numReviews: 0,
        tags: ['keyboard', 'mechanical', 'rgb', 'ergonomic'],
        specifications: {
          'Switches': 'Gateron Oil King (Linear)',
          'Hot-Swap': '5-pin supported',
          'Battery': '4000mAh Lithium',
          'Layout': '75% Split Ergonomic'
        }
      },
      {
        name: 'Zephyr Mini Desktop Purifier',
        description: 'Sleek, whisper-quiet desktop air purifier with dual H13 True HEPA filter, carbon odor elimination, and intelligent air quality tracking.',
        price: 89.99,
        discountPrice: 79.99,
        category: 'Home & Living',
        brand: 'ZephyrHome',
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        images: [],
        stock: 35,
        rating: 4.5,
        numReviews: 0,
        tags: ['purifier', 'home', 'air-quality', 'desktop'],
        specifications: {
          'CADR': '120 m³/h',
          'Noise Level': '22dB - 48dB',
          'Coverage': 'Up to 250 sq ft',
          'Filter Life': '6-8 Months'
        }
      },
      {
        name: 'Hyperion 14" Pro Laptop',
        description: 'Elite productivity laptop equipped with M-Series equivalent CPU, 32GB RAM, 1TB NVMe Gen4 SSD, and a gorgeous 120Hz mini-LED display.',
        price: 1499.99,
        discountPrice: 1399.99,
        category: 'Electronics',
        brand: 'Hyperion',
        image: 'https://images.unsplash.com/photo-1496181130204-755241544e35?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        images: [
          'https://images.unsplash.com/photo-1496181130204-755241544e35?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
        ],
        stock: 20,
        rating: 4.6,
        numReviews: 0,
        tags: ['laptop', 'computer', 'developer', 'pro'],
        specifications: {
          'CPU': '8-Core Ultra Processing Unit',
          'RAM': '32GB LPDDR5X',
          'Storage': '1TB NVMe PCIe 4.0 SSD',
          'Display': '14.2" Mini-LED (3024x1964)'
        }
      }
    ]);

    console.log('Products seeded...');
    console.log('Database Seeding Successful!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
