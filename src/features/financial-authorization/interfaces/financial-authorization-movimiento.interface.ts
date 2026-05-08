export interface FinancialAuthorizationMovimientoComprobado {
  id: string
  numeroMovimiento: number
  fecha: string
  descripcion: string
  categoria: string
  monto: number
  comentarioAlComprobar?: string
  /** Mock: el colaborador ya envió comprobación para este movimiento. Si es false, la solicitud no entra en cola solo por este ítem. */
  comprobacionUsuarioHecha?: boolean
  /** Mock: envío a SAP / facturación ya registrado para este movimiento. */
  facturadoSapMock?: boolean
  sapDocEntryMock?: string
}
