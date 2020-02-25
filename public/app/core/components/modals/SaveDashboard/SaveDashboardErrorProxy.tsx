import { DashboardModel } from '../../../../features/dashboard/state';
import React, { useEffect } from 'react';
import { Button, ConfirmModal, HorizontalGroup, Modal, stylesFactory, useTheme } from '@grafana/ui';
import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';
import { useDashboardSave } from './useDashboardSave';
import { SaveDashboardModalProps } from './types';
import { SaveDashboardAsButton } from './SaveDashboardButton';

interface SaveDashboardErrorProxyProps {
  dashboard: DashboardModel;
  error: any;
  onClose: () => void;
}

export const SaveDashboardErrorProxy: React.FC<SaveDashboardErrorProxyProps> = ({ dashboard, error, onClose }) => {
  const { onDashboardSave } = useDashboardSave(dashboard);

  useEffect(() => {
    if (error.data) {
      error.isHandled = true;
    }
  }, []);

  return (
    <>
      {error.data && error.data.status === 'version-mismatch' && (
        <ConfirmModal
          isOpen={true}
          title="Conflict"
          body={
            <div>
              Someone else has updated this dashboard <br /> <small>Would you still like to save this dashboard?</small>
            </div>
          }
          confirmText="Save & Overwrite"
          onConfirm={async () => {
            await onDashboardSave(dashboard.getSaveModelClone(), { overwrite: true }, dashboard);
            onClose();
          }}
          onDismiss={onClose}
        />
      )}
      {error.data && error.data.status === 'name-exists' && (
        <ConfirmModal
          isOpen={true}
          title="Conflict"
          body={
            <div>
              A dashboard with the same name in selected folder already exists. <br /> Would you still like to save this
              dashboard?.
            </div>
          }
          confirmText="Save & Overwrite"
          onConfirm={async () => {
            await onDashboardSave(dashboard.getSaveModelClone(), { overwrite: true }, dashboard);
            onClose();
          }}
          onDismiss={onClose}
        />
      )}
      {error.data && error.data.status === 'plugin-dashboard' && (
        <ConfirmPluginDashboardSaveModal dashboard={dashboard} onClose={onClose} />
      )}
    </>
  );
};

const ConfirmPluginDashboardSaveModal: React.FC<SaveDashboardModalProps> = ({ onClose, dashboard }) => {
  const theme = useTheme();
  const { onDashboardSave } = useDashboardSave(dashboard);
  const styles = getConfirmPluginDashboardSaveModalStyles(theme);

  return (
    <Modal className={styles.modal} title="Plugin Dashboard" icon="copy" isOpen={true} onDismiss={onClose}>
      <div className={styles.modalContent}>
        <div className={styles.modalText}>
          Your changes will be lost when you update the plugin.
          <br /> <small>Use Save As to create custom version.</small>
        </div>
        <HorizontalGroup justify="center">
          <SaveDashboardAsButton dashboard={dashboard} onSaveSuccess={onClose} variant="primary-legacy" />
          <Button
            variant="danger"
            onClick={async () => {
              await onDashboardSave(dashboard.getSaveModelClone(), { overwrite: true }, dashboard);
              onClose();
            }}
          >
            Overwrite
          </Button>
          <Button variant="inverse" onClick={onClose}>
            Cancel
          </Button>
        </HorizontalGroup>
      </div>
    </Modal>
  );
};

const getConfirmPluginDashboardSaveModalStyles = stylesFactory((theme: GrafanaTheme) => ({
  modal: css`
    width: 500px;
  `,
  modalContent: css`
    text-align: center;
  `,
  modalText: css`
    font-size: ${theme.typography.heading.h4};
    color: ${theme.colors.link};
    margin-bottom: calc(${theme.spacing.d} * 2);
    padding-top: ${theme.spacing.d};
  `,
  modalButtonRow: css`
    margin-bottom: 14px;
    a,
    button {
      margin-right: ${theme.spacing.d};
    }
  `,
}));