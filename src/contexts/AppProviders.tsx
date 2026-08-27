import React, { ReactNode } from 'react';
import { UIProvider } from './UIContext';
import { AuthProvider } from './AuthContext';
import { WalletProvider } from './WalletContext';
import { CatalogProvider } from './CatalogContext';
import { OrdersProvider } from './OrdersContext';
import { AdminProvider } from './AdminContext';

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>
        <WalletProvider>
          <CatalogProvider>
            <OrdersProvider>
              <AdminProvider>
                {children}
              </AdminProvider>
            </OrdersProvider>
          </CatalogProvider>
        </WalletProvider>
      </AuthProvider>
    </UIProvider>
  );
};
