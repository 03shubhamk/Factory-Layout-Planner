import React from 'react';
import { FactoryProvider } from './FactoryContext';
import { MachineProvider } from './MachineContext';
import { FlowProvider } from './FlowContext';
import { LayoutProvider } from './LayoutContext';
import { TelemetryProvider } from './TelemetryContext';

export function CombinedProvider({ children }) {
  return (
    <FactoryProvider>
      <TelemetryProvider>
        <MachineProvider>
          <FlowProvider>
            <LayoutProvider>
              {children}
            </LayoutProvider>
          </FlowProvider>
        </MachineProvider>
      </TelemetryProvider>
    </FactoryProvider>
  );
}

export default CombinedProvider;
