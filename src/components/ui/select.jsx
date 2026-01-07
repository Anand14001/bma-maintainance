"use client"

import * as React from "react"
import MuiSelect from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { cn } from "@/lib/utils"

const Select = React.forwardRef(({ className, children, value, onValueChange, defaultValue, placeholder, disabled, ...props }, ref) => {
    const handleChange = (event) => {
        if (onValueChange) {
            onValueChange(event.target.value);
        }
    };

    // Helper function to find the label for a value
    const findLabelForValue = (val) => {
        if (!val || !children) return "";
        const childArray = React.Children.toArray(children);
        const item = childArray.find(child =>
            React.isValidElement(child) && child.props.value === val
        );
        return item ? item.props.children : val;
    };

    return (
        <FormControl fullWidth className={className}>
            <MuiSelect
                ref={ref}
                displayEmpty
                value={value !== undefined ? value : (defaultValue || "")}
                onChange={handleChange}
                disabled={disabled}
                inputProps={{ 'aria-label': 'Without label' }}
                MenuProps={{
                    PaperProps: {
                        className: "rounded-md border border-slate-200 bg-white shadow-md",
                    },
                    MenuListProps: {
                        className: "p-1"
                    },
                    sx: {
                        '& .MuiMenuItem-root': {
                            fontSize: '0.875rem',
                            padding: '0.375rem 0.75rem',
                            minHeight: 'auto'
                        }
                    }
                }}
                sx={{
                    '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        height: '2.5rem',
                        padding: '0 0.75rem',
                        fontSize: '0.875rem',
                        color: '#1e293b', // slate-900
                        backgroundColor: 'white',
                        '&.Mui-disabled': {
                            backgroundColor: '#f8fafc', // slate-50
                        }
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#cbd5e1', // slate-300
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#94a3b8', // slate-400
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6', // blue-500
                        borderWidth: '2px',
                    }
                }}
                renderValue={(selected) => {
                    if (!selected || selected === "") {
                        return <span className="text-slate-500">{placeholder || "Select..."}</span>;
                    }
                    const label = findLabelForValue(selected);
                    return <span className="text-slate-900">{label}</span>;
                }}
                className={cn(
                    "h-10 w-full rounded-md text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {children}
            </MuiSelect>
        </FormControl>
    )
})
Select.displayName = "Select"

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => (
    <MenuItem
        ref={ref}
        value={value}
        sx={{
            fontSize: '0.875rem',
            color: '#1e293b', // slate-900
            padding: '0.375rem 0.75rem',
            minHeight: 'auto',
            '&:hover': {
                backgroundColor: '#f1f5f9', // slate-100
            },
            '&.Mui-selected': {
                backgroundColor: '#e2e8f0', // slate-200
                '&:hover': {
                    backgroundColor: '#cbd5e1', // slate-300
                }
            },
            '&.Mui-focusVisible': {
                backgroundColor: '#f1f5f9', // slate-100
            }
        }}
        className={cn(
            "cursor-default select-none items-center rounded-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        {children}
    </MenuItem>
))
SelectItem.displayName = "SelectItem"

export {
    Select,
    SelectItem,
}