import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  TalentScope collects information you provide directly to us, such as when you create an account, 
                  connect your gaming platforms, or contact us for support.
                </p>
                
                <h4 className="font-semibold mt-4 mb-2">Account Information</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Username and email address</li>
                  <li>Gaming platform IDs (Steam, Discord, etc.)</li>
                  <li>Region and gaming preferences</li>
                  <li>Performance data from connected platforms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide and improve our talent matching services</li>
                  <li>Generate personalized performance reports</li>
                  <li>Connect players with scouts and opportunities</li>
                  <li>Communicate with you about your account and services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@talentscope.com" className="text-primary hover:underline">
                    privacy@talentscope.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}