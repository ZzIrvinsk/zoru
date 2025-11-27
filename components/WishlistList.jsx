'use client'
import { useWishlist } from './WishlistContext'
import Link from 'next/link'
import Image from 'next/image'

export default function WishlistList(){
  const { items, remove, clear } = useWishlist()
  if(items.length===0) return <p className="text-gray-500">No hay items guardados.</p>
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(p=>(
          <div key={p.id} className="p-4 border rounded flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-100 relative">
              <Image src={p.image} alt={p.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <Link href={'/producto/'+p.slug} className="font-semibold">{p.title}</Link>
              <div className="text-sm text-gray-500">${p.price}</div>
            </div>
            <div>
              <button className="text-red-500" onClick={()=>remove(p.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 bg-black text-white rounded" onClick={()=>clear()}>Vaciar wishlist</button>
      </div>
    </div>
  )
}
