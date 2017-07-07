import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Notifications, Permissions, Constants } from 'expo'
import moment from 'moment'

export default class App extends React.Component {
  async componentDidMount() {
    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (Constants.isDevice && result.status === 'granted') {
      console.log('Notification permissions granted.')
    }
  }

  // Private methods

  _handleNotification = ({ origin, data }) => {
    console.info(`Notification (${origin}) with data: ${JSON.stringify(data)}`)
  }

  _sendImmediateNotification () {
    const localNotification = {
      title: 'Immediate testing Title',
      body: 'Testing body',
      data: { test: 'value' }
    }

    console.log('Scheduling immediate notification:', { localNotification })

    Notifications.presentLocalNotificationAsync(localNotification)
      .then(id => console.info(`Immediate notification scheduled (${id})`))
      .catch(err => console.error(err))
  }

  _sendDelayedNotification () {
    const localNotification = {
      title: 'Delayed testing Title',
      body: 'Testing body',
      data: { test: 'value' }
    }
    const schedulingOptions = {
      time: (new Date()).getTime() + 5000
    }

    console.log('Scheduling delayed notification:', { localNotification, schedulingOptions })

    Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
      .then(id => console.info(`Delayed notification scheduled (${id}) at ${moment(schedulingOptions.time).format()}`))
      .catch(err => console.error(err))
  }

  // Rendering

  render() {
    return (
      <View style={styles.container}>
        <Button title='Send Immediate Notification' onPress={() => this._sendImmediateNotification()} />
        <Button title='Send Delayed Notification' onPress={() => this._sendDelayedNotification()} />
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
