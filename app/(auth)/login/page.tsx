import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Panel - Branding & Intro */}
      <div className="hidden w-1/2 bg-indigo-600 lg:flex flex-col justify-between p-12 text-white">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-wider">CampusPilot</span>
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Find your path. Choose the right college.
          </h2>
          <p className="text-indigo-100 text-lg max-w-md">
            Compare over 1200+ colleges across India, analyze placements, fees, course structures, and reviews in one unified platform.
          </p>
        </div>
        <div className="text-sm text-indigo-200">
          &copy; {new Date().getFullYear()} CampusPilot. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form Centered */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo display for mobile */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-3xl font-extrabold text-indigo-600 tracking-wider">CampusPilot</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
