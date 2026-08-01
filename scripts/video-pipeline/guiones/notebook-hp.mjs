export const id = "notebook-hp";

// Primer video de producto real, usando los hooks verificados (comparativa
// de precio real + urgencia real + insignia "Más vendido" confirmada a mano
// en Mercado Libre — ver data/productos.json, masVendido:true).
export const bloques = [
  {
    id: "gancho",
    texto: "¿Pagar precio completo por un notebook nuevo? Esto es lo que te estás perdiendo.",
    tomas: [
      { imagenPrompt: "Close-up of a modern laptop on a desk, screen glowing, dramatic side lighting, no visible faces, photorealistic vertical photo" },
      { imagenPrompt: "Hands typing on a laptop keyboard, close-up, warm lighting, no visible face, photorealistic vertical photo" },
    ],
    keyword: null,
  },
  {
    id: "contexto",
    texto: "Este notebook HP, con Ryzen 3, 8GB de RAM y 512GB de almacenamiento, está de los más vendidos en Mercado Libre ahora mismo — no lo decimos nosotros, lo dice la insignia real de la plataforma.",
    tomas: [
      { imagenPrompt: "Modern laptop with visible specs overlay style, silver aluminum body, dramatic lighting, no visible faces, photorealistic vertical photo" },
      { imagenPrompt: "Close-up of a laptop screen showing a colorful desktop wallpaper, blurred background, photorealistic vertical photo" },
      { imagenPrompt: "Wide shot of a clean minimalist desk setup with a laptop, plant, and coffee cup, photorealistic vertical photo" },
    ],
    keyword: "MÁS VENDIDO",
  },
  {
    id: "problema",
    texto: "El precio normal es 579 mil pesos. Pero los precios en estas plataformas cambian todo el tiempo — lo que hoy tiene descuento, mañana puede volver a su precio normal, sin aviso.",
    tomas: [
      { imagenPrompt: "Close-up of a price tag with a crossed-out higher price, dramatic lighting, no visible faces, photorealistic vertical photo" },
      { imagenPrompt: "Close-up of a smartphone screen showing a price chart going up and down, dim lighting, photorealistic vertical photo" },
    ],
    keyword: "$579.990",
  },
  {
    id: "giro",
    texto: "Ahora mismo está a 389 mil, un 32% menos. No es una táctica de venta — es cómo funciona el mercado, y por eso lo filtramos y lo dejamos en AvíspateYa todos los días.",
    tomas: [
      { imagenPrompt: "Close-up of a discount tag showing a large percentage off, green and white colors, no visible faces, photorealistic vertical photo" },
      { imagenPrompt: "Laptop with a subtle glowing checkmark icon overlay, clean modern aesthetic, no visible faces, photorealistic vertical photo" },
    ],
    keyword: "-32% OFF",
  },
  {
    id: "cta",
    texto: "Revisalo hoy en AvíspateYa — el precio que ves ahora no está garantizado para mañana. Link en el primer comentario.",
    imagenPrompt: "Close-up of hands holding a smartphone showing a shopping website, blurred modern desk background, photorealistic vertical photo",
    keyword: null,
  },
];
