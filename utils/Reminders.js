import { Constants, Permissions, Notifications } from 'expo'
import moment from 'moment'
// import Store from '../state/Store';

async function _maybeRequestPermissionsAsync() {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  if (Constants.isDevice) {
    return status === 'granted';
  } else {
    return status === 'granted' || status === 'undetermined';
  }
}

async function scheduleAsync(time, title) {
  if (!await _maybeRequestPermissionsAsync()) {
    throw new Error('No permissions for notifications');
  }

  const notificationOptions = {
    title,
    body: `${title} begins at ${moment(time).format()}}.`,
    data: { time, title },
    ios: { sound: true },
    android: {  sound: true }
  }
  const schedulingOptions = {
    time
  }
  const notificationId = await Notifications.scheduleLocalNotificationAsync(notificationOptions, schedulingOptions)

  console.log(`Notification scheduled at ${moment(time).format()}:`, notificationId, { notificationOptions, schedulingOptions })
}

async function cancelAsync(notificationId) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

async function cancelAllAsync() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export default {
  scheduleAsync,
  cancelAsync,
  cancelAllAsync
};