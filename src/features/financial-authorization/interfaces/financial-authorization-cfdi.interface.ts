export interface FinancialAuthorizationCfdiFilaGeneral {
  etiqueta: string
  valor: string
}

export interface FinancialAuthorizationCfdiFilaConcepto {
  descripcion: string
  cantidad: number
  importe: number
  iva: number
  base: number
  impuesto: string
  impuestoLetra: string
}

export interface FinancialAuthorizationCfdiFilaTraslado {
  impuesto: string
  impuestoLetra: string
  tipoFactor: string
  tasaOCuota: string
  importe: number
}

export interface FinancialAuthorizationCfdiVistaTabla {
  uuidFiscal: string
  generales: FinancialAuthorizationCfdiFilaGeneral[]
  conceptos: FinancialAuthorizationCfdiFilaConcepto[]
  traslados: FinancialAuthorizationCfdiFilaTraslado[]
}

export interface FinancialAuthorizationCfdiCampoXml {
  campo: string
  valor: string
}

export interface FinancialAuthorizationExtrasXmlPartidos {
  comprobante: FinancialAuthorizationCfdiCampoXml[]
  conceptoXml: FinancialAuthorizationCfdiCampoXml[]
  timbre: FinancialAuthorizationCfdiCampoXml[]
}
