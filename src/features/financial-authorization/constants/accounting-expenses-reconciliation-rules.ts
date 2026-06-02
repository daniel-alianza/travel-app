export const REGLAS_CONCILIACION_VIATICOS = {
  alcance: {
    titulo: "Solicitudes del periodo",
    descripcion:
      "Solo solicitudes ya dispersadas. Las fechas del filtro aplican a la dispersión, no a la fecha en que se comprobó el gasto.",
  },
  solicitado: {
    titulo: "Viáticos dispersados",
    descripcion:
      "Monto total dispersado por solicitud al confirmar el pago de viáticos.",
  },
  comprobado: {
    titulo: "Gastos comprobados",
    descripcion:
      "Suma de comprobaciones enviadas o ya autorizadas por contabilidad. No se incluyen las rechazadas.",
  },
  pendientePorComprobar: {
    titulo: "Pendiente por comprobar",
    descripcion:
      "Por solicitud: la diferencia entre lo dispersado y lo comprobado, sin valores negativos.",
  },
  porcentaje: {
    titulo: "Avance de comprobación",
    descripcion:
      "Porcentaje de lo comprobado respecto a lo dispersado en el periodo seleccionado, con tope del 100 %.",
  },
  pendienteContable: {
    titulo: "Pendiente autorización contable",
    descripcion:
      "Monto de comprobaciones enviadas que contabilidad aún no ha autorizado.",
  },
  periodo: {
    titulo: "Periodo",
    descripcion:
      "Rango inclusivo en zona horaria de la aplicación. Por defecto: del día 1 al último día del mes en curso.",
  },
  auditoria: {
    titulo: "Trazabilidad",
    descripcion:
      "Cada fila debe poder rastrearse a solicitud, usuario solicitante, empresa y fechas de dispersión y última comprobación.",
  },
} as const

export const ETIQUETAS_ESTADO_SOLICITUD_AUDITORIA = {
  sin_comprobacion: "Sin comprobación",
  parcial: "Comprobación parcial",
  completa: "Comprobación completa",
  excedente: "Comprobado mayor a dispersado",
} as const
