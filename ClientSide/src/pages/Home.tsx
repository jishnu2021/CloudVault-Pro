import { useState, useEffect } from 'react';
import { Upload, Download, Share2, Shield, Zap, Globe, ArrowRight, Play, Users, FileText, Image, Video } from 'lucide-react';

export default function FileShareHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFileType, setCurrentFileType] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fileTypes = [
    { icon: FileText, name: "Documents", color: "text-blue-400" },
    { icon: Image, name: "Images", color: "text-green-400" },
    { icon: Video, name: "Videos", color: "text-purple-400" },
    { icon: Users, name: "Projects", color: "text-orange-400" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFileType((prev) => (prev + 1) % fileTypes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleUploadDemo = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const CurrentFileIcon = fileTypes[currentFileType].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white bg-opacity-20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Content */}
          <div className={`lg:w-1/2 text-white transform transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          }`}>
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-medium mb-6 animate-bounce">
                <Zap className="w-4 h-4 mr-2" />
                Lightning Fast Sharing
              </span>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Share Files
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Upload, share, and collaborate on files with military-grade security. 
                From documents to media files, share anything with anyone, anywhere in the world.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 mb-8 text-black">
              <div className="flex items-center px-4 py-2 bg-white bg-opacity-10 rounded-full backdrop-blur-sm">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                <span className="text-sm">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white bg-opacity-10 rounded-full backdrop-blur-sm">
                <Globe className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">Global CDN</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white bg-opacity-10 rounded-full backdrop-blur-sm">
                <Users className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-sm">Team Collaboration</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleUploadDemo}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center"
              >
                <Upload className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Start Sharing Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group px-8 py-4 border-2 border-white border-opacity-20 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white hover:bg-opacity-10 hover:scale-105 flex items-center justify-center backdrop-blur-sm">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white border-opacity-20">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">10M+</div>
                <div className="text-sm text-gray-400">Files Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">150+</div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Demo */}
          <div className={`lg:w-1/2 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
          }`}>
            <div className="relative">
              
              {/* Main Upload Card */}
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <CurrentFileIcon className={`w-10 h-10 ${fileTypes[currentFileType].color} transition-all duration-500`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Drop your {fileTypes[currentFileType].name.toLowerCase()} here
                  </h3>
                  <p className="text-gray-300">Or click to browse files</p>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center px-6 py-3 bg-blue-600 bg-opacity-80 rounded-xl text-white font-medium hover:bg-opacity-100 transition-all duration-300 group">
                    <Upload className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Upload
                  </button>
                  <button className="flex items-center justify-center px-6 py-3 bg-white bg-opacity-10 rounded-xl text-white font-medium hover:bg-opacity-20 transition-all duration-300 group border border-white border-opacity-20" style={{ color: 'black' }}>
                    <Share2 className="w-5 h-5 mr-2 group-hover:animate-pulse text-black" />
                    Share
                  </button>
                </div>
              </div>

              {/* Floating Action Cards */}
              <div className="absolute -top-4 -right-4 bg-green-500 bg-opacity-90 rounded-2xl p-4 shadow-xl animate-bounce animation-delay-1000">
                <Download className="w-6 h-6 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-orange-500 bg-opacity-90 rounded-2xl p-4 shadow-xl animate-bounce animation-delay-2000">
                <Shield className="w-6 h-6 text-white" />
              </div>

              {/* Connection Lines */}
              <div className="absolute inset-0 -z-10">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M50 50 Q200 100 350 50 T350 250"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-20">
          <path
            d="M0 120L50 105C100 90 200 60 300 45C400 30 500 30 600 37.5C700 45 800 60 900 67.5C1000 75 1100 75 1150 75L1200 75V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z"
            fill="rgba(255,255,255,0.1)"
          />
        </svg>
      </div>
    </div>
  );
}