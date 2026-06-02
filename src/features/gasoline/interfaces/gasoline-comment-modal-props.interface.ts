export interface GasolineCommentModalProps {
  abierto: boolean
  titulo: string
  descripcion: string
  etiquetaComentario: string
  comentario: string
  comentarioObligatorio?: boolean
  confirmarTexto: string
  cargando: boolean
  onComentarioChange: (valor: string) => void
  onCerrar: () => void
  onConfirmar: () => void
}
