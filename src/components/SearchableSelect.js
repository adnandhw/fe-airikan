import React, { useState, useEffect, useRef } from 'react';

const SearchableSelect = ({ options, value, onChange, placeholder, disabled, isLoading, labelKey = 'name', valueKey = 'id' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const wrapperRef = useRef(null);

    // Initial filter
    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);

    // Handle initial search term when value changes externally
    useEffect(() => {
        if (value) {
            const selectedOption = options.find(opt => opt[valueKey] === value);
            if (selectedOption) {
                setSearchTerm(selectedOption[labelKey]);
            }
        } else {
            setSearchTerm('');
        }
    }, [value, options, valueKey, labelKey]);

    // Filter options when search term changes
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term); // Allow typing freely

        if (!isOpen) setIsOpen(true);

        const filtered = options.filter(opt =>
            opt[labelKey].toLowerCase().includes(term.toLowerCase())
        );
        setFilteredOptions(filtered);
    };



    // For general usage adapt onChange to just pass value, but since we are determining specific usage:
    // We'll pass the value and let parent handle it, or stick to the mimicking if strict.
    // Let's make it generic:
    const handleGenericSelect = (option) => {
        setSearchTerm(option[labelKey]);
        setIsOpen(false);
        onChange(option[valueKey]);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                // Reset search term to selected value if no new selection was made logic could go here
                // For now, let's just close. Ideally, we should revert to the selected value's label if invalid text is left.
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Validation on blur/close: revert text if not a valid selection
    useEffect(() => {
        if (!isOpen && value) {
            const selectedOption = options.find(opt => opt[valueKey] === value);
            if (selectedOption) {
                setSearchTerm(selectedOption[labelKey]);
            }
        } else if (!isOpen && !value) {
            setSearchTerm('');
        }
    }, [isOpen, value, options, valueKey, labelKey]);


    return (
        <div className="position-relative" ref={wrapperRef}>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder={isLoading ? "Loading..." : placeholder}
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={() => {
                        setIsOpen(true);
                        setFilteredOptions(options.filter(opt => opt[labelKey].toLowerCase().includes(searchTerm.toLowerCase())));
                    }}
                    disabled={disabled}
                />
                <span className="input-group-text bg-white">
                    <i className="bi bi-chevron-down text-secondary" style={{ fontSize: '0.8rem' }}></i>
                </span>
            </div>

            {isOpen && !disabled && (
                <ul className="list-group position-absolute w-100 shadow-sm overflow-auto" style={{ maxHeight: '200px', zIndex: 1050, top: '100%' }}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li
                                key={option[valueKey]}
                                className="list-group-item list-group-item-action cursor-pointer"
                                onClick={() => handleGenericSelect(option)}
                                style={{ cursor: 'pointer' }}
                            >
                                {option[labelKey]}
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-muted">Tidak ditemukan</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelect;
