// Genera un avatar con letra inicial y color basado en el nombre
export function generateInitialAvatar(name, size = 48) {
  const initial = name?.charAt(0).toUpperCase() || '?';
  
  // Colores consistentes basados en el nombre
  const colors = [
    '#3D7A4F', // Verde
    '#D4622A', // Naranja
    '#F59E0B', // Amarillo
    '#22C55E', // Verde claro
    '#8B5CF6', // Púrpura
    '#0EA5E9', // Azul
    '#EC4899', // Rosa
    '#6366F1'  // Índigo
  ];

  // Generar índice de color basado en el nombre
  const colorIndex = name
    ? name.charCodeAt(0) % colors.length
    : 0;
  
  const bgColor = colors[colorIndex];

  // Crear SVG data URL para el avatar
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-size="${size * 0.5}" 
        font-weight="700" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="central"
        font-family="'DM Sans', sans-serif"
      >
        ${initial}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
