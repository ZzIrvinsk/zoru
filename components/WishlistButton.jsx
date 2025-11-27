'use client'
import { useWishlist } from './WishlistContext'
import { Heart } from 'lucide-react' || (()=>null)
export default function WishlistButton({ product }) {
  const { items, toggle } = useWishlist()
  const is = items.find(p=>p.id===product.id)
  return (
    <button onClick={()=>toggle(product)} aria-label="wishlist" className="px-2 py-1">
      <span className={'text-sm ' + (is ? 'text-red-600' : 'text-gray-400')}>{is ? '♥' : '♡'}</span>
    </button>
  )
}
