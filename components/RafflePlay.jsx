'use client'
import { useState, useEffect } from 'react'

export default function RafflePlay(){
  const [tickets, setTickets] = useState([])
  const [count, setCount] = useState(1)
  const [entries, setEntries] = useState([])

  useEffect(()=> {
    try{
      const raw = JSON.parse(localStorage.getItem('zoru_raffle') || '[]')
      setEntries(raw)
    }catch(e){}
  },[])

  function buy(){
    const newTickets = []
    for(let i=0;i<count;i++){
      const t = { id: Date.now() + Math.random(), buyer: 'anon', ts: Date.now() }
      newTickets.push(t)
    }
    const all = [...entries, ...newTickets]
    localStorage.setItem('zoru_raffle', JSON.stringify(all))
    setEntries(all)
    setTickets(newTickets)
    alert('Compraste ' + count + ' ticket(s). ¡Mucha suerte!')
  }

  function draw(){
    if(entries.length===0) return alert('No hay tickets')
    const winner = entries[Math.floor(Math.random()*entries.length)]
    alert('GANADOR: ticket ' + winner.id)
  }

  return (
    <div className="p-6 border rounded">
      <div className="flex gap-3 items-center mb-4">
        <label className="text-sm">Tickets a comprar:</label>
        <input type="number" min="1" value={count} onChange={e=>setCount(Number(e.target.value))} className="w-20 border px-2 py-1 rounded" />
        <button onClick={buy} className="px-4 py-2 bg-black text-white rounded">Comprar ticket(s)</button>
      </div>
      <div className="mb-3 text-sm text-gray-500">Tickets totales: {entries.length}</div>
      <div className="flex gap-2">
        <button onClick={draw} className="px-4 py-2 border rounded">Sorteo (admin)</button>
        <button onClick={()=>{ localStorage.removeItem('zoru_raffle'); setEntries([]) }} className="px-4 py-2 text-red-500">Limpiar</button>
      </div>
    </div>
  )
}
