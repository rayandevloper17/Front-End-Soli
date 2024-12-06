import React, { useState } from 'react';
import ListProducts from './ListProducts';
import ListSoldProducts from './ListSoldProducts';
import './CSs/ListProduct.css';

const ListProduct = () => {
    const [activeSection, setActiveSection] = useState('products'); // 'products' or 'soldProducts'

    return (
        <div className="list-product">
            <div className="button-group">
          
              
            </div>

            {activeSection === 'products' && <ListProducts />}
            {activeSection === 'soldProducts' && <ListSoldProducts />}
        </div>
    );
};

export default ListProduct;
