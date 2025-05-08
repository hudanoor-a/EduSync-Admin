
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Edit3, Save, Mail, Phone, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


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
      // Reset form data if canceling edit
      setFormData(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    // Simulate API call: await fetch('/api/admin/profile/update', { method: 'POST', body: JSON.stringify(formData) });
    setProfile(formData);
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
        toast({ title: "Password Mismatch", description: "New password and confirm password do not match.", variant: "destructive" });
        return;
    }
    if (newPassword.length < 6) {
        toast({ title: "Password Too Short", description: "Password must be at least 6 characters long.", variant: "destructive" });
        return;
    }
    // Simulate API call: await fetch('/api/admin/profile/change-password', { method: 'POST', body: JSON.stringify({ newPassword }) });
    toast({ title: "Password Changed", description: "Your password has been updated successfully." });
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center"><UserCircle className="mr-3 h-8 w-8 text-primary" /> Admin Profile</h1>
      
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-primary/50 shadow-md">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint="profile avatar" />
                <AvatarFallback>{profile.name.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription>{profile.role}</CardDescription>
            </div>
            <Button variant="outline" onClick={handleEditToggle} className="sm:ml-auto mt-4 sm:mt-0">
                {isEditing ? <><Save className="mr-2 h-4 w-4" /> Save Profile</> : <><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</>}
            </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); handleProfileSave(); }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="flex items-center"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground"/> Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/> Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/> Phone Number</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleInputChange} disabled={!isEditing} placeholder="Optional" />
              </div>
               <div>
                <Label htmlFor="role" className="flex items-center"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground"/> Role</Label>
                <Input id="role" name="role" value={formData.role} disabled />
              </div>
            </div>
            {isEditing && (
              <CardFooter className="mt-6 p-0">
                <Button type="submit" className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <form onSubmit={(e) => {e.preventDefault(); handleChangePassword();}}>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                </div>
                <CardFooter className="mt-6 p-0">
                    <Button type="submit" variant="outline">Update Password</Button>
                </CardFooter>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
