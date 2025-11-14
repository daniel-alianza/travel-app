import { useState, useMemo } from 'react';
import type {
  TravelRequest,
  ApprovalRequestsFilters,
} from '../interfaces';
import travelRequestReviewService from '../services/travelRequestReviewService';

const defaultFilters: ApprovalRequestsFilters = {
  searchTerm: '',
  companyFilter: 'all',
  statusFilter: 'all',
  showDispersed: false,
};

const useApprovalRequests = () => {
  const [filters, setFilters] = useState<ApprovalRequestsFilters>(defaultFilters);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    undefined
  );

  const [requests, setRequests] = useState<TravelRequest[]>([
    {
      id: 1,
      employee: 'María González',
      position: 'Gerente de Ventas',
      company: 'Alianza Eléctrica',
      reason:
        'Reunión con clientes potenciales y presentación de nuevos productos',
      startDate: '20 Oct 2024',
      endDate: '23 Oct 2024',
      objectives: [
        'Presentar nueva línea de productos',
        'Cerrar contratos con 3 clientes clave',
        'Evaluar mercado regional',
      ],
      status: 'pending',
      dispersed: false,
      expenses: {
        transporte: 800,
        peajes: 150,
        hospedaje: 1200,
        alimentos: 400,
        fletes: 0,
        herramientas: 0,
        enviosMensajeria: 50,
        miscelaneos: 100,
      },
    },
    {
      id: 2,
      employee: 'Carlos Ramírez',
      position: 'Director de Operaciones',
      company: 'Alianza Eléctrica',
      reason: 'Supervisión de nueva sucursal y capacitación de personal',
      startDate: '25 Oct 2024',
      endDate: '27 Oct 2024',
      objectives: [
        'Supervisar instalación de equipos',
        'Capacitar equipo técnico',
        'Establecer protocolos operativos',
        'Auditar procesos de seguridad',
      ],
      status: 'pending',
      dispersed: false,
      expenses: {
        transporte: 600,
        peajes: 100,
        hospedaje: 900,
        alimentos: 300,
        fletes: 500,
        herramientas: 800,
        enviosMensajeria: 0,
        miscelaneos: 50,
      },
    },
    {
      id: 3,
      employee: 'Ana Martínez',
      position: 'Coordinadora de Marketing',
      company: 'Alianza Eléctrica',
      reason: 'Conferencia de marketing digital y networking',
      startDate: '15 Oct 2024',
      endDate: '17 Oct 2024',
      objectives: [
        'Asistir a conferencia anual',
        'Networking con proveedores',
        'Actualización en tendencias digitales',
      ],
      status: 'approved',
      dispersed: true,
      expenses: {
        transporte: 700,
        peajes: 80,
        hospedaje: 1000,
        alimentos: 350,
        fletes: 0,
        herramientas: 0,
        enviosMensajeria: 0,
        miscelaneos: 50,
      },
    },
    {
      id: 4,
      employee: 'Roberto Silva',
      position: 'Analista Financiero',
      company: 'Alianza Eléctrica',
      reason: 'Congreso de finanzas corporativas',
      startDate: '10 Oct 2024',
      endDate: '12 Oct 2024',
      objectives: [
        'Participar en congreso nacional',
        'Actualización normativa fiscal',
      ],
      status: 'rejected',
      dispersed: false,
      expenses: {
        transporte: 1200,
        peajes: 0,
        hospedaje: 1500,
        alimentos: 450,
        fletes: 0,
        herramientas: 0,
        enviosMensajeria: 0,
        miscelaneos: 50,
      },
    },
    {
      id: 5,
      employee: 'Laura Pérez',
      position: 'Ingeniera de Proyectos',
      company: 'Tecnología Avanzada',
      reason: 'Instalación de sistemas eléctricos en planta industrial',
      startDate: '05 Oct 2024',
      endDate: '08 Oct 2024',
      objectives: [
        'Supervisar instalación de sistemas',
        'Capacitar personal técnico',
        'Validar cumplimiento de normas',
      ],
      status: 'approved',
      dispersed: true,
      expenses: {
        transporte: 900,
        peajes: 120,
        hospedaje: 1100,
        alimentos: 380,
        fletes: 600,
        herramientas: 450,
        enviosMensajeria: 80,
        miscelaneos: 70,
      },
    },
  ]);

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      if (filters.showDispersed && !request.dispersed) return false;
      if (!filters.showDispersed && request.dispersed) return false;

      if (
        filters.searchTerm &&
        !request.employee.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.companyFilter !== 'all' &&
        request.company !== filters.companyFilter
      ) {
        return false;
      }

      if (
        filters.statusFilter !== 'all' &&
        request.status !== filters.statusFilter
      ) {
        return false;
      }

      return true;
    });
  }, [requests, filters]);

  const companies = useMemo(() => {
    const uniqueCompanies = Array.from(new Set(requests.map(r => r.company)));
    return uniqueCompanies;
  }, [requests]);

  const updateFilter = (key: keyof ApprovalRequestsFilters, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const approveRequest = async (id: number) => {
    try {
      await travelRequestReviewService.approveRequest(id);
      setRequests(
        requests.map(req =>
          req.id === id ? { ...req, status: 'approved' as const } : req
        )
      );
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
    }
  };

  const rejectRequest = async (id: number) => {
    try {
      await travelRequestReviewService.rejectRequest(id);
      setRequests(
        requests.map(req =>
          req.id === id ? { ...req, status: 'rejected' as const } : req
        )
      );
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
    }
  };

  const calculateTotal = (expenses: TravelRequest['expenses']) => {
    return Object.values(expenses).reduce((sum, val) => sum + val, 0);
  };

  return {
    requests: filteredRequests,
    companies,
    filters,
    updateFilter,
    clearFilters,
    approveRequest,
    rejectRequest,
    calculateTotal,
    openAccordion,
    setOpenAccordion,
  };
};

export default useApprovalRequests;

