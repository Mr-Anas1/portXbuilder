import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ReactFlagsSelect from "react-flags-select";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);
const countryLabels = countries.getNames("en");

export default function BillingForm({
  initialValues = {},
  onSubmit,
  loading,
  submitLabel = "Subscribe",
}) {
  const [form, setForm] = useState({
    city: initialValues.city || "",
    country: initialValues.country || "",
    state: initialValues.state || "",
    street: initialValues.street || "",
    zipcode: initialValues.zipcode || "",
  });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountrySelect = (code) => {
    const countryName = countryLabels[code];
    setSelectedCountry(code);
    setForm({ ...form, country: countryName });
  };

  const forbiddenPattern = /[<>]/;
  const htmlTagPattern = /<[^>]*>/g;
  const textPattern = /^[a-zA-Z0-9\-\s]{2,40}$/;
  const zipPattern = /^[a-zA-Z0-9\- ]{4,10}$/;

  const validate = () => {
    const errs = {};
    // City
    if (!form.city || form.city.trim().length < 2)
      errs.city = "City must be at least 2 characters";
    else if (form.city.length > 40)
      errs.city = "City must be less than 40 characters";
    else if (forbiddenPattern.test(form.city) || htmlTagPattern.test(form.city))
      errs.city = "Invalid characters in city";
    else if (!textPattern.test(form.city))
      errs.city = "Only letters, numbers, spaces, and hyphens allowed";
    // Country
    if (!selectedCountry) {
      errs.country = "Please select a country";
    } else if (form.country.trim().length < 2) {
      errs.country = "Country name must be at least 2 characters";
    } else if (form.country.length > 40) {
      errs.country = "Country name must be less than 40 characters";
    } else if (
      forbiddenPattern.test(form.country) ||
      htmlTagPattern.test(form.country)
    )
      errs.country = "Invalid characters in country name";
    else if (!textPattern.test(form.country))
      errs.country =
        "Only letters, numbers, spaces, and hyphens allowed in country name";
    // State
    if (!form.state || form.state.trim().length < 2)
      errs.state = "State must be at least 2 characters";
    else if (form.state.length > 40)
      errs.state = "State must be less than 40 characters";
    else if (
      forbiddenPattern.test(form.state) ||
      htmlTagPattern.test(form.state)
    )
      errs.state = "Invalid characters in state";
    else if (!textPattern.test(form.state))
      errs.state = "Only letters, numbers, spaces, and hyphens allowed";
    // Street
    if (!form.street || form.street.trim().length < 2)
      errs.street = "Street must be at least 2 characters";
    else if (form.street.length > 40)
      errs.street = "Street must be less than 40 characters";
    else if (
      forbiddenPattern.test(form.street) ||
      htmlTagPattern.test(form.street)
    )
      errs.street = "Invalid characters in street";
    else if (!textPattern.test(form.street))
      errs.street = "Only letters, numbers, spaces, and hyphens allowed";
    // Zipcode
    if (!form.zipcode || form.zipcode.trim().length < 4)
      errs.zipcode = "Zipcode must be at least 4 characters";
    else if (form.zipcode.length > 10)
      errs.zipcode = "Zipcode must be less than 10 characters";
    else if (
      forbiddenPattern.test(form.zipcode) ||
      htmlTagPattern.test(form.zipcode)
    )
      errs.zipcode = "Invalid characters in zipcode";
    else if (!zipPattern.test(form.zipcode))
      errs.zipcode = "Only letters, numbers, spaces, and hyphens allowed";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          maxLength={40}
          className={`w-full border rounded px-3 py-2 ${errors.city ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.city && (
          <div className="text-red-500 text-xs mt-1">{errors.city}</div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <ReactFlagsSelect
          selected={selectedCountry}
          searchable
          className="flag-group custom-flags-select w-full rounded-xl text-gray-700"
          customLabels={countryLabels}
          onSelect={handleCountrySelect}
        />
        {errors.country && (
          <div className="text-red-500 text-xs mt-1">{errors.country}</div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          maxLength={40}
          className={`w-full border rounded px-3 py-2 ${errors.state ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.state && (
          <div className="text-red-500 text-xs mt-1">{errors.state}</div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Street</label>
        <input
          name="street"
          value={form.street}
          onChange={handleChange}
          maxLength={40}
          className={`w-full border rounded px-3 py-2 ${errors.street ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.street && (
          <div className="text-red-500 text-xs mt-1">{errors.street}</div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Zipcode</label>
        <input
          name="zipcode"
          value={form.zipcode}
          onChange={handleChange}
          maxLength={10}
          className={`w-full border rounded px-3 py-2 ${errors.zipcode ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.zipcode && (
          <div className="text-red-500 text-xs mt-1">{errors.zipcode}</div>
        )}
      </div>
      <Button
        type="submit"
        className="w-auto block mx-auto bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-colors"
        disabled={loading || hasErrors}
      >
        {loading ? "Processing..." : submitLabel}
      </Button>
    </form>
  );
}
