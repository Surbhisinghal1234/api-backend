import Product from "../models/Product.js"

export const handlePostProducts =async  (req,res) =>{
    try {
        console.log('body', req.body);
        const { id, name, price, description, image, category, featured } = req.body; 
    
        const product = new Product({
          id,
          name,
          price,
          description,
          image,
          category,
          featured, 
        });
    
        await product.save();  
        console.log('Product Saved', product);       
        res.json({ message: 'Product added successfully' });
      } catch (error) {
        console.error('Error', error);
        res.status(500).json({ error: 'Failed to add product' });
      }

}

