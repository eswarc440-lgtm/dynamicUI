/**
 * High Quality Topic Image Resolver
 * Automatically picks relevant high-resolution Unsplash photos for any topic keyword
 */

const TOPIC_IMAGE_MAP: Record<string, string[]> = {
  pizza: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
  ],
  burger: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
    "https://images.unsplash.com/photo-1550547660-d9450f859349"
  ],
  biryani: [
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0"
  ],
  chinese: [
    "https://images.unsplash.com/photo-1585032226651-759b368d7246",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d"
  ],
  dessert: [
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
    "https://images.unsplash.com/photo-1587314168485-3236d6710814"
  ],
  healthy: [
    "https://images.unsplash.com/photo-1540420773420-3366772f4999",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
  ],
  food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327"
  ],
  sushi: [
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    "https://images.unsplash.com/photo-1611143669185-af224c5e3252"
  ],
  coffee: [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
  ],
  fashion: [
    "https://images.unsplash.com/photo-1445205170230-053b83016050",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
  ],
  tech: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1518770660439-4636190af475"
  ],
  fitness: [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
  ],
  travel: [
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  ],
  study: [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8"
  ],
  meditation: [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597"
  ],
  water: [
    "https://images.unsplash.com/photo-1548839140-29a749e1bc4e",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2"
  ],
  health: [
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae"
  ],
  read: [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6"
  ]
};

export function getTopicImageUrl(topic: string, width = 800): string {
  const t = (topic || '').toLowerCase();
  for (const [key, urls] of Object.entries(TOPIC_IMAGE_MAP)) {
    if (t.includes(key)) {
      const selected = urls[Math.floor(Math.random() * urls.length)];
      return `${selected}?w=${width}&auto=format&fit=crop&q=80`;
    }
  }
  return `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=${width}&auto=format&fit=crop&q=80`;
}
