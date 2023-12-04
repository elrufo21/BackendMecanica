export const getExtensionFromMimeType = (mimeType) => {
  const parts = mimeType.split("/");
  if (parts.length === 2) {
    return parts[1]; // Tomar el segundo elemento si hay dos partes
  } else {
    return null; // Devolver null en caso de un formato de tipo MIME no válido
  }
};
