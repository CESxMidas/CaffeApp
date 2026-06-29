import { useCallback, useRef, useState } from 'react';
import { StaffRole } from '@caffeapp/shared';
import { useSessionStore } from '@shared/stores/session';
import { StaffPickerModal } from '../components/StaffPickerModal';

export interface UseStaffActorOptions {
  /** Personal devices may pass a role, but station tablets always pick a barista actor. */
  operatorRoles?: StaffRole[];
}

export function useStaffActor(options: UseStaffActorOptions = {}) {
  const { operatorRoles } = options;
  const isStationDevice = useSessionStore((s) => s.isStationDevice);
  const effectiveOperatorRoles = isStationDevice ? [StaffRole.BARISTA] : operatorRoles;
  const [visible, setVisible] = useState(false);
  const pendingAction = useRef<((actedByStaffId: string) => void) | null>(null);

  const runWithActor = useCallback(
    (action: (actedByStaffId?: string) => void) => {
      if (!isStationDevice) {
        action(undefined);
        return;
      }

      pendingAction.current = (staffId) => action(staffId);
      setVisible(true);
    },
    [isStationDevice],
  );

  const handleSelect = useCallback((staffId: string) => {
    setVisible(false);
    pendingAction.current?.(staffId);
    pendingAction.current = null;
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    pendingAction.current = null;
  }, []);

  const pickerModal = (
    <StaffPickerModal
      visible={visible}
      operatorRoles={effectiveOperatorRoles}
      onClose={handleClose}
      onSelect={handleSelect}
    />
  );

  return { runWithActor, pickerModal, isStationDevice };
}
