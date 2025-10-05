import React, { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState({
    name: 'TechStart Solutions',
    industry: 'Technology',
    location: 'Bangalore, India',
    logoUrl: '',
    primaryColor: '#2563eb',
    secondaryColor: '#f3f4f6'
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('company-data');
    if (saved) {
      setCompany(JSON.parse(saved));
    }
  }, []);

  const updateCompany = (updates) => {
    const newCompany = { ...company, ...updates };
    setCompany(newCompany);
    localStorage.setItem('company-data', JSON.stringify(newCompany));
    
    // Apply CSS variables immediately
    if (updates.primaryColor) {
      document.documentElement.style.setProperty('--brand-primary', updates.primaryColor);
    }
    if (updates.secondaryColor) {
      document.documentElement.style.setProperty('--brand-secondary', updates.secondaryColor);
    }
  };

  return (
    <CompanyContext.Provider value={{ company, updateCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};