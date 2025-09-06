"use client";

export default function TestIcons() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <h1 className="text-2xl mb-8">FontAwesome Icon Test</h1>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <i className="fas fa-paper-plane text-[#6366f1] text-xl"></i>
          <span>Paper plane (fas fa-paper-plane)</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <i className="fas fa-sign-in-alt text-green-500 text-xl"></i>
          <span>Sign in (fas fa-sign-in-alt)</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <i className="fas fa-spinner animate-spin text-blue-500 text-xl"></i>
          <span>Spinner (fas fa-spinner animate-spin)</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <i className="fas fa-font text-yellow-500 text-xl"></i>
          <span>Font (fas fa-font)</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <i className="far fa-copy text-purple-500 text-xl"></i>
          <span>Copy (far fa-copy)</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <i className="fas fa-upload text-red-500 text-xl"></i>
          <span>Upload (fas fa-upload)</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <i className="fas fa-cog text-gray-500 text-xl"></i>
          <span>Settings (fas fa-cog)</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <i className="fas fa-trash text-red-600 text-xl"></i>
          <span>Trash (fas fa-trash)</span>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-[#2d2d2d] rounded-lg">
        <p className="text-sm text-gray-400">
          If you can see icons next to the text labels, FontAwesome is loading correctly.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Access this test at: <code>http://localhost:3000/test-icons</code>
        </p>
      </div>
    </div>
  );
}