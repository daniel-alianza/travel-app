import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  FileText,
  Target,
  Plane,
  Hotel,
  Utensils,
  Coins,
  Truck,
  Wrench,
  Package,
  MoreHorizontal,
  Search,
  Building2,
  Filter,
  Banknote,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApprovalRequests } from '../hooks/useApprovalRequests';
import type { RequestStatus } from '../interfaces';
import { CommentDialog } from './CommentDialog';

const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pendiente',
        variant: 'secondary' as const,
        icon: Clock,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/20',
      };
    case 'approved':
      return {
        label: 'Aprobada',
        variant: 'default' as const,
        icon: CheckCircle2,
        color: 'text-green-600',
        bgColor: 'bg-green-600/10',
        borderColor: 'border-green-600/20',
      };
    case 'rejected':
      return {
        label: 'Rechazada',
        variant: 'destructive' as const,
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-600/10',
        borderColor: 'border-red-600/20',
      };
    default:
      return {
        label: 'Desconocido',
        variant: 'secondary' as const,
        icon: Clock,
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
        borderColor: 'border-muted',
      };
  }
};

const ApprovalRequests = () => {
  const {
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
    isLoading,
    messageDialog,
    setMessageDialog,
    pagination,
    currentPage,
    setCurrentPage,
    commentDialog,
    setCommentDialog,
    handleCommentConfirm,
    isCommentDialogLoading,
  } = useApprovalRequests();

  const hasActiveFilters =
    filters.searchTerm ||
    filters.companyFilter !== 'all' ||
    filters.statusFilter !== 'all' ||
    filters.minAmount !== '' ||
    filters.maxAmount !== '';

  return (
    <div className='space-y-4 sm:space-y-6 lg:space-y-8'>
      <Card className='p-4 sm:p-6 border-2 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg relative z-10 isolate'>
        <div className='space-y-4 sm:space-y-6'>
          <div className='flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b-2 border-border/50'>
            <div className='p-2 sm:p-3 rounded-xl bg-primary/10'>
              <Filter className='h-5 w-5 sm:h-6 sm:w-6 text-primary' />
            </div>
            <h2 className='text-lg sm:text-xl font-bold'>
              Filtros de Búsqueda
            </h2>
          </div>

          <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
            {/* Search by name */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                Buscar Colaborador
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Nombre del colaborador...'
                  value={filters.searchTerm}
                  onChange={e => updateFilter('searchTerm', e.target.value)}
                  className='pl-10 h-12 border-2 focus:border-primary'
                />
              </div>
            </div>

            {/* Filter by company */}
            <div className='space-y-2 relative z-[60]'>
              <label className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                Compañía
              </label>
              <div className='relative'>
                <Building2 className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none' />
                <Select
                  value={filters.companyFilter}
                  onChange={e => updateFilter('companyFilter', e.target.value)}
                  placeholder='Todas las compañías'
                  className='h-12 border-2 focus:border-primary pl-10'
                >
                  <option value='all'>Todas las compañías</option>
                  {companies.map(company => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Filter by status */}
            <div className='space-y-2 relative z-[50]'>
              <label className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                Estado
              </label>
              <div className='relative'>
                <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none' />
                <Select
                  value={filters.statusFilter}
                  onChange={e => updateFilter('statusFilter', e.target.value)}
                  placeholder='Todos los estados'
                  className='h-12 border-2 focus:border-primary pl-10'
                >
                  <option value='all'>Todos los estados</option>
                  <option value='pending'>Pendientes</option>
                  <option value='approved'>Aprobadas</option>
                  <option value='rejected'>Rechazadas</option>
                </Select>
              </div>
            </div>

            {/* Filter by min amount */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                Monto Mínimo
              </label>
              <div className='relative'>
                <Banknote className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none' />
                <Input
                  type='number'
                  placeholder='Monto mínimo...'
                  value={filters.minAmount}
                  onChange={e => updateFilter('minAmount', e.target.value)}
                  className='pl-10 h-12 border-2 focus:border-primary'
                  min='0'
                  step='0.01'
                />
              </div>
            </div>

            {/* Filter by max amount */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                Monto Máximo
              </label>
              <div className='relative'>
                <Banknote className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none' />
                <Input
                  type='number'
                  placeholder='Monto máximo...'
                  value={filters.maxAmount}
                  onChange={e => updateFilter('maxAmount', e.target.value)}
                  className='pl-10 h-12 border-2 focus:border-primary'
                  min='0'
                  step='0.01'
                />
              </div>
            </div>
          </div>

          <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
            {/* Toggle dispersed */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                Vista
              </label>
              <Button
                onClick={() =>
                  updateFilter('showDispersed', !filters.showDispersed)
                }
                variant={filters.showDispersed ? 'default' : 'outline'}
                className='w-full h-12 border-2 font-semibold'
              >
                <Banknote className='h-4 w-4 mr-2' />
                {filters.showDispersed
                  ? 'Mostrando Dispersadas'
                  : 'Ver Dispersadas'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 px-2'>
        <p className='text-xs sm:text-sm text-muted-foreground font-medium'>
          Mostrando{' '}
          <span className='font-bold text-foreground'>
            {filteredRequests.length}
          </span>{' '}
          solicitud
          {filteredRequests.length !== 1 ? 'es' : ''}
          {filters.showDispersed && ' dispersadas'}
        </p>
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearFilters}
            className='text-primary hover:text-primary/80 text-xs sm:text-sm'
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Requests list */}
      <div className='space-y-4 animate-in fade-in duration-500'>
        {filteredRequests.length === 0 ? (
          <Card className='p-12 text-center border-2 border-dashed border-border/50'>
            <div className='flex flex-col items-center gap-4'>
              <div className='p-6 rounded-full bg-muted'>
                <Search className='h-12 w-12 text-muted-foreground' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-xl font-bold tracking-tight'>
                  No se encontraron solicitudes
                </h3>
                <p className='text-muted-foreground'>
                  Intenta ajustar los filtros para ver más resultados
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Accordion
            type='single'
            collapsible
            className='space-y-4'
            value={openAccordion}
            onValueChange={setOpenAccordion}
          >
            {filteredRequests.map(request => {
              const statusConfig = getStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;
              const total = calculateTotal(request.expenses);
              const accordionValue = `request-${request.id}`;
              const isOpen = openAccordion === accordionValue;

              return (
                <AccordionItem
                  key={request.id}
                  value={accordionValue}
                  className={`border-2 ${statusConfig.borderColor} rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 relative z-0`}
                >
                  <AccordionTrigger className='px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 hover:no-underline hover:bg-accent/5 transition-colors [&[data-state=open]]:bg-accent/10'>
                    <div className='flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-3 sm:gap-4 md:gap-4 lg:gap-6'>
                      <div className='flex items-center gap-2 sm:gap-3 md:gap-3 lg:gap-4 flex-1 min-w-0 w-full md:max-w-[50%] lg:max-w-none'>
                        <div className='p-2 sm:p-2.5 md:p-2.5 lg:p-3 rounded-xl bg-secondary/20 ring-2 ring-secondary/30 flex-shrink-0'>
                          <User className='h-5 w-5 sm:h-5 md:h-5 lg:h-6 sm:w-5 md:w-5 lg:w-6 text-secondary' />
                        </div>
                        <div className='text-left space-y-1 sm:space-y-1 md:space-y-1.5 min-w-0 flex-1'>
                          <h3 className='text-base sm:text-base md:text-base lg:text-xl font-bold tracking-tight truncate'>
                            {request.employee}
                          </h3>
                          <p className='text-xs sm:text-xs md:text-xs lg:text-sm text-muted-foreground font-medium truncate'>
                            {request.company}
                          </p>
                          <div className='flex items-center gap-2 flex-wrap'>
                            <Badge
                              variant={statusConfig.variant}
                              className='text-xs font-semibold shadow-sm'
                            >
                              <StatusIcon className='h-3 w-3 mr-1' />
                              {statusConfig.label}
                            </Badge>
                            {request.dispersed && (
                              <Badge
                                variant='outline'
                                className='text-xs font-semibold border-green-600 text-green-600'
                              >
                                <Banknote className='h-3 w-3 mr-1' />
                                Dispersada
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-row items-center gap-2 sm:gap-2 md:gap-2 lg:gap-4 w-full md:w-auto justify-end md:justify-end lg:justify-start flex-shrink-0'>
                        <div className='flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 px-2 sm:px-2.5 md:px-3 lg:px-4 h-9 sm:h-9 md:h-10 lg:h-11 rounded-md bg-primary/5 border border-primary/20 flex-shrink-0'>
                          <span className='text-[10px] sm:text-[10px] md:text-xs lg:text-xs text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap'>
                            Total:
                          </span>
                          <span className='text-sm sm:text-sm md:text-base lg:text-lg font-bold text-primary whitespace-nowrap'>
                            ${total.toLocaleString()}
                          </span>
                        </div>

                        {/* Action buttons for pending requests - only show when accordion is closed */}
                        {request.status === 'pending' && !isOpen && (
                          <div className='flex gap-1.5 sm:gap-1.5 md:gap-2 lg:gap-2 flex-shrink-0'>
                            <Button
                              onClick={e => {
                                e.stopPropagation();
                                approveRequest(request.id);
                              }}
                              size='lg'
                              className='bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all text-[10px] sm:text-[11px] md:text-xs lg:text-base px-2 sm:px-2.5 md:px-3 lg:px-4 h-9 sm:h-9 md:h-10 lg:h-11 whitespace-nowrap'
                            >
                              <CheckCircle2 className='h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5 mr-0.5 sm:mr-1 md:mr-1.5 lg:mr-2' />
                              Aprobar
                            </Button>
                            <Button
                              onClick={e => {
                                e.stopPropagation();
                                rejectRequest(request.id);
                              }}
                              size='lg'
                              variant='destructive'
                              className='shadow-md hover:shadow-lg transition-all text-[10px] sm:text-[11px] md:text-xs lg:text-base px-2 sm:px-2.5 md:px-3 lg:px-4 h-9 sm:h-9 md:h-10 lg:h-11 whitespace-nowrap'
                            >
                              <XCircle className='h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5 mr-0.5 sm:mr-1 md:mr-1.5 lg:mr-2' />
                              Rechazar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className='px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-2'>
                    <div className='space-y-4 sm:space-y-6 pt-4 border-t-2 border-border/50'>
                      <div className='grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                        <div className='flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-accent/20 border border-border/50'>
                          <div className='p-2 sm:p-3 rounded-xl bg-primary/10 mt-0.5 flex-shrink-0'>
                            <FileText className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <p className='text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide'>
                              Motivo
                            </p>
                            <p className='font-semibold text-xs sm:text-sm leading-relaxed text-pretty'>
                              {request.reason}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-accent/20 border border-border/50'>
                          <div className='p-2 sm:p-3 rounded-xl bg-secondary/10 mt-0.5 flex-shrink-0'>
                            <Calendar className='h-4 w-4 sm:h-5 sm:w-5 text-secondary' />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <p className='text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide'>
                              Fechas
                            </p>
                            <p className='font-semibold text-xs sm:text-sm'>
                              {request.startDate} - {request.endDate}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-accent/20 border border-border/50 sm:col-span-2 lg:col-span-1'>
                          <div className='p-2 sm:p-3 rounded-xl bg-accent/50 mt-0.5 flex-shrink-0'>
                            <Target className='h-4 w-4 sm:h-5 sm:w-5 text-foreground' />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <p className='text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide'>
                              Objetivos de Viaje
                            </p>
                            <ul className='space-y-1'>
                              {request.objectives.map((objective, index) => (
                                <li
                                  key={index}
                                  className='text-xs sm:text-sm font-medium leading-relaxed flex items-start gap-2'
                                >
                                  <span className='text-primary mt-0.5 font-bold flex-shrink-0'>
                                    •
                                  </span>
                                  <span className='text-pretty'>
                                    {objective}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className='space-y-3 sm:space-y-4 pt-4'>
                        <h4 className='text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-2'>
                          <div className='h-1 w-6 sm:w-8 bg-primary rounded-full'></div>
                          Desglose de Gastos
                        </h4>
                        <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
                          <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border-2 border-border/50 hover:border-primary/30 transition-colors'>
                            <div className='p-1.5 sm:p-2 rounded-lg bg-background shadow-sm flex-shrink-0'>
                              <Plane className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-xs text-muted-foreground font-semibold'>
                                Transporte
                              </p>
                              <p className='text-base sm:text-lg font-bold'>
                                ${request.expenses.transporte}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border-2 border-border/50 hover:border-primary/30 transition-colors'>
                            <div className='p-1.5 sm:p-2 rounded-lg bg-background shadow-sm flex-shrink-0'>
                              <Coins className='h-4 w-4 sm:h-5 sm:w-5 text-yellow-600' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-xs text-muted-foreground font-semibold'>
                                Peajes
                              </p>
                              <p className='text-base sm:text-lg font-bold'>
                                ${request.expenses.peajes}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border-2 border-border/50 hover:border-primary/30 transition-colors'>
                            <div className='p-1.5 sm:p-2 rounded-lg bg-background shadow-sm flex-shrink-0'>
                              <Hotel className='h-4 w-4 sm:h-5 sm:w-5 text-secondary' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-xs text-muted-foreground font-semibold'>
                                Hospedaje
                              </p>
                              <p className='text-base sm:text-lg font-bold'>
                                ${request.expenses.hospedaje}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border-2 border-border/50 hover:border-primary/30 transition-colors'>
                            <div className='p-1.5 sm:p-2 rounded-lg bg-background shadow-sm flex-shrink-0'>
                              <Utensils className='h-4 w-4 sm:h-5 sm:w-5 text-green-600' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-xs text-muted-foreground font-semibold'>
                                Alimentos
                              </p>
                              <p className='text-base sm:text-lg font-bold'>
                                ${request.expenses.alimentos}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border-2 border-border/50 hover:border-primary/30 transition-colors'>
                            <div className='p-1.5 sm:p-2 rounded-lg bg-background shadow-sm flex-shrink-0'>
                              <Truck className='h-4 w-4 sm:h-5 sm:w-5 text-blue-600' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-xs text-muted-foreground font-semibold'>
                                Fletes
                              </p>
                              <p className='text-base sm:text-lg font-bold'>
                                ${request.expenses.fletes}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border-2 border-border/50 hover:border-primary/30 transition-colors'>
                            <div className='p-1.5 sm:p-2 rounded-lg bg-background shadow-sm flex-shrink-0'>
                              <Wrench className='h-4 w-4 sm:h-5 sm:w-5 text-orange-600' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-xs text-muted-foreground font-semibold'>
                                Herramientas
                              </p>
                              <p className='text-base sm:text-lg font-bold'>
                                ${request.expenses.herramientas}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border-2 border-border/50 hover:border-primary/30 transition-colors'>
                            <div className='p-1.5 sm:p-2 rounded-lg bg-background shadow-sm flex-shrink-0'>
                              <Package className='h-4 w-4 sm:h-5 sm:w-5 text-purple-600' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-xs text-muted-foreground font-semibold'>
                                Envíos/Mensajería
                              </p>
                              <p className='text-base sm:text-lg font-bold'>
                                ${request.expenses.enviosMensajeria}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border-2 border-border/50 hover:border-primary/30 transition-colors'>
                            <div className='p-1.5 sm:p-2 rounded-lg bg-background shadow-sm flex-shrink-0'>
                              <MoreHorizontal className='h-4 w-4 sm:h-5 sm:w-5 text-foreground' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-xs text-muted-foreground font-semibold'>
                                Misceláneos
                              </p>
                              <p className='text-base sm:text-lg font-bold'>
                                ${request.expenses.miscelaneos}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons for pending requests - only show when accordion is open */}
                      {request.status === 'pending' && isOpen && (
                        <div className='flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t-2 border-border/50'>
                          <Button
                            onClick={e => {
                              e.stopPropagation();
                              approveRequest(request.id);
                            }}
                            size='lg'
                            className='bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all w-full sm:w-auto text-sm sm:text-base'
                          >
                            <CheckCircle2 className='h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2' />
                            Aprobar
                          </Button>
                          <Button
                            onClick={e => {
                              e.stopPropagation();
                              rejectRequest(request.id);
                            }}
                            size='lg'
                            variant='destructive'
                            className='shadow-md hover:shadow-lg transition-all w-full sm:w-auto text-sm sm:text-base'
                          >
                            <XCircle className='h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2' />
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        {/* Paginación */}
        {pagination && pagination.totalPages > 1 && (
          <div className='flex items-center justify-center px-2 py-4 border-t border-border/50'>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
                className='h-9 px-3'
              >
                <ChevronLeft className='h-4 w-4' />
                Anterior
              </Button>
              <div className='flex items-center gap-1'>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Mostrar primera, última, actual y páginas adyacentes
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => {
                    // Agregar puntos suspensivos si hay gap
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <div key={page} className='flex items-center gap-1'>
                        {showEllipsis && (
                          <span className='px-2 text-muted-foreground'>...</span>
                        )}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size='sm'
                          onClick={() => setCurrentPage(page)}
                          disabled={isLoading}
                          className='h-9 w-9 p-0'
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setCurrentPage(prev =>
                    Math.min(pagination.totalPages, prev + 1),
                  )
                }
                disabled={currentPage === pagination.totalPages || isLoading}
                className='h-9 px-3'
              >
                Siguiente
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Preloader overlay */}
      {isLoading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-lg'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <p className='text-sm font-medium text-foreground'>
              Procesando solicitud...
            </p>
          </div>
        </div>
      )}

      {/* Comment Dialog */}
      <CommentDialog
        open={commentDialog.open}
        onOpenChange={open =>
          setCommentDialog(prev => ({ ...prev, open }))
        }
        type={commentDialog.type}
        onConfirm={handleCommentConfirm}
        isLoading={isCommentDialogLoading}
      />

      {/* Message Dialog */}
      <Dialog
        open={messageDialog.open}
        onOpenChange={open =>
          setMessageDialog(prev => ({ ...prev, open }))
        }
      >
        <DialogContent className='w-[95vw] max-w-xs sm:max-w-sm p-4 sm:p-5'>
          <DialogHeader>
            <div className='flex items-center justify-center mb-3 sm:mb-4'>
              {messageDialog.type === 'success' ? (
                <div className='rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-2.5 sm:p-3'>
                  <CheckCircle2 className='h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 dark:text-emerald-400' />
                </div>
              ) : messageDialog.type === 'rejected' ? (
                <div className='rounded-full bg-orange-100 dark:bg-orange-900/30 p-2.5 sm:p-3'>
                  <AlertCircle className='h-6 w-6 sm:h-7 sm:w-7 text-orange-600 dark:text-orange-400' />
                </div>
              ) : (
                <div className='rounded-full bg-red-100 dark:bg-red-900/30 p-2.5 sm:p-3'>
                  <XCircle className='h-6 w-6 sm:h-7 sm:w-7 text-red-600 dark:text-red-400' />
                </div>
              )}
            </div>
            <DialogTitle
              className={`text-center text-base sm:text-lg font-bold px-2 ${
                messageDialog.type === 'success'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : messageDialog.type === 'rejected'
                    ? 'text-orange-700 dark:text-orange-400'
                    : 'text-red-700 dark:text-red-400'
              }`}
            >
              {messageDialog.title}
            </DialogTitle>
            <DialogDescription className='text-center text-sm sm:text-base pt-2 px-2'>
              {messageDialog.message}
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4 sm:mt-5 flex justify-center'>
            <Button
              onClick={() =>
                setMessageDialog(prev => ({ ...prev, open: false }))
              }
              className={`w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] px-5 sm:px-6 h-9 sm:h-10 ${
                messageDialog.type === 'success'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white'
                  : messageDialog.type === 'rejected'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
              }`}
            >
              Aceptar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ApprovalRequests };
