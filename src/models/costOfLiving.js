// Yaklaşık değerler (demo amaçlı, aylık TL). Gerçek bir API yerine statik veri.
export const costOfLiving = {
  Kadıköy: { rent: 30000, living: 18000 },
  Beşiktaş: { rent: 35000, living: 19000 },
  Beyoğlu: { rent: 28000, living: 17000 },
  Şişli: { rent: 30000, living: 18000 },
  Üsküdar: { rent: 25000, living: 16000 },
  Ataşehir: { rent: 27000, living: 16500 },
}

export const defaultCost = { rent: 25000, living: 16000 }
export const districts = Object.keys(costOfLiving)
export const getCost = (district) => costOfLiving[district] ?? defaultCost
