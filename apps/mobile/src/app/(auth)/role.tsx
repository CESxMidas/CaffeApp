import { Redirect } from 'expo-router';

/** @deprecated C-11 — role picker removed; kept so deep links do not 404. */
export default function RoleScreen() {
  return <Redirect href="/" />;
}
