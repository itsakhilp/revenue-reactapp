import React, { useState, useEffect } from 'react';
import './App.css';

const formatNumber = (number) => {
  return number.toLocaleString('en-US', { style: 'currency', currency: 'INR' });
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const branch1Response = await fetch('api/branch1.json');
      const branch2Response = await fetch('api/branch2.json');
      const branch3Response = await fetch('api/branch3.json');

      const branch1Data = await branch1Response.json();
      const branch2Data = await branch2Response.json();
      const branch3Data = await branch3Response.json();

      const allProducts = [...branch1Data, ...branch2Data, ...branch3Data];

      // Merge products with the same name and sum their revenue
      const mergedProducts = allProducts.reduce((acc, product) => {
        const existingProduct = acc.find((p) => p.name === product.name);
        if (existingProduct) {
          existingProduct.revenue += product.revenue;
        } else {
          acc.push(product);
        }
        return acc;
      }, []);

      setProducts(mergedProducts);
      setFilteredProducts(mergedProducts);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update filtered products and total revenue whenever the search term changes
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const total = filtered.reduce((acc, product) => acc + product.revenue, 0);

    setFilteredProducts(filtered);
    setTotalRevenue(total);
  }, [searchTerm, products]);

  const handleChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="App">
      <h1>Revenue-Aggregator-Application</h1>
      <div className="search-container">
        <label htmlFor="search">Search Product: </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleChangeSearchTerm}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{formatNumber(product.revenue)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total Revenue (All Products):</td>
            <td>{formatNumber(totalRevenue)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default App;
