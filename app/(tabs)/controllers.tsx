import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  ActivityIndicator,
  Button,
  DataTable,
  Dialog,
  List,
  Portal,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';

import {
  useControllerConfig,
  useDeleteInternalConfig,
  useInternalConfig,
  useManageController,
  useUpdateControllerConfig,
  useUpdateInternalConfig,
} from '@/api/queries';
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import i18n from '@/i18n';
import { IInternalConfig } from '@/api/types';

export default function ControllersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const [addConfigDialogVisible, setAddConfigDialogVisible] = useState(false);
  const [deleteConfigDialogVisible, setDeleteConfigDialogVisible] =
    useState(false);

  const [newConfigName, setNewConfigName] = useState<string | undefined>(
    undefined,
  );
  const [newConfigTemperature, setNewConfigTemperature] = useState<
    string | undefined
  >(undefined);
  const [newConfigTime, setNewConfigTime] = useState<string | undefined>(
    undefined,
  );

  const [mode, setMode] = useState<string | undefined>(undefined);
  const [startingTemperature, setStartingTemperature] = useState<
    string | undefined
  >(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);

  // Queries

  const queryClient = useQueryClient();

  const {
    data: controllerConfigData,
    isLoading: isControllerConfigLoading,
    refetch: refetchControllerConfig,
  } = useControllerConfig();

  const updateControllerConfig = useUpdateControllerConfig();

  const manageController = useManageController();

  const {
    data: internalConfigData,
    isLoading: isInternalConfigLoading,
    refetch: refetchInternalConfig,
  } = useInternalConfig();

  const updateInternalConfig = useUpdateInternalConfig();

  const deleteInternalConfig = useDeleteInternalConfig();

  // Callbacks

  const onRefresh = () => {
    setRefreshing(true);
    refetchControllerConfig();
    refetchInternalConfig();
    setRefreshing(false);
  };

  const onUseConfig = () => {
    console.log(mode, startingTemperature, time);

    if (mode !== 'cafe' && mode !== 'cacao' && mode !== 'mani')
      setMode(undefined);
    if (isNaN(Number(startingTemperature))) setStartingTemperature(undefined);
    if (isNaN(Number(time))) setTime(undefined);

    updateControllerConfig.mutate(
      {
        mode: mode as 'cafe' | 'cacao' | 'mani' | undefined,
        starting_temperature: Number(startingTemperature),
        time: Number(time),
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['fetchControllerConfig'],
          });
        },
      },
    );
  };

  const onStop = () => {
    manageController.mutate(
      {
        action: 'stop',
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['fetchControllerConfig'],
          });
        },
      },
    );
  };

  const onToggleSwitch = () => {
    manageController.mutate(
      {
        action: isSwitchOn ? 'deactivate' : 'activate',
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['fetchControllerConfig'],
          });
        },
      },
    );
  };

  const onSelectConfig = (config: IInternalConfig[keyof IInternalConfig]) => {
    setStartingTemperature(String(config.starting_temperature));
    setTime(String(config.time));
  };

  const onSaveConfig = () => {
    if (!newConfigName || !newConfigTemperature || !newConfigTime) {
      hideAddDialog();
      setNewConfigName(undefined);
      setNewConfigTemperature(undefined);
      setNewConfigTime(undefined);
      return;
    }

    updateInternalConfig.mutate(
      {
        [newConfigName]: {
          starting_temperature: Number(newConfigTemperature),
          time: Number(newConfigTime),
        },
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['fetchInternalConfig'],
          });
          onCancelDialog();
        },
      },
    );
  };

  const onDeleteConfig = (name: string | undefined) => {
    if (!name) return;

    deleteInternalConfig.mutate(name, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['fetchInternalConfig'],
        });
        onCancelDialog();
      },
    });
  };

  const onCancelDialog = () => {
    hideAddDialog();
    hideDeleteDialog();
    setNewConfigName(undefined);
    setNewConfigTemperature(undefined);
    setNewConfigTime(undefined);
    setStartingTemperature(undefined);
    setTime(undefined);
  };

  const showAddDialog = () => setAddConfigDialogVisible(true);
  const hideAddDialog = () => setAddConfigDialogVisible(false);

  const showDeleteDialog = (name: string) => {
    setNewConfigName(name);
    setDeleteConfigDialogVisible(true);
  };
  const hideDeleteDialog = () => setDeleteConfigDialogVisible(false);

  // Effects

  useEffect(() => {
    setIsSwitchOn(controllerConfigData?.data.status === 'on' ? true : false);
  }, [controllerConfigData]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.listContainer}>
          <List.Accordion
            title={i18n.t('Controller.SavedConfigurations')}
            left={(props) => {
              if (isInternalConfigLoading)
                return (
                  <View style={styles.savedConfigLoading}>
                    <ActivityIndicator animating={true} size="small" />
                  </View>
                );
              return <List.Icon {...props} icon="folder" />;
            }}
          >
            {internalConfigData?.data &&
              Object.keys(internalConfigData?.data).map((key) => (
                <List.Item
                  key={key}
                  title={key}
                  style={styles.listItem}
                  left={(props) => <List.Icon {...props} icon="minus-thick" />}
                  onLongPress={() => showDeleteDialog(key)}
                  onPress={() => onSelectConfig(internalConfigData?.data[key])}
                  description={`${i18n.t('Controller.StartingTemperature')}: ${internalConfigData?.data[key].starting_temperature}, ${i18n.t('Controller.Time')}: ${new Date(
                    (internalConfigData?.data[key].time ?? 0) * 1000,
                  )
                    .toISOString()
                    .slice(11, 19)}`}
                />
              ))}
            <List.Item
              style={styles.addNewConfigListItem}
              left={(props) => <List.Icon {...props} icon="plus" />}
              title={i18n.t('Controller.AddNewConfiguration')}
              onPress={showAddDialog}
            />
          </List.Accordion>
        </View>
        <View style={styles.textInputContainer}>
          <Text variant="titleLarge">{i18n.t('Controller.Configuration')}</Text>
          <TextInput
            value={startingTemperature}
            placeholder={i18n.t('Controller.TemperaturePlaceholder')}
            onChangeText={(text) => setStartingTemperature(text)}
          />
          <TextInput
            value={time}
            placeholder={i18n.t('Controller.TimePlaceholder')}
            onChangeText={(text) => setTime(text)}
          />
          <Button
            mode="contained"
            onPress={onUseConfig}
            disabled={isControllerConfigLoading}
          >
            {i18n.t('Controller.Buttons.UseConfiguration')}
          </Button>
        </View>
        {isControllerConfigLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator animating={true} size="large" />
          </View>
        ) : (
          <>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>{i18n.t('Controller.Status')}</DataTable.Title>
                <View>
                  <DataTable.Title
                    numeric
                    style={{
                      width: 120,
                    }}
                  >
                    {i18n.t('Controller.StartingTemperature')}
                  </DataTable.Title>
                </View>
                <DataTable.Title numeric>
                  {i18n.t('Controller.Time')}
                </DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>
                  {controllerConfigData?.data.status}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {controllerConfigData?.data.starting_temperature}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {new Date((controllerConfigData?.data.time ?? 0) * 1000)
                    .toISOString()
                    .slice(11, 19)}
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </>
        )}
        <Button
          mode="contained"
          onPress={onStop}
          disabled={isControllerConfigLoading}
        >
          {i18n.t('Controller.Buttons.StopController')}
        </Button>
        <View style={styles.switchContainer}>
          <Text variant="labelLarge">
            {i18n.t('Controller.Buttons.ActivateController')}:
          </Text>
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            disabled={isControllerConfigLoading}
            style={{
              transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }],
              marginHorizontal: 24,
            }}
          />
        </View>

        <View>
          <Portal>
            <Dialog visible={addConfigDialogVisible} onDismiss={onCancelDialog}>
              <Dialog.Title>
                {i18n.t('Controller.Dialog.NewConfiguration')}
              </Dialog.Title>
              <Dialog.Content style={styles.addNewConfigDialogContent}>
                <TextInput
                  value={newConfigName}
                  placeholder={i18n.t('Controller.NamePlaceholder')}
                  onChangeText={(text) => setNewConfigName(text)}
                />
                <TextInput
                  value={newConfigTemperature}
                  placeholder={i18n.t('Controller.TemperaturePlaceholder')}
                  onChangeText={(text) => setNewConfigTemperature(text)}
                />
                <TextInput
                  value={newConfigTime}
                  placeholder={i18n.t('Controller.TimePlaceholder')}
                  onChangeText={(text) => setNewConfigTime(text)}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={onCancelDialog}>
                  {i18n.t('Controller.Dialog.Cancel')}
                </Button>
                <Button onPress={onSaveConfig}>
                  {i18n.t('Controller.Dialog.Save')}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>

        <View>
          <Portal>
            <Dialog
              visible={deleteConfigDialogVisible}
              onDismiss={onCancelDialog}
            >
              <Dialog.Title>
                {i18n.t('Controller.Dialog.DeleteConfiguration')}
              </Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  {`${i18n.t('Controller.Dialog.DeleteConfigurationMessage')}: ${newConfigName}`}
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={onCancelDialog}>
                  {i18n.t('Controller.Dialog.Cancel')}
                </Button>
                <Button onPress={() => onDeleteConfig(newConfigName)}>
                  {i18n.t('Controller.Dialog.Delete')}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(53, 54, 54, 1)',
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    width: '90%',
    gap: 16,
  },
  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    paddingTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedConfigLoading: {
    paddingLeft: 16,
    justifyContent: 'center',
  },
  listContainer: {
    width: '90%',
    paddingBottom: 24,
  },
  listItem: {
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
  },
  addNewConfigListItem: {
    backgroundColor: 'rgba(30, 23, 23, 0.7)',
  },
  addNewConfigDialogContent: {
    gap: 16,
  },
});
