export const getTimeAgo = (dateString: string) => {
  if (!dateString) return 'Fecha desconocida';
  
  const postDate = new Date(dateString);
  const now = new Date();
  
  // Calcular la diferencia en milisegundos
  const diffMs = now.getTime() - postDate.getTime();
  
  // Convertir a minutos, horas y días
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'Justo ahora';
  } else if (diffMinutes < 60) {
    return `Hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  } else {
    return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  }
};