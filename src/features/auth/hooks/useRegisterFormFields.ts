import { useEffect, useMemo } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import {
  User,
  Mail,
  Lock,
  Building,
  MapPin,
  Briefcase,
  Users,
} from 'lucide-react';
import type { RegisterFormData } from '../interfaces/authApiInterfaces';
import type {
  FieldConfig,
  SelectFieldConfig,
} from '../interfaces/RegisterFormInterfaces';
import { useCompanies } from './useCompanies';
import { useBranches } from './useBranches';
import { useAreas } from './useAreas';

interface UseRegisterFormFieldsProps {
  watch: UseFormWatch<RegisterFormData>;
  setValue: UseFormSetValue<RegisterFormData>;
  password?: string;
}

export function useRegisterFormFields({
  watch,
  setValue,
  password,
}: UseRegisterFormFieldsProps) {
  const selectedCompany = watch('companyId');

  const { data: companies = [], isLoading: isLoadingCompanies } =
    useCompanies();
  const { data: branches = [], isLoading: isLoadingBranches } = useBranches();
  const { data: areas = [], isLoading: isLoadingAreas } = useAreas();

  const filteredBranches = useMemo(() => {
    // Si no hay compañía seleccionada, mostrar todas las sucursales
    if (!selectedCompany || selectedCompany === '') return branches;
    // Si hay compañía seleccionada, filtrar por esa compañía
    return branches.filter(
      branch => branch.companyId === Number(selectedCompany),
    );
  }, [selectedCompany, branches]);

  useEffect(() => {
    if (selectedCompany && selectedCompany !== '') {
      setValue('branchId', '');
    }
  }, [selectedCompany, setValue]);

  const inputFields: FieldConfig[] = useMemo(
    () => [
      {
        name: 'name',
        label: 'Nombre(s)',
        icon: User,
        type: 'text',
        placeholder: 'Ingresa tu(s) nombre(s)',
        validation: { required: 'El nombre es requerido' },
      },
      {
        name: 'paternalSurname',
        label: 'Apellido Paterno',
        icon: User,
        type: 'text',
        placeholder: 'Ingresa tu apellido paterno',
        validation: { required: 'El apellido paterno es requerido' },
      },
      {
        name: 'maternalSurname',
        label: 'Apellido Materno',
        icon: User,
        type: 'text',
        placeholder: 'Ingresa tu apellido materno',
        validation: { required: 'El apellido materno es requerido' },
      },
      {
        name: 'email',
        label: 'Correo Electrónico',
        icon: Mail,
        type: 'email',
        placeholder: 'correo@ejemplo.com',
        validation: {
          required: 'El correo electrónico es requerido',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Correo electrónico inválido',
          },
        },
      },
      {
        name: 'password',
        label: 'Contraseña',
        icon: Lock,
        type: 'password',
        placeholder: '••••••••',
        validation: {
          required: 'La contraseña es requerida',
          minLength: {
            value: 8,
            message: 'La contraseña debe tener al menos 8 caracteres',
          },
        },
      },
      {
        name: 'confirmPassword',
        label: 'Confirmar Contraseña',
        icon: Lock,
        type: 'password',
        placeholder: '••••••••',
        validation: {
          required: 'Debes confirmar tu contraseña',
          validate: (value: string | undefined) =>
            value === password || 'Las contraseñas no coinciden',
        },
      },
    ],
    [password],
  );

  const selectFields: SelectFieldConfig[] = useMemo(() => {
    const companyOptions = companies.map(company => ({
      value: String(company.id),
      label: company.name,
    }));

    const branchOptions = filteredBranches.map(branch => ({
      value: String(branch.id),
      label: branch.name,
    }));

    const areaOptions = areas.map(area => ({
      value: String(area.id),
      label: area.name,
    }));

    const getBranchPlaceholder = () => {
      if (isLoadingBranches) return 'Cargando sucursales...';
      if (filteredBranches.length === 0) return 'No hay sucursales disponibles';
      return 'Selecciona una sucursal';
    };

    return [
      {
        name: 'companyId',
        label: 'Company',
        icon: Building,
        placeholder: isLoadingCompanies
          ? 'Cargando compañías...'
          : 'Selecciona una compañía',
        options: companyOptions,
        validation: { required: 'La compañía es requerida' },
      },
      {
        name: 'branchId',
        label: 'Sucursal',
        icon: MapPin,
        placeholder: getBranchPlaceholder(),
        options: branchOptions,
        validation: { required: 'La sucursal es requerida' },
      },
      {
        name: 'areaId',
        label: 'Área',
        icon: Briefcase,
        placeholder: isLoadingAreas ? 'Cargando áreas...' : 'Selecciona un área',
        options: areaOptions,
        validation: { required: 'El área es requerida' },
      },
      {
        name: 'supervisorId',
        label: 'A quién reportas',
        icon: Users,
        placeholder: 'Selecciona una opción (opcional)',
        options: [],
        validation: {},
      },
    ];
  }, [
    companies,
    filteredBranches,
    areas,
    selectedCompany,
    isLoadingCompanies,
    isLoadingBranches,
    isLoadingAreas,
  ]);

  const fieldGroups = useMemo(
    () => [
      [inputFields[0], inputFields[1]],
      [inputFields[2], inputFields[3]],
      [inputFields[4], inputFields[5]],
      [selectFields[0], selectFields[1]],
      [selectFields[2], selectFields[3]],
    ],
    [inputFields, selectFields],
  );

  return {
    inputFields,
    selectFields,
    fieldGroups,
    selectedCompany,
    isLoadingBranches,
  };
}

