export type TravelRequestTripSubmitFieldErrorKey =
  | "destinoViaje"
  | "motivoViaje"
  | "fechaSalida"
  | "fechaRegreso"
  | "fechaDispersion"
  | "gastosEstimados"
  | "objetivos"
  | "gasolinaTarjeta"
  | "gasolinaPlaca"
  | "gasolinaKilometraje"
  | "gasolinaMonto"
  | "gasolinaDistancia"
  | "tagMonto"

export type TravelRequestTripSubmitFieldErrors = Partial<
  Record<TravelRequestTripSubmitFieldErrorKey, string>
>
