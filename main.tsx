import React, { useState } from 'react';

export default function ShoppingCart() {
  const [items, setItems] = useState(["Apple", "Banana"]);

  const addItem = () => {
    // ✅ الطريقة الصحيحة: بنعمل Array جديدة (New Reference)
    setItems([...items, "Orange"]);
  };

  return (
    <div>
      <ul>
        {items.map(item => <li key={item}>{item}</li>)}
      </ul>
      <button onClick={addItem}>Add Orange</button>
    </div>
  );
}
