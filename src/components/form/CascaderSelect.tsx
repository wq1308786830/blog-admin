import * as React from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandInput,
  CommandItem,
  CommandGroup,
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface CascaderOption {
  value: string | number;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
}

interface CascaderSelectProps {
  options: CascaderOption[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[], selectedOptions: CascaderOption[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  expandTrigger?: 'click' | 'hover';
}

export function CascaderSelect({
  options,
  value,
  onChange,
  placeholder = 'Please select',
  className,
  disabled = false,
  expandTrigger = 'click'
}: CascaderSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [activeOptions, setActiveOptions] = React.useState<CascaderOption[]>([])
  const [internalValue, setInternalValue] = React.useState<(string | number)[]>([])

  // Helper to find selected options from value array
  const getSelectedOptions = React.useCallback((
    opts: CascaderOption[],
    val: (string | number)[]
  ): CascaderOption[] => {
    if (!val || val.length === 0) return []
    const selected: CascaderOption[] = []
    let currentOptions = opts
    
    for (const v of val) {
      const found = currentOptions.find(o => o.value === v)
      if (found) {
        selected.push(found)
        if (found.children) {
          currentOptions = found.children
        }
      } else {
        break
      }
    }
    return selected
  }, [])

  // Sync internal value when opening
  React.useEffect(() => {
    if (open) {
      setInternalValue(value || [])
    }
  }, [open, value])

  // Flatten options for search
  const flattenOptions = React.useMemo(() => {
    const result: { path: CascaderOption[], label: string, value: (string | number)[] }[] = []
    
    function traverse(opts: CascaderOption[], currentPath: CascaderOption[]) {
      for (const opt of opts) {
        const newPath = [...currentPath, opt]
        if (!opt.children || opt.children.length === 0) {
          // Leaf
          result.push({
            path: newPath,
            label: newPath.map(p => p.label).join(' / '),
            value: newPath.map(p => p.value)
          })
        } else {
          traverse(opt.children, newPath)
        }
      }
    }
    traverse(options, [])
    return result
  }, [options])

  // Initialize active options based on value when opening
  // We use internalValue here to drive the UI while open
  React.useEffect(() => {
    if (open) {
      const valToUse = internalValue.length > 0 ? internalValue : (value || []);
      if (valToUse.length > 0) {
        const selectedOpts = getSelectedOptions(options, valToUse)
        if (selectedOpts.length > 0) {
           setActiveOptions(selectedOpts) 
        } else {
           setActiveOptions([])
        }
      } else {
        setActiveOptions([])
      }
    }
  }, [open, internalValue, value, options, getSelectedOptions])

  // Commit change wrapper
  const commitChange = (val: (string | number)[]) => {
      // Only fire change if different? 
      // The user requirement says "select any level... and close... trigger onChange".
      // Assuming we always trigger if closed with a selection made inside.
      const selectedOpts = getSelectedOptions(options, val);
      onChange?.(val, selectedOpts);
  }

  const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
          // Closing via interaction (e.g. click outside)
          // Commit the internal value
          commitChange(internalValue);
      }
  }

  // Derived state for the columns to display
  // Always start with the root options
  // Then append children of each active option in the sequence
  const columns = React.useMemo(() => {
     const cols = [options] // Column 0
     let currentOptions = options
     
     // Use activeOptions to determine columns
     // But activeOptions might include the LEAF node which has no children.
     // iterate activeOptions to find children
     for (const activeOption of activeOptions) {
        const found = currentOptions.find(o => o.value === activeOption.value)
        if (found && found.children && found.children.length > 0) {
           cols.push(found.children)
           currentOptions = found.children
        } else {
            // No children for this level, stop adding columns
            // But continue loop? No, columns chain is sequential.
        }
     }
     return cols
  }, [options, activeOptions])

  const handleSelect = (option: CascaderOption, level: number) => {
      if (option.disabled) return;

      // Update active options up to this level
      // activeOptions holds the path of Option objects.
      // If we are at level 0, we replace everything.
      // If we are at level 1, we keep level 0, replace level 1, discard rest.
      const newActive = [...activeOptions.slice(0, level), option]
      const newPathValues = newActive.map(o => o.value)
      
      setInternalValue(newPathValues);

      if (!option.children || option.children.length === 0) {
          // Leaf node selected
          // Close and commit
          setOpen(false)
          setSearch('')
          commitChange(newPathValues)
      } else {
          // Parent node selected/expanded
          setActiveOptions(newActive)
      }
  }

  const handleSearchSelect = (path: CascaderOption[]) => {
      const values = path.map(p => p.value)
      // Search select is always terminal action in this context, so close and commit
      setOpen(false)
      setSearch('')
      commitChange(values)
  }
  
  // Display text - use committed 'value'
  const selectedOptions = value ? getSelectedOptions(options, value) : []
  const displayLabel = selectedOptions.length > 0 ? selectedOptions.map(p => p.label).join(' / ') : placeholder
  
  // UI Selection State:
  // When open, use internalValue. When closed, use value.
  const currentValue = open ? internalValue : (value || [])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>

        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", !value && "text-muted-foreground", className)}
          disabled={disabled}
        >
          {displayLabel}
          <div className="flex flex-col h-4 w-4 shrink-0 opacity-50 justify-center items-end gap-[2px]">
             {/* Simple icon to indicate dropdown/cascade */}
             <ChevronRight className="h-4 w-4 rotate-90" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
          <Command shouldFilter={false}>
              <CommandInput placeholder="Search..." onValueChange={setSearch} value={search} />
              {search ? (
                   <CommandList>
                       <CommandEmpty>No results found.</CommandEmpty>
                       <CommandGroup>
                           {flattenOptions
                               .filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
                               .map((item, index) => (
                                   <CommandItem
                                       key={`${item.value.join('-')}-${index}`}
                                       value={item.label} 
                                       onSelect={() => handleSearchSelect(item.path)}
                                   >
                                       <Check
                                           className={cn(
                                               "mr-2 h-4 w-4",
                                               value?.join(',') === item.value.join(',') ? "opacity-100" : "opacity-0"
                                           )}
                                       />
                                       {item.label}
                                   </CommandItem>
                               ))}
                       </CommandGroup>
                   </CommandList>
              ) : (
                  <div className="flex flex-row divide-x h-72">
                      {columns.map((colOptions, colIndex) => (
                           <ScrollArea key={colIndex} className="h-full w-48 min-w-[12rem]">
                               <div className="p-1">
                                    {colOptions.map(option => {
                                        const isActive = activeOptions[colIndex]?.value === option.value
                                        const isLeaf = !option.children || option.children.length === 0
                                        // Use currentValue for visual checkmark
                                        const isSelected = currentValue && currentValue[colIndex] === option.value

                                        return (
                                            <div
                                                key={option.value}
                                                className={cn(
                                                    "relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                                    (isActive || isSelected) && "bg-accent text-accent-foreground",
                                                    option.disabled && "pointer-events-none opacity-50"
                                                )}
                                                onClick={() => handleSelect(option, colIndex)}
                                                onMouseEnter={() => {
                                                    if (expandTrigger === 'hover' && !option.disabled && !isLeaf) {
                                                        handleSelect(option, colIndex)
                                                    }
                                                }}
                                            >
                                                <span className="flex-1 truncate">{option.label}</span>
                                                {/* Show Chevron for parents */}
                                                {!isLeaf && (
                                                    <ChevronRight className="ml-2 h-4 w-4 opacity-50" />
                                                )}
                                                
                                                {/* Show Check for the selected value (leaf or parent) at this level */}
                                                {isSelected && (
                                                     <Check className="ml-auto h-4 w-4" />
                                                )}
                                            </div>
                                        )
                                    })}
                               </div>
                           </ScrollArea>
                      ))}
                  </div>
              )}
          </Command>
      </PopoverContent>
    </Popover>
  )
}

