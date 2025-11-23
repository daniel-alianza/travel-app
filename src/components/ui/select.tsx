import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.ComponentProps<'select'>, 'children'> {
  children?: React.ReactNode;
  options?: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      children,
      options,
      placeholder = 'Selecciona una opción',
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(
      props.value || props.defaultValue || '',
    );
    const selectRef = React.useRef<HTMLDivElement>(null);
    const hiddenSelectRef = React.useRef<HTMLSelectElement>(null);

    // Parse options from children if options prop is not provided
    const parsedOptions = React.useMemo(() => {
      if (options && Array.isArray(options) && options.length > 0) {
        return options;
      }

      const opts: SelectOption[] = [];
      if (children) {
        React.Children.forEach(children, child => {
          if (React.isValidElement(child) && child.type === 'option') {
            const childProps = child.props as {
              value?: string;
              children?: React.ReactNode;
            };
            opts.push({
              value: childProps.value || '',
              label: childProps.children?.toString() || '',
            });
          }
        });
      }
      return opts;
    }, [children, options]);

    const selectedOption = parsedOptions.find(
      opt => opt.value === selectedValue,
    );
    const displayText = selectedOption?.label || placeholder;

    // Handle click outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    // Handle external value changes (from react-hook-form)
    React.useEffect(() => {
      if (props.value !== undefined && props.value !== selectedValue) {
        setSelectedValue(props.value);
      }
    }, [props.value, selectedValue]);

    const handleSelect = (value: string) => {
      // Don't select empty placeholder value
      if (value === '') {
        setIsOpen(false);
        return;
      }

      setSelectedValue(value);
      setIsOpen(false);

      if (hiddenSelectRef.current) {
        // Update the hidden select value first - this is critical for react-hook-form
        hiddenSelectRef.current.value = value;
        
        // Create a proper React synthetic event
        // The target must be the actual select element with updated value
        const event = {
          target: hiddenSelectRef.current,
          currentTarget: hiddenSelectRef.current,
        } as React.ChangeEvent<HTMLSelectElement>;
        
        // Call onChange handler from react-hook-form register if provided
        // This will register the value change in the form state
        if (props.onChange) {
          props.onChange(event);
        }
      }
    };

    const hasError = className?.includes('border-destructive');

    return (
      <div ref={selectRef} className={cn('relative w-full', isOpen ? 'z-50' : 'z-10')}>
        {/* Hidden select for form integration */}
        <select
          ref={node => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            hiddenSelectRef.current = node;
          }}
          {...props}
          value={selectedValue}
          onChange={e => {
            setSelectedValue(e.target.value);
            props.onChange?.(e);
          }}
          className='hidden'
          aria-hidden='true'
        >
          {options && options.length > 0
            ? options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>

        {/* Custom select button */}
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
            'hover:border-primary/50',
            hasError && 'border-destructive focus-visible:ring-destructive',
            !selectedOption && 'text-muted-foreground',
            // Si no hay altura en className, usar h-10 por defecto
            !className?.includes('h-') && 'h-10',
            className,
          )}
          disabled={props.disabled}
        >
          <span className='truncate'>{displayText}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && parsedOptions.length > 0 && (
          <div className='absolute z-[60] mt-1 w-full rounded-md border border-input bg-background shadow-lg'>
            <div className='max-h-60 overflow-auto p-1'>
              {parsedOptions
                .filter(option => option.value !== '') // Filter out placeholder option
                .map(option => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full rounded-sm px-3 py-2 text-left text-sm transition-colors',
                      'hover:bg-primary/5 hover:text-primary',
                      'focus:bg-primary/5 focus:text-primary focus:outline-none',
                      selectedValue === option.value &&
                        'bg-primary/10 text-primary font-medium',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          </div>
        )}
        {isOpen && parsedOptions.length === 0 && (
          <div className='absolute z-[60] mt-1 w-full rounded-md border border-input bg-background shadow-lg'>
            <div className='p-3 text-sm text-muted-foreground text-center'>
              No hay opciones disponibles
            </div>
          </div>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';

export { Select };
