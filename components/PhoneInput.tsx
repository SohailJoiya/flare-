import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Country, countries } from '../data/countries';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ label, id, value, onChange, disabled, required, ...props }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries.find(c => c.code === 'US') || countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect synchronizes the internal state with the `value` prop.
    if (!value) {
      setPhoneNumber('');
      return;
    }

    const matchingCountry = countries
      .slice()
      .sort((a, b) => b.dial_code.length - a.dial_code.length)
      .find(c => value.startsWith(c.dial_code));
      
    if (matchingCountry) {
      setSelectedCountry(matchingCountry);
      setPhoneNumber(value.substring(matchingCountry.dial_code.length));
    } else {
      setPhoneNumber(value);
    }
  }, [value]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Check if user is pasting a full number with a country code
    const matchingCountry = countries
      .slice()
      .sort((a, b) => b.dial_code.length - a.dial_code.length)
      .find(c => rawValue.startsWith(c.dial_code));
      
    if (matchingCountry) {
        const newNumber = rawValue.substring(matchingCountry.dial_code.length).replace(/\D/g, '');
        setSelectedCountry(matchingCountry);
        setPhoneNumber(newNumber);
        onChange(`${matchingCountry.dial_code}${newNumber}`);
    } else {
        const newNumber = rawValue.replace(/\D/g, '');
        setPhoneNumber(newNumber);
        onChange(`${selectedCountry.dial_code}${newNumber}`);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    onChange(`${country.dial_code}${phoneNumber}`);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dial_code.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-gray mb-2">
        {label}
      </label>
      <div className="flex rounded-lg border border-gray-700 focus-within:ring-2 focus-within:ring-brand-orange focus-within:border-transparent transition-all duration-200 shadow-inner shadow-black/20">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className="flex items-center justify-center bg-brand-dark/50 p-3 text-white focus:outline-none focus:bg-brand-surface h-full rounded-l-lg"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <img src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`} alt={selectedCountry.name} className="w-5 h-auto mr-2 rounded-sm" />
            <span className="text-sm">{selectedCountry.dial_code}</span>
            <svg className={`w-4 h-4 ml-1 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          {isOpen && (
            <div className="absolute z-50 mt-2 w-72 bg-brand-surface/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl shadow-black/50 max-h-60 overflow-y-auto left-0 animate-scale-in">
              <div className="p-2 sticky top-0 bg-brand-surface/90 backdrop-blur-sm z-10">
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-brand-dark/50 border border-white/30 rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent placeholder-gray-400"
                  autoFocus
                />
              </div>
              <ul role="listbox">
                {filteredCountries.length > 0 ? filteredCountries.map(country => (
                  <li
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 cursor-pointer rounded-md mx-1"
                    role="option"
                    aria-selected={selectedCountry.code === country.code}
                  >
                    <img src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} alt={country.name} className="w-5 h-auto mr-3 rounded-sm" />
                    <span className="flex-grow">{country.name}</span>
                    <span className="text-gray-500">{country.dial_code}</span>
                  </li>
                )) : (
                    <li className="px-4 py-2 text-sm text-gray-500 text-center">No country found.</li>
                )}
              </ul>
            </div>
          )}
        </div>
        <input
          id={id}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          disabled={disabled}
          required={required}
          className="w-full bg-brand-dark/50 border-none p-3 text-white focus:ring-0 focus:bg-brand-surface rounded-r-lg"
          {...props}
        />
      </div>
      <style>{`
        @keyframes scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
            animation: scale-in 0.1s ease-out forwards;
            transform-origin: top left;
        }
      `}</style>
    </div>
  );
};

export default PhoneInput;