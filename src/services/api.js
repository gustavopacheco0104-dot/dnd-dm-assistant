const BASE = 'https://www.dnd5eapi.co'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Error ${res.status} al consultar la API`)
  return res.json()
}

let monstersCache = null
let equipmentCache = null
let magicCache = null

export async function getMonsters() {
  if (!monstersCache) monstersCache = (await get('/api/monsters')).results
  return monstersCache
}

export const getMonster = (index) => get(`/api/monsters/${index}`)

export async function getEquipmentList() {
  if (!equipmentCache) equipmentCache = (await get('/api/equipment')).results
  return equipmentCache
}

export async function getMagicItems() {
  if (!magicCache) magicCache = (await get('/api/magic-items')).results
  return magicCache
}

// Recibe la url relativa que devuelve la API, ej: /api/equipment/club
export const getItemByUrl = (url) => get(url)