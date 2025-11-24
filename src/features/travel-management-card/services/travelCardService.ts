import { travelApi } from '@/infrastructure/http/axiosInstance';
import type { Card, User, CardAssignmentFormData } from '../interfaces';

interface BackendCard {
  id: number;
  cardNumber: string;
  companyId: number;
  isActive: boolean;
  company: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface BackendCardAssignment {
  id: number;
  cardId: number;
  userId: number;
  assignedAt: string;
  unassignedAt: string | null;
  card: {
    id: number;
    cardNumber: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface BackendUser {
  id: number;
  name: string;
  email: string;
  company: {
    id: number;
    name: string;
  };
  isActive: boolean;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  error: null;
}

function mapBackendCardToFrontendCard(
  backendCard: BackendCard,
  assignment?: BackendCardAssignment,
): Card {
  return {
    id: String(backendCard.id),
    numero: backendCard.cardNumber,
    banco: backendCard.company.name,
    estado: backendCard.isActive ? 'activa' : 'desactivada',
    fechaAsignacion: assignment?.assignedAt
      ? new Date(assignment.assignedAt).toISOString().split('T')[0]
      : '',
    fechaDesactivacion: assignment?.unassignedAt
      ? new Date(assignment.unassignedAt).toISOString().split('T')[0]
      : undefined,
  };
}

function mapBackendUserToFrontendUser(
  backendUser: BackendUser,
  assignments: BackendCardAssignment[],
  allCards: BackendCard[],
): User {
  const userCards = assignments
    .filter(assignment => !assignment.unassignedAt)
    .map(assignment => {
      const card = allCards.find(c => c.id === assignment.cardId);
      if (card) {
        return mapBackendCardToFrontendCard(card, assignment);
      }
      return null;
    })
    .filter((card): card is Card => card !== null);

  return {
    id: String(backendUser.id),
    nombre: backendUser.name,
    email: backendUser.email,
    compania: backendUser.company.name,
    activo: backendUser.isActive,
    tarjetas: userCards,
  };
}

const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await travelApi.get<ApiResponse<BackendUser[]>>('/users');
    return response.data.data.map(user => ({
      id: String(user.id),
      nombre: user.name,
      email: user.email,
      compania: user.company.name,
      activo: user.isActive,
      tarjetas: [],
    }));
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

const getAllCards = async (): Promise<Card[]> => {
  try {
    const response = await travelApi.get<ApiResponse<BackendCard[]>>('/cards');
    return response.data.data.map(card => mapBackendCardToFrontendCard(card));
  } catch (error) {
    console.error('Error obteniendo tarjetas:', error);
    throw error;
  }
};

const getAssignmentsByUserId = async (
  userId: number,
): Promise<BackendCardAssignment[]> => {
  try {
    const response = await travelApi.get<ApiResponse<BackendCardAssignment[]>>(
      `/cards/user/${userId}/assignments`,
    );
    return response.data.data;
  } catch (error) {
    console.error('Error obteniendo asignaciones:', error);
    throw error;
  }
};

const getBulkAssignments = async (
  userIds: number[],
  limit: number = 10,
  offset: number = 0,
): Promise<BackendCardAssignment[]> => {
  try {
    const response = await travelApi.get<ApiResponse<BackendCardAssignment[]>>(
      '/cards/assignments/bulk',
      {
        params: {
          userIds: userIds.join(','),
          limit,
          offset,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Error obteniendo asignaciones bulk:', error);
    throw error;
  }
};

const getUsersWithCards = async (): Promise<{
  users: User[];
  cards: Card[];
}> => {
  try {
    const [usersResponse, cardsResponse] = await Promise.all([
      travelApi.get<ApiResponse<BackendUser[]>>('/users'),
      travelApi.get<ApiResponse<BackendCard[]>>('/cards'),
    ]);

    const backendUsers = usersResponse.data.data;
    const allCards = cardsResponse.data.data;
    const userIds = backendUsers.map(user => user.id);
    let allAssignments: BackendCardAssignment[] = [];

    if (userIds.length > 0) {
      try {
        allAssignments = await getBulkAssignments(userIds);
      } catch (error) {
        console.error('Error obteniendo asignaciones bulk:', error);
        allAssignments = [];
      }
    }
    const assignmentsByUserId = new Map<number, BackendCardAssignment[]>();
    allAssignments.forEach(assignment => {
      const userId = assignment.userId;
      if (!assignmentsByUserId.has(userId)) {
        assignmentsByUserId.set(userId, []);
      }
      assignmentsByUserId.get(userId)!.push(assignment);
    });

    const usersWithAssignments = backendUsers.map(user => {
      const assignments = assignmentsByUserId.get(user.id) ?? [];
      return mapBackendUserToFrontendUser(user, assignments, allCards);
    });

    const frontendCards = allCards.map(card =>
      mapBackendCardToFrontendCard(card),
    );

    return {
      users: usersWithAssignments,
      cards: frontendCards,
    };
  } catch (error) {
    console.error('Error obteniendo usuarios con tarjetas:', error);
    throw error;
  }
};

const assignCard = async (
  data: CardAssignmentFormData,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await travelApi.post<ApiResponse<BackendCardAssignment>>(
      '/cards/assign',
      {
        cardId: Number(data.tarjetaId),
        userId: Number(data.usuarioId),
      },
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error asignando tarjeta:', error);
    throw error;
  }
};

const unassignCard = async (
  cardId: number,
  userId: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await travelApi.post<ApiResponse<null>>(
      '/cards/unassign',
      {
        cardId,
        userId,
      },
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error desasignando tarjeta:', error);
    throw error;
  }
};

const createCard = async (
  cardNumber: string,
  companyName: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    // Primero obtener todas las empresas para encontrar el ID
    const usersResponse = await travelApi.get<ApiResponse<BackendUser[]>>(
      '/users',
    );
    const companies = usersResponse.data.data.map(user => user.company);
    const uniqueCompanies = Array.from(
      new Map(companies.map(c => [c.id, c])).values(),
    );
    const company = uniqueCompanies.find(c => c.name === companyName);

    if (!company) {
      throw new Error(`Empresa "${companyName}" no encontrada`);
    }

    const response = await travelApi.post<ApiResponse<BackendCard>>('/cards', {
      cardNumber,
      companyId: company.id,
    });

    return {
      success: true,
      message: response.data.message || 'Tarjeta creada exitosamente',
    };
  } catch (error) {
    console.error('Error creando tarjeta:', error);
    throw error;
  }
};

export const travelCardService = {
  getAllUsers,
  getAllCards,
  getUsersWithCards,
  assignCard,
  unassignCard,
  getAssignmentsByUserId,
  createCard,
};
