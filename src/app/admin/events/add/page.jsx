import { redirect } from 'next/navigation';

export default function AddEventPage() {
  redirect('/admin/events'); // Redirect to main events page which has Add functionality
  return null; 
}