// Mock product data for e-commerce shoe store

const brands = [
  'Nike', 
  'Adidas', 
  'Puma', 
  'Reebok', 
  'New Balance', 
  'Vans', 
  'Converse', 
  'Under Armour', 
  'Asics', 
  'Fila'
];

const categories = [
  'Men', 
  'Women', 
  'Children', 
  'Sport', 
  'Casual', 
  'Formal', 
  'Running', 
  'Basketball', 
  'Hiking', 
  'Lifestyle'
];

const colors = [
  'Black', 
  'White', 
  'Red', 
  'Blue', 
  'Green', 
  'Yellow', 
  'Grey', 
  'Brown', 
  'Navy', 
  'Purple', 
  'Orange', 
  'Pink', 
  'Multicolor'
];

const shoeModels = [
  'Air Max',
  'Ultra Boost',
  'Classic Leather',
  'Chuck Taylor',
  'Old Skool',
  'Suede Classic',
  'Fresh Foam',
  'Gel-Kayano',
  'ClimaCool',
  'Disruptor',
  'Cortez',
  'SuperStar',
  'Authentic',
  'RS-X',
  'Blazer',
  'ZigTech',
  'Ignite',
  'Club C',
  'Stan Smith',
  'Sk8-Hi'
];

const productDescriptions = [
  'Premium athletic shoes with excellent comfort and durability. Featuring breathable mesh upper, cushioned insole, and responsive midsole for energy return with every step.',
  'Stylish and comfortable casual shoes perfect for everyday wear. Made with high-quality materials and attention to detail for long-lasting performance.',
  'Professional running shoes designed for superior performance. Lightweight construction with advanced cushioning technology to reduce impact and improve speed.',
  'Classic design meets modern technology in these iconic shoes. Durable construction with timeless style that goes with everything in your wardrobe.',
  'Luxury formal shoes crafted with premium materials. Elegant design with cushioned footbed for all-day comfort in professional settings.',
  'High-performance basketball shoes with excellent ankle support and court grip. Designed with professional athletes for optimal play.',
  'Versatile training shoes ideal for various workout activities. Flexible sole with stability features to support multidirectional movement.',
  'Lightweight hiking shoes with rugged outsole for excellent traction on various terrains. Waterproof materials keep feet dry in all conditions.',
  'Trendy lifestyle shoes that make a fashion statement. Unique design elements with comfort features for everyday wear.',
  'Eco-friendly shoes made with sustainable materials. Stylish design with minimal environmental impact for the conscious consumer.'
];

// Generate 40 unique mock products
export const mockProducts = Array.from({ length: 40 }, (_, index) => {
  // Determine brand and model
  const brandIndex = index % brands.length;
  const brand = brands[brandIndex];
  const modelIndex = Math.floor(index / 2) % shoeModels.length;
  const model = shoeModels[modelIndex];
  
  // Generate other properties with some randomization
  const categoryIndex = Math.floor(Math.random() * categories.length);
  const category = categories[categoryIndex];
  
  const colorIndex = Math.floor(Math.random() * colors.length);
  const color = colors[colorIndex];
  
  const descriptionIndex = index % productDescriptions.length;
  const description = productDescriptions[descriptionIndex];
  
  // Generate price between $59.99 and $199.99
  const price = (Math.floor(Math.random() * 14) * 10 + 59.99).toFixed(2);
  
  // Generate stock between 0 and 25
  const countInStock = Math.floor(Math.random() * 26);
  
  // Generate sizes (between 5-13)
  const allSizes = ['5', '6', '7', '8', '9', '10', '11', '12', '13'];
  const availableSizeCount = Math.floor(Math.random() * 5) + 3; // Between 3 and 7 sizes
  const sizes = [];
  
  for (let i = 0; i < availableSizeCount; i++) {
    const sizeIndex = Math.floor(Math.random() * allSizes.length);
    const size = allSizes[sizeIndex];
    if (!sizes.includes(size)) {
      sizes.push(size);
    }
    allSizes.splice(sizeIndex, 1);
  }
  
  // Sort sizes numerically
  sizes.sort((a, b) => parseInt(a) - parseInt(b));
  
  // Generate rating between 3.0 and 5.0
  const rating = (Math.random() * 2 + 3).toFixed(1);
  
  // Generate number of reviews between 5 and 100
  const numReviews = Math.floor(Math.random() * 96) + 5;
  
  // Generate creation date (within the last year)
  const daysAgo = Math.floor(Math.random() * 365);
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  // Determine if product is featured (20% chance)
  const featured = Math.random() < 0.2;
  
  // Images using placeholder but with color and size
  const imageId = Math.floor(Math.random() * 1000);
  const imageColor = color.toLowerCase().replace(' ', '');
  const image = `https://placehold.co/600x400/${imageColor}/white?text=${brand}+${model}`;
  
  return {
    _id: `product-${index + 1}`,
    name: `${brand} ${model} ${color}`,
    brand,
    category,
    description,
    price: parseFloat(price),
    countInStock,
    sizes,
    image,
    rating: parseFloat(rating),
    numReviews,
    createdAt,
    featured,
    color
  };
});

export default mockProducts; 