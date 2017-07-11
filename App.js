import React from 'react';
import { StyleSheet, Alert, Text, View, Button, Platform } from 'react-native';
import { Notifications, Permissions } from 'expo'
import moment from 'moment'
import Reminders from './utils/Reminders'

export default class App extends React.Component {
  componentWillMount() {
    this._listenForNotifications();
  }

  // Private methods

  _listenForNotifications = () => {
    Notifications.addListener(notification => {
      console.log('Notification received:', notification)

      if (notification.origin === 'received' && Platform.OS === 'ios') {
        Alert.alert(
          'A friendly reminder',
          `"${notification.data.title}" is starting soon!`
        )
      }
    })
  }

  _sendImmediateNotification = async () => {
    try {
      await Reminders.cancelAllAsync()
      await Reminders.scheduleAsync(moment().valueOf(), 'Immediate testing title');
    } catch (e) {
      alert('Oops, you need to enable notifications for the app!');
    }
  }

  _sendDelayedNotification = async () => {
    try {
      await Reminders.cancelAllAsync()
      await Reminders.scheduleAsync(moment().add(5, 'seconds').valueOf(), 'Delayed testing title');
    } catch (e) {
      alert('Oops, you need to enable notifications for the app!');
    }
  }

  // Rendering

  render() {
    return (
      <View style={styles.container}>
        <Button 
          title='Send Immediate Notification' 
          onPress={() => this._sendImmediateNotification()} 
        />
        <Button 
          title='Send Delayed Notification' 
          onPress={() => this._sendDelayedNotification()} 
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
