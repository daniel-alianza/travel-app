export function nombreMostradoDesdeCorreo(correo: string): string {
  const local = correo.trim().split("@")[0] ?? ""
  if (local === "") {
    return "Usuario"
  }
  return local
    .split(/[._-]+/)
    .filter((parte) => parte.length > 0)
    .map(
      (parte) =>
        parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase()
    )
    .join(" ")
}
