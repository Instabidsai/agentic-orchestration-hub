import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Enums } from '@/integrations/supabase/types';
import { getPromptFilters } from '@/api/prompts';

interface FilterOption {
  value: string;
  label: string;
}

interface PromptFiltersProps {
  onFilterChange: (filter: string, value: string) => void;
  selectedInterface: string;
  selectedDomain: string;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const FilterSelect: React.FC<{
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}> = ({ options, value, onChange, label }) => {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find(option => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value === 'all' ? label : selectedOption?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-9" />
          <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
              >
                {option.label}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const PromptFilters: React.FC<PromptFiltersProps> = ({ 
  onFilterChange, 
  selectedInterface, 
  selectedDomain, 
  selectedTags,
  onTagToggle
}) => {
  const [interfaceOptions, setInterfaceOptions] = useState<FilterOption[]>([
    { value: 'all', label: 'All Interfaces' }
  ]);

  const [domainOptions, setDomainOptions] = useState<FilterOption[]>([
    { value: 'all', label: 'All Domains' }
  ]);

  const [availableTags, setAvailableTags] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      setLoading(true);
      const filters = await getPromptFilters();
      
      // Process interfaces
      const interfaces = [
        { value: 'all', label: 'All Interfaces' },
        ...filters.interfaces.map(i => ({
          value: i,
          label: formatEnumLabel(i)
        }))
      ];
      setInterfaceOptions(interfaces);
      
      // Process domains
      const domains = [
        { value: 'all', label: 'All Domains' },
        ...filters.domains.map(d => ({
          value: d,
          label: formatEnumLabel(d)
        }))
      ];
      setDomainOptions(domains);
      
      // Set available tags
      setAvailableTags(filters.tags);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching filters:', error);
      setLoading(false);
    }
  };

  // Helper to format enum values for display
  const formatEnumLabel = (value: string): string => {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="bg-card p-4 rounded-lg border mb-6">
      <h3 className="text-sm font-medium mb-3">Filter Prompts</h3>
      <div className="flex flex-wrap gap-3">
        <FilterSelect 
          options={interfaceOptions}
          value={selectedInterface}
          onChange={(value) => onFilterChange('interface', value)}
          label="Interface"
          disabled={loading}
        />
        
        <FilterSelect 
          options={domainOptions}
          value={selectedDomain}
          onChange={(value) => onFilterChange('domain', value)}
          label="Domain"
          disabled={loading}
        />
        
        <Button variant="outline" disabled>
          Project
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        
        <Button variant="outline" disabled>
          Created By
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </div>
      
      <div className="mt-4">
        <div className="text-sm text-muted-foreground mb-2">Tags:</div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <Badge 
              key={tag.id} 
              variant={selectedTags.includes(tag.name) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onTagToggle(tag.name)}
            >
              {tag.name}
            </Badge>
          ))}
          {availableTags.length === 0 && !loading && (
            <span className="text-sm text-muted-foreground">No tags available</span>
          )}
          {loading && (
            <span className="text-sm text-muted-foreground">Loading tags...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptFilters;
