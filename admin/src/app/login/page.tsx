"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Typography, Card, CardHeader, CardContent, CardFooter } from 'intracom-ui';
import { MessageSquare, ShieldCheck, Globe, Zap } from 'lucide-react';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login for now
    setTimeout(() => {
      Cookies.set('token', 'mock_jwt_token_123', { expires: 7 });
      router.push('/chat');
      router.refresh();
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      
      <div className="flex-1 flex flex-col justify-center items-center p-6 z-10">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20 mb-2">
               <MessageSquare className="text-white" size={32} />
            </div>
            <Typography variant="h1" className="text-white text-3xl font-extrabold tracking-tight border-0 m-0">
              Intracom Admin
            </Typography>
            <Typography className="text-gray-400 text-base">
              The command center for your customer relationships
            </Typography>
          </div>

          <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden p-2">
            <CardHeader className="pt-8 px-6 pb-2">
              <Typography variant="h4" className="text-white font-bold tracking-tight border-0 m-0">Sign In</Typography>
              <Typography className="text-gray-400 text-sm">Enter your credentials to access the dashboard</Typography>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 text-xs font-bold uppercase tracking-wider">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@intracom.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-300 text-xs font-bold uppercase tracking-wider">Password</Label>
                    <a href="#" className="text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors">Forgot?</a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                       <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                       Authenticating...
                    </div>
                  ) : 'Sign In to Dashboard'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="p-6 pt-2 border-t border-white/5 flex flex-col gap-4">
               <div className="grid grid-cols-3 gap-4">
                  <Feature icon={<ShieldCheck size={16} />} label="Secure" />
                  <Feature icon={<Globe size={16} />} label="Global" />
                  <Feature icon={<Zap size={16} />} label="Real-time" />
               </div>
            </CardFooter>
          </Card>
          
          <div className="text-center">
             <Typography className="text-gray-500 text-sm">
               Don't have an account? <span className="text-blue-400 font-bold cursor-pointer hover:underline">Contact Support</span>
             </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode, label: string }) {
   return (
      <div className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity cursor-default">
         <div className="text-white">{icon}</div>
         <span className="text-[10px] text-white font-bold uppercase tracking-widest">{label}</span>
      </div>
   )
}
