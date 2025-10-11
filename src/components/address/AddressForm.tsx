'use client';

import { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address, INDIAN_STATES } from '@/lib/types';

interface AddressFormProps {
  initialAddress?: Address | null;
  onSubmit: (address: Address) => Promise<void>;
  onContinue?: () => void;
  onClear?: () => Promise<void>;
  isLoading?: boolean;
}

export default function AddressForm({
  initialAddress,
  onSubmit,
  onContinue,
  onClear,
  isLoading = false
}: AddressFormProps) {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Error states
  const [addressLine1Error, setAddressLine1Error] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
  const [stateError, setStateError] = useState<string | null>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  // Load initial address data
  useEffect(() => {
    if (initialAddress) {
      setAddressLine1(initialAddress.addressLine1 || '');
      setAddressLine2(initialAddress.addressLine2 || '');
      setCity(initialAddress.city || '');
      setState(initialAddress.state || '');
      setPincode(initialAddress.pincode || '');
      setHasChanges(false);
    }
  }, [initialAddress]);

  // Check if form has changes compared to initial address
  useEffect(() => {
    if (!initialAddress) {
      setHasChanges(true);
      return;
    }

    const changed = 
      addressLine1.trim() !== (initialAddress.addressLine1 || '') ||
      addressLine2.trim() !== (initialAddress.addressLine2 || '') ||
      city.trim() !== (initialAddress.city || '') ||
      state.trim() !== (initialAddress.state || '') ||
      pincode.trim() !== (initialAddress.pincode || '');

    setHasChanges(changed);
  }, [addressLine1, addressLine2, city, state, pincode, initialAddress]);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!addressLine1.trim()) {
      setAddressLine1Error('Address Line 1 is required');
      isValid = false;
    } else {
      setAddressLine1Error(null);
    }

    if (!city.trim()) {
      setCityError('City is required');
      isValid = false;
    } else {
      setCityError(null);
    }

    if (!state.trim()) {
      setStateError('State is required');
      isValid = false;
    } else if (!INDIAN_STATES.includes(state as any)) {
      setStateError('Please select a valid state');
      isValid = false;
    } else {
      setStateError(null);
    }

    if (!pincode.trim()) {
      setPincodeError('Pincode is required');
      isValid = false;
    } else if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setPincodeError('Invalid pincode (6 digits, cannot start with 0)');
      isValid = false;
    } else {
      setPincodeError(null);
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const address: Address = {
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || null,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    };

    await onSubmit(address);
  };

  const handlePincodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setPincode(cleaned);
    if (pincodeError) setPincodeError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-[#E0F7FA] to-white rounded-3xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#00BCD4] bg-opacity-10 flex items-center justify-center">
            <MapPin className="w-7 h-7 text-[#00BCD4]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#00BCD4]">Shipping Address</h2>
            <p className="text-slate-600 text-sm mt-1">Enter your delivery address details</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-[#00BCD4] mb-6">Address Details</h3>

        <div className="space-y-5">
          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Address Line 1 (Flat, House No., Building) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => {
                setAddressLine1(e.target.value);
                if (addressLine1Error) setAddressLine1Error(null);
              }}
              placeholder="Enter your address"
              className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all ${
                addressLine1Error
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:border-[#00BCD4]'
              } focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20`}
            />
            {addressLine1Error && (
              <p className="mt-2 text-sm text-red-600">{addressLine1Error}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Address Line 2 (Area, Street, Sector, Village)
            </label>
            <input
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Enter area/street (optional)"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base transition-all focus:border-[#00BCD4] focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              City / Town <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (cityError) setCityError(null);
              }}
              placeholder="Enter your city"
              className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all ${
                cityError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:border-[#00BCD4]'
              } focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20`}
            />
            {cityError && (
              <p className="mt-2 text-sm text-red-600">{cityError}</p>
            )}
          </div>

          {/* State and Pincode Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* State Selector */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowStateDropdown(!showStateDropdown)}
                className={`w-full px-4 py-3 border-2 rounded-xl text-base text-left transition-all flex items-center justify-between ${
                  stateError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-200 focus:border-[#00BCD4]'
                } focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20`}
              >
                <span className={state ? 'text-slate-900' : 'text-slate-400'}>
                  {state || 'Select State'}
                </span>
                <ChevronDown className={`w-5 h-5 text-[#00BCD4] transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
              </button>
              {stateError && (
                <p className="mt-2 text-sm text-red-600">{stateError}</p>
              )}

              {/* Dropdown */}
              {showStateDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {INDIAN_STATES.map((stateName) => (
                      <button
                        key={stateName}
                        type="button"
                        onClick={() => {
                          setState(stateName);
                          setShowStateDropdown(false);
                          if (stateError) setStateError(null);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          state === stateName
                            ? 'bg-[#00BCD4] bg-opacity-10 text-[#00BCD4] font-semibold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {stateName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all ${
                  pincodeError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-200 focus:border-[#00BCD4]'
                } focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20`}
              />
              {pincodeError && (
                <p className="mt-2 text-sm text-red-600">{pincodeError}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {onClear && (
            <Button
              type="button"
              onClick={onClear}
              disabled={isLoading}
              variant="outline"
              className="flex-1 h-14 border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold text-base rounded-xl transition-all disabled:opacity-50"
            >
              <X className="w-5 h-5 mr-2" />
              Clear Form
            </Button>
          )}

          <Button
            type="button"
            onClick={hasChanges ? handleSubmit : onContinue}
            disabled={isLoading}
            className="flex-1 h-14 bg-gradient-to-r from-[#00BCD4] to-[#0097A7] hover:from-[#00838F] hover:to-[#006978] text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </div>
            ) : hasChanges ? (
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Save Address
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                Continue
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
