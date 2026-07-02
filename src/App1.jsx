import React from 'react'
import { useState, useEffect } from "react";
import Header from './Header.jsx';

/*
const fetchProducts = async () => {
  const response = await fetch('https://skinguide.beauty/api/products?perPage=2');
  return await response.json();
};
*/

fetch(`https://skinguide.beauty/api`)
  .then((response) => response.json())
  .then((data) => {
    // 1. LOOK HERE FIRST: Open your browser console to inspect this!
    console.log("This is what my API returns:", data);

    // 2. Comment this out until you know the exact structure
    // setData(data.facts); 
  })
  .catch((error) => console.error(error));

/*

export default function App1() {
  //state: store product once they load
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
  //use effect runs fetch when component first loads
useEffect(() => {
    // OPTION B: Or, you can define the async function right inside the useEffect
    const getData = async () => {
      try {
        const data = await fetchProducts(); // Calling our helper function
        setProducts(data);                  // Saving data to React state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);                  // Turn off loading spinner
      }
    };

    getData(); 
  }, []); // <--- Crucial: The empty array means "only run this ONCE when the app loads"

  // 3. JSX: Render your UI based on the state
  if (loading) return <p>Loading skincare products...</p>;

*/

