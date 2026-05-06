export interface ExpenseViajeResumen {
  id: string
  solicitudId: string
  titulo: string
  motivo: string
  emailSolicitante: string
  compania: string
  montoSolicitado: number
  fechaAutorizacion: string
  numeroTarjeta: string
  fechaSalida: string
  fechaRegreso: string
  pendientesComprobacion: number
}
