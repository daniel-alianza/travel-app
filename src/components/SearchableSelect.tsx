import * as React from 'react';
import { Select } from '@/components/ui/select';
import type { SelectProps } from '@/components/ui/select';

interface SearchableSelectProps
  extends Omit<
    SelectProps,
    'searchable' | 'searchPlaceholder' | 'searchNumbersOnly'
  > {
  searchPlaceholder?: string;
  searchNumbersOnly?: boolean;
}

const SearchableSelect = React.forwardRef<
  HTMLSelectElement,
  SearchableSelectProps
>(
  (
    { searchPlaceholder = 'Buscar...', searchNumbersOnly = false, ...props },
    ref,
  ) => {
    return (
      <Select
        ref={ref}
        {...props}
        searchable={true}
        searchPlaceholder={searchPlaceholder}
        searchNumbersOnly={searchNumbersOnly}
      />
    );
  },
);

SearchableSelect.displayName = 'SearchableSelect';

export { SearchableSelect };
export type { SearchableSelectProps };
