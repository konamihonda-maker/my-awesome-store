// src/ProductForm.jsx
import { useState, useEffect } from 'react';

function ProductForm({ onProductAdded, editingProduct, onCancelEdit }) {
  // State for form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  // 💡 NEW: Watch for "editingProduct". When it changes, fill the form!
  useEffect(() => {
    if (editingProduct) {
      // We are in "Edit Mode" - fill the boxes
      setName(editingProduct.name);
      setDescription(editingProduct.description || ''); // Handle null descriptions
      setPrice(editingProduct.price);
      setStock(editingProduct.stock);
      setMessage(`Editing: ${editingProduct.name}`);
    } else {
      // We are in "Add Mode" - clear the boxes
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setMessage('');
    }
    // Always clear the file input when switching modes
    setSelectedFile(null);
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = "";
  }, [editingProduct]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(editingProduct ? 'Updating product...' : 'Adding product...');

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('description', description);
    formDataToSend.append('price', price);
    formDataToSend.append('stock', stock);
    if (selectedFile) {
        formDataToSend.append('imageFile', selectedFile);
    }

    try {
      // 💡 LOGIC SWITCH: Are we Adding (POST) or Editing (PUT)?
      let url = 'http://localhost:3000/api/products';
      let method = 'POST';

      if (editingProduct) {
        url = `http://localhost:3000/api/products/${editingProduct.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success! ${editingProduct ? 'Product updated.' : 'Product added.'}`);
        
        // Clear everything
        setName(''); setDescription(''); setPrice(''); setStock('');
        setSelectedFile(null);
        document.getElementById('fileInput').value = "";
        
        // Tell App.jsx to refresh the list
        onProductAdded(); 
      } else {
        setMessage(`Error: ${data.message || 'Operation failed'}`);
      }

    } catch (error) {
      console.error('Network error:', error);
      setMessage('Network error. Check console.');
    }
  };

  return (
    <div className="product-form">
      {/* Dynamic Title */}
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Product Name" 
          required 
        />
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Description"
        ></textarea>
        
        <input 
          type="number" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          placeholder="Price" 
          min="0" 
          step="0.01" 
          required 
        />
        
        <input 
          type="number" 
          value={stock} 
          onChange={(e) => setStock(e.target.value)} 
          placeholder="Stock Quantity" 
          min="0" 
          required 
        />
        
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666'}}>
              {editingProduct ? 'Change Image (Optional):' : 'Product Image:'}
            </label>
            <input 
                id="fileInput"
                type="file" 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/jpg" 
                style={{ padding: '5px' }} 
            />
        </div>

        {/* Dynamic Buttons */}
        <button type="submit" style={{ backgroundColor: editingProduct ? '#fbbf24' : '#2563eb', color: editingProduct ? 'black' : 'white' }}>
            {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        
        {/* Cancel Button (Only shows when editing) */}
        {editingProduct && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            style={{ marginTop: '10px', backgroundColor: '#9ca3af', color: 'white' }}
          >
            Cancel Edit
          </button>
        )}

      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ProductForm;