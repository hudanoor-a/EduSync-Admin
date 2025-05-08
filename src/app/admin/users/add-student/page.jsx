// This page could be a more detailed form for adding a single student.
// For now, it redirects to the main user management page.
// The user management page already has manual add functionality.
import { redirect } from 'next/navigation';

export default function AddStudentPage() {
  redirect('/admin/users'); 
  return null; 
}