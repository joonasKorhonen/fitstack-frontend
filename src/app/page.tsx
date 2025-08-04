'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [ping, setPing] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/ping')
      .then((res) => {
        setPing(res.data);
      })
      .catch((err) => {
        setPing('Virhe: ' + err.message);
      });
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-center">FitStack 💪</h1>
      <p className="text-center mt-4">Yhteys backendiin: {ping}</p>
    </main>
  );
}