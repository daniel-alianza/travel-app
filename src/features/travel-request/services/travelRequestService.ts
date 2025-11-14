import type { TravelRequestFormData, TravelRequestResponse } from '../interfaces';

const createTravelRequest = async (
  _data: TravelRequestFormData
): Promise<TravelRequestResponse> => {
  // TODO: Implementar lógica real con API cuando el backend esté listo
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    message: 'Solicitud de viaje creada exitosamente',
  };
};

const travelRequestService = {
  createTravelRequest,
};

export default travelRequestService;

