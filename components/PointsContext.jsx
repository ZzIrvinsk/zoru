'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
const PointsContext = createContext()
export function usePoints(){ return useContext(PointsContext) }

export default function PointsProvider({ children }){
  const [points, setPoints] = useState(0)
  useEffect(()=> {
    try{
      const raw = localStorage.getItem('zoru_points')
      if(raw) setPoints(Number(raw))
    }catch(e){}
  },[])
  useEffect(()=> {
    try{ localStorage.setItem('zoru_points', String(points)) }catch(e){}
  },[points])

  function earn(amount){ // amount in currency, convert to points e.g., 1$ = 10 points
    const p = Math.floor(amount * 10)
    setPoints(prev=>prev + p)
  }
  function spend(p){ setPoints(prev=>Math.max(0, prev - p)) }
  function clear(){ setPoints(0) }

  return (
    <PointsContext.Provider value={{ points, earn, spend, clear }}>
      {children}
    </PointsContext.Provider>
  )
}
