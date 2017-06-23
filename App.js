import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Notifications, Permissions } from 'expo'
import moment from 'moment'

export default class App extends React.Component {
  componentDidMount () {
    this._notificationSubscription = this._registerForNotifications()
  }

  componentWillUnmount () {
    this._notificationSubscription && this._notificationSubscription.remove()
  }

  // Private methods

  _registerForNotifications () {
    Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS)
      .then(({ status, expires }) => {
        if (status !== 'granted') {
          return
        }

        console.log('Notification permission is granted.')

        this._notificationSubscription = Notifications.addListener(
          this._handleNotification.bind(this)
        )
      })
      .catch(err => {
        console.error(err)
      })
  }

  _handleNotification = ({ origin, data }) => {
    console.info(`Notification ${origin} with data: ${JSON.stringify(data)}`)
  }

  _sendNotification (delayed = false) {
    const localNotification = {
      title: 'Testing Title',
      body: 'Testing body',
      data: { test: 'value' }
    }
    const schedulingOptions = {
      time: (new Date()).getTime() + 5000
    }

    if (delayed) {
      console.log('Scheduling delayed notification:', { localNotification, schedulingOptions })
      Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
        .then(id => console.info(`Delayed notification scheduled (${id}) at ${moment(schedulingOptions.time).format()}`))
        .catch(err => console.error(err))
    } else {
      console.log('Scheduling immediate notification:', { localNotification })
      Notifications.presentLocalNotificationAsync(localNotification)
        .then(id => console.info(`Immediate notification scheduled (${id})`))
        .catch(err => console.error(err))
    }
  }

  // Rendering

  render() {
    return (
      <View style={styles.container}>
        <Button title='Send Immediate Notification' onPress={() => this._sendNotification()} />
        <Button title='Send Delayed Notification' onPress={() => this._sendNotification(true)} />
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
