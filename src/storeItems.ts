export interface StoreItem {
  id: string
  title: string
  description: string
  price: number
}

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'pin',
    title: 'Pin',
    description: 'I spent a million dollars and all i got was this lousy pin.',
    price: 1_000_000,
  },
]

const priceById: Record<string, number> = Object.fromEntries(
  STORE_ITEMS.map((item) => [item.id, item.price]),
)

export function getStoreItemPrice(productId: string): number | undefined {
  return priceById[productId]
}
