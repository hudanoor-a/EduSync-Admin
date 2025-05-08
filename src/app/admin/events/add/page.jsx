
import { redirect } from 'next/navigation';

export default function AddEventPage() {
  redirect('/admin/events');
  return null; 
}
