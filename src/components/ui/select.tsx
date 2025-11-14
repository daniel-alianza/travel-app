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
      if (options) return options;

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

    // Sync with hidden select for form integration
    React.useEffect(() => {
      if (
        hiddenSelectRef.current &&
        selectedValue !== hiddenSelectRef.current.value
      ) {
        hiddenSelectRef.current.value = selectedValue as string;
        // Trigger change event for react-hook-form
        const event = new Event('change', { bubbles: true });
        hiddenSelectRef.current.dispatchEvent(event);
      }
    }, [selectedValue]);

    // Handle external value changes (from react-hook-form)
    React.useEffect(() => {
      if (props.value !== undefined && props.value !== selectedValue) {
        setSelectedValue(props.value);
      }
    }, [props.value]);

    const handleSelect = (value: string) => {
      setSelectedValue(value);
      setIsOpen(false);

      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = value;
        const event = new Event('change', { bubbles: true });
        hiddenSelectRef.current.dispatchEvent(event);
      }
    };

    const hasError = className?.includes('border-destructive');

    return (
      <div ref={selectRef} className='relative w-full z-[100] isolate'>
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
          {children}
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
        {isOpen && (
          <div
            className='absolute z-[99999] mt-1 w-full rounded-md border border-input bg-background shadow-lg'
            style={{ zIndex: 999999 }}
          >
            <div className='max-h-60 overflow-auto p-1'>
              {parsedOptions.map(option => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full rounded-sm px-3 py-2 text-left text-sm transition-colors',
                    'hover:bg-primary/10 hover:text-primary',
                    'focus:bg-primary/10 focus:text-primary focus:outline-none',
                    selectedValue === option.value &&
                      'bg-primary/15 text-primary font-medium',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';

export { Select };
