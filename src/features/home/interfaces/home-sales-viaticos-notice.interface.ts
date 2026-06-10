export type HomeSalesViaticosNoticeKind = "solicitar" | "autorizar" | "dispersar"

export interface HomeSalesViaticosNoticeModel {
  visible: boolean
  kind: HomeSalesViaticosNoticeKind | null
  diasHabilesRestantes: number
  mesEtiqueta: string
  personasPendientes: number | null
  tituloAccion: string | null
  mensajePrincipal: string | null
  mensajeSecundario: string | null
  timeZone: string
}
