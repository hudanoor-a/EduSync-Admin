"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Edit3, Save, Mail, Phone, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js'; // .js extension


const initialProfile = {
  name: 'Admin User',
  email: 'admin@educentral.com',
  phone: '123-456-7890',
  role: 'Super Administrator',
  avatarUrl: 'https://picsum.photos/128/128?grayscale&blur=1',
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialProfile);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { toast } = useToast();

  const handleEditToggle = () => {
    if (isEditing) {
      // Intentionally don't reset here, let save handle it
      // setFormData(profile); // This would discard changes on cancel
    } else {
      setFormData(profile); // Load current profile into form when starting edit
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Simulate API call: await fetch('/api/admin/profile/update', { method: 'POST', body: JSON.stringify(formData) });
    setProfile(formData);
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  const handleCancelEdit = () => {
     setFormData(profile); // Reset form data to original profile
     setIsEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (newPassword !== confirmPassword) {
        toast({ title: "Password Mismatch", description: "New password and confirm password do not match.", variant: "destructive" });
        return;
    }
    if (newPassword.length < 6) {
        toast({ title: "Password Too Short", description: "Password must be at least 6 characters long.", variant: "destructive" });
        return;
    }
    toast({ title: "Password Changed", description: "Your password has been updated successfully." });
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center"><UserCircle className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" /> Admin Profile</h1>
      
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary/50 shadow-md">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint="profile avatar" />
                <AvatarFallback>{profile.name.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-grow">
                <CardTitle className="text-xl sm:text-2xl">{profile.name}</CardTitle>
                <CardDescription>{profile.role}</CardDescription>
            </div>
            {!isEditing && (
                <Button variant="outline" onClick={handleEditToggle} className="w-full sm:w-auto mt-4 sm:mt-0">
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
            )}
        </CardHeader>
        <form onSubmit={handleProfileSave}>
          <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="name" className="flex items-center text-sm"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground"/> Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} className="mt-1"/>
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center text-sm"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/> Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className="mt-1"/>
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center text-sm"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/> Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleInputChange} disabled={!isEditing} placeholder="Optional" className="mt-1"/>
                </div>
                <div>
                  <Label htmlFor="role" className="flex items-center text-sm"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground"/> Role</Label>
                  <Input id="role" name="role" value={formData.role} disabled className="mt-1 bg-muted/50"/>
                </div>
              </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">
                  Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <form onSubmit={handleChangePassword}>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="mt-1"/>
                  </div>
                  <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="mt-1"/>
                  </div>
              </div>
          </CardContent>
          <CardFooter>
              <Button type="submit" variant="outline" className="w-full sm:w-auto">Update Password</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}