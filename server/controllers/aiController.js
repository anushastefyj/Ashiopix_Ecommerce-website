import OpenAI from 'openai';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

let openaiClient;
const getOpenAI = () => {
  if (!openaiClient) {
    const key = process.env.AI_API_KEY || 'mock';
    if (key !== 'mock' && !key.includes('xxxxx')) {
      openaiClient = new OpenAI({ apiKey: key });
    }
  }
  return openaiClient;
};

// Fallback algorithm for recommendations
const getFallbackRecommendations = async (product, limit = 4) => {
  // Find products in same category excluding the product itself
  let recommendations = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(limit);

  // If not enough, find high rated products
  if (recommendations.length < limit) {
    const extra = await Product.find({
      _id: { $ne: product._id, $nin: recommendations.map((p) => p._id) },
    })
      .sort({ rating: -1 })
      .limit(limit - recommendations.length);
    recommendations = [...recommendations, ...extra];
  }

  return recommendations;
};

// @desc    Get similar products
// @route   GET /api/recommendations/products/:id
// @access  Public
export const getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const openai = getOpenAI();
    if (!openai) {
      // Use fallback
      const fallback = await getFallbackRecommendations(product);
      return res.json(fallback);
    }

    // OpenAI implementation
    const allProducts = await Product.find({ _id: { $ne: product._id } }).select(
      'name description category brand price'
    );

    const prompt = `You are a product recommendation system for an e-commerce platform.
Target Product:
Name: ${product.name}
Description: ${product.description}
Category: ${product.category}
Brand: ${product.brand}
Price: $${product.price}

Available Products to choose from (in JSON):
${JSON.stringify(allProducts)}

Select the top 4 most similar or complementary products. Respond ONLY with a valid JSON array of their IDs (strings). No markdown formatting, no comments, no extra text. Example response: ["id1", "id2", "id3", "id4"]`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      });

      const content = response.choices[0].message.content.trim();
      const parsedIds = JSON.parse(content);

      if (Array.isArray(parsedIds)) {
        const recommendations = await Product.find({ _id: { $in: parsedIds } });
        return res.json(recommendations);
      }
    } catch (aiError) {
      console.error('AI recommendation failed, using fallback:', aiError);
    }

    const fallback = await getFallbackRecommendations(product);
    res.json(fallback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get personalized user recommendations
// @route   GET /api/recommendations/user/:userId
// @access  Private
export const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check auth permission
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find user's last orders to understand their purchase history
    const userOrders = await Order.find({ user: userId }).limit(3);
    const purchasedProductIds = [];
    userOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        purchasedProductIds.push(item.product);
      });
    });

    // Get some candidate products
    let candidates = [];
    if (purchasedProductIds.length > 0) {
      // Find products in same categories as purchased
      const purchasedProducts = await Product.find({ _id: { $in: purchasedProductIds } });
      const categories = purchasedProducts.map((p) => p.category);

      candidates = await Product.find({
        category: { $in: categories },
        _id: { $nin: purchasedProductIds },
      }).limit(6);
    }

    // Fallback if no purchases or candidates
    if (candidates.length === 0) {
      candidates = await Product.find({}).sort({ rating: -1 }).limit(6);
    }

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
