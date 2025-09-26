import ProfileForm from '@/components/profile-form'
import { Toaster } from '@/components/ui/toaster'

/**
 * This page replaces the default template and renders the custom Profile Form.
 */
export default function ProfilePage() {
  return (
    // The main container centering the form on the screen.
    <div className="min-h-screen flex items-center justify-center p-4">
      <ProfileForm />
      
      {/* The Toaster component is added here to ensure notifications appear over the content. */}
      <Toaster />
    </div>
  )
}