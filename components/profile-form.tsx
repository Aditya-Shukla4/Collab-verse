"use client"

// Corrected import paths: They must start with '@/components/ui'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ProfileForm() {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-card text-card-foreground border shadow">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl md:text-3xl font-bold text-balance">Create Your Profile</CardTitle>
        <CardDescription className="text-muted-foreground">
          Share who you are and how you like to collaborate.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="grid gap-8">
          {/* Basic Info */}
          <section className="grid gap-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Basic Info</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="username">
                  User Name{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only"> (required)</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                  aria-required="true"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  placeholder="Software Engineer"
                  autoComplete="organization-title"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="interests">Domain of Interests</Label>
                <Input
                  id="interests"
                  name="interests"
                  placeholder="Web Development, AI, UI/UX Design"
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">User Location</Label>
                <Input id="location" name="location" placeholder="San Francisco, CA" autoComplete="address-level2" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="techstack">
                User Tech Stack{" "}
                <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                <span className="sr-only"> (required)</span>
              </Label>
              <Input
                id="techstack"
                name="techstack"
                placeholder="React, Next.js, TypeScript, Tailwind CSS"
                autoComplete="off"
                required
                aria-required="true"
              />
            </div>
          </section>

          <Separator />

          {/* Links */}
          <section className="grid gap-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Social & Professional Links
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  inputMode="url"
                  placeholder="https://linkedin.com/in/username"
                  autoComplete="url"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="github">
                  GitHub Profile URL{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only"> (required)</span>
                </Label>
                <Input
                  id="github"
                  name="github"
                  type="url"
                  inputMode="url"
                  placeholder="https://github.com/username"
                  autoComplete="url"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="portfolio">Portfolio Website URL</Label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  type="url"
                  inputMode="url"
                  placeholder="https://yourname.com"
                  autoComplete="url"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dribbble">Other Profile URL</Label>
                <Input
                  id="dribbble"
                  name="dribbble"
                  type="url"
                  inputMode="url"
                  placeholder="https://example.com/username"
                  autoComplete="url"
                />
              </div>
            </div>

            {/* ... Twitter/X field intentionally removed ... */}
          </section>

          <Separator />

          {/* About & Collaboration */}
          <section className="grid gap-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">About & Collaboration</h3>

            <div className="grid gap-2">
              <Label htmlFor="about">About Me</Label>
              <Textarea id="about" name="about" placeholder="Tell us about yourself..." rows={4} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="collaboration">Collaboration Preferences</Label>
              <Textarea
                id="collaboration"
                name="collaboration"
                placeholder="e.g., 'Looking for frontend developers for a React project', 'Open to mentoring junior designers'"
                rows={3}
              />
            </div>
          </section>

          <Button
            type="submit"
            className="w-full bg-[var(--btn-primary)] text-[var(--btn-primary-foreground)] hover:bg-[var(--btn-primary-hover)] font-semibold"
          >
            Save Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}