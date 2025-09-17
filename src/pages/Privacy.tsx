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
                  Chosen1 AI collects information you provide directly to us, such as when you create an account, 
                  connect your CS:GO platforms, or contact us for support.
                </p>
                
                <h4 className="font-semibold mt-4 mb-2">Account Information</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Username and email address</li>
                  <li>CS:GO platform IDs (Steam, FACEIT, etc.)</li>
                  <li>Region and CS:GO preferences</li>
                  <li>CS:GO performance data from connected platforms</li>
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
                  <li>Provide and improve our CS:GO talent matching services</li>
                  <li>Generate personalized CS:GO performance reports</li>
                  <li>Connect CS:GO players with scouts and opportunities</li>
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
                  <a href="mailto:privacy@chosen1ai.com" className="text-primary hover:underline">
                    privacy@chosen1ai.com
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