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
  useUpdateControllerConfig,
  useUpdateInternalConfig,
} from '@/api/queries';
import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import i18n from '@/i18n';
import { IInternalConfig } from '@/api/types';

export default function ControllersScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const [useConfigDialogVisible, setUseConfigDialogVisible] = useState(false);
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

  // Dialog callbacks

  const onCancelDialog = () => {
    hideUseDialog();
    hideAddDialog();
    hideDeleteDialog();
    setNewConfigName(undefined);
    setNewConfigTemperature(undefined);
    setNewConfigTime(undefined);
    setStartingTemperature(undefined);
    setTime(undefined);
  };

  const showUseDialog = (config: IInternalConfig[keyof IInternalConfig]) => {
    setStartingTemperature(String(config.starting_temperature));
    setTime(String(config.time));
    setUseConfigDialogVisible(true);
  };
  const hideUseDialog = () => setUseConfigDialogVisible(false);

  const showAddDialog = () => setAddConfigDialogVisible(true);
  const hideAddDialog = () => setAddConfigDialogVisible(false);

  const showDeleteDialog = (name: string) => {
    setNewConfigName(name);
    setDeleteConfigDialogVisible(true);
  };
  const hideDeleteDialog = () => setDeleteConfigDialogVisible(false);

  // Handlers

  const onUseConfig = () => {
    if (isNaN(Number(startingTemperature)) || isNaN(Number(time))) {
      setStartingTemperature(undefined);
      setTime(undefined);
      hideUseDialog();
      return;
    }

    updateControllerConfig.mutate(
      {
        starting_temperature: Number(startingTemperature),
        time: Number(time),
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['fetchControllerConfig'],
          });
          onCancelDialog();
        },
      },
    );
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
                  onPress={() => showUseDialog(internalConfigData?.data[key])}
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

        <View style={styles.cardContainer}>
          {isControllerConfigLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator animating={true} size="large" />
            </View>
          ) : (
            <>
              <Text variant="titleLarge">
                {i18n.t('Controller.CurrentConfiguration')}
              </Text>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>
                    {i18n.t('Controller.Status')}
                  </DataTable.Title>
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
        </View>

        <View style={styles.cardContainer}>
          <Text variant="titleLarge">{i18n.t('Controller.ControlMotors')}</Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchMotorContainer}>
              <Text variant="labelLarge">
                {i18n.t('Controller.Buttons.Motor1')}
              </Text>
              <Switch
                value={false}
                onValueChange={() => {}}
                disabled={true}
                style={styles.switch}
              />
            </View>
            <View style={styles.switchMotorContainer}>
              <Text variant="labelLarge">
                {i18n.t('Controller.Buttons.Motor2')}
              </Text>
              <Switch
                value={false}
                onValueChange={() => {}}
                disabled={true}
                style={styles.switch}
              />
            </View>
            <View style={styles.switchMotorContainer}>
              <Text variant="labelLarge">
                {i18n.t('Controller.Buttons.Motor3')}
              </Text>
              <Switch
                value={false}
                onValueChange={() => {}}
                disabled={true}
                style={styles.switch}
              />
            </View>
          </View>
        </View>

        {/* Use configuration dialog */}
        <View>
          <Portal>
            <Dialog visible={useConfigDialogVisible} onDismiss={onCancelDialog}>
              <Dialog.Title>
                {i18n.t('Controller.Dialog.UseConfiguration')}
              </Dialog.Title>
              <Dialog.Content style={styles.addNewConfigDialogContent}>
                <TextInput
                  defaultValue={startingTemperature}
                  placeholder={i18n.t('Controller.TemperaturePlaceholder')}
                  onChangeText={(text) => setStartingTemperature(text)}
                  keyboardType="phone-pad"
                  right={<TextInput.Affix text="°C" />}
                />
                <TextInput
                  defaultValue={time}
                  placeholder={i18n.t('Controller.TimePlaceholder')}
                  onChangeText={(text) => setTime(text)}
                  keyboardType="phone-pad"
                  right={<TextInput.Affix text="s" />}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={onCancelDialog}>
                  {i18n.t('Controller.Dialog.Cancel')}
                </Button>
                <Button onPress={onUseConfig}>
                  {i18n.t('Controller.Dialog.Use')}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>

        {/* Add new configuration dialog */}
        <View>
          <Portal>
            <Dialog visible={addConfigDialogVisible} onDismiss={onCancelDialog}>
              <Dialog.Title>
                {i18n.t('Controller.Dialog.NewConfiguration')}
              </Dialog.Title>
              <Dialog.Content style={styles.addNewConfigDialogContent}>
                <TextInput
                  defaultValue={newConfigName}
                  placeholder={i18n.t('Controller.NamePlaceholder')}
                  onChangeText={(text) => setNewConfigName(text)}
                />
                <TextInput
                  defaultValue={newConfigTemperature}
                  placeholder={i18n.t('Controller.TemperaturePlaceholder')}
                  onChangeText={(text) => setNewConfigTemperature(text)}
                  keyboardType="phone-pad"
                  right={<TextInput.Affix text="°C" />}
                />
                <TextInput
                  defaultValue={newConfigTime}
                  placeholder={i18n.t('Controller.TimePlaceholder')}
                  onChangeText={(text) => setNewConfigTime(text)}
                  keyboardType="phone-pad"
                  right={<TextInput.Affix text="s" />}
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

        {/* Delete configuration dialog */}
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
  cardContainer: {
    width: '90%',
    padding: 32,
    // backgroundColor: 'rgb(50, 47, 51)',
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
    borderRadius: 16,
    alignItems: 'center',
    gap: 24,
  },
  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchMotorContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  switch: {
    transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }],
    marginHorizontal: 24,
  },
  loadingContainer: {
    padding: 32,
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
