"use client";

import { ArrowBigDownDash } from "lucide-react";

export default function TestBrand() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <h1 className="text-2xl mb-8">Dropit Brand Icons Test</h1>
      
      <div className="space-y-8">
        {/* Main Logo Design */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-lg mb-4">Main Logo Design</h2>
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto">
              <ArrowBigDownDash className="text-white w-8 h-8 " />
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Primary brand logo - centered in indigo rounded container
          </p>
        </div>

        {/* Header Logo */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-lg mb-4">Header Logo</h2>
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <ArrowBigDownDash className="text-white w-5 h-5 mr-3 " />
              <span className="text-lg font-semibold">Dropit</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Header style with text - used in navigation
          </p>
        </div>

        {/* Empty State Logo */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-lg mb-4">Empty State Design</h2>
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-[#6366f1]/20 rounded-full flex items-center justify-center mx-auto">
              <ArrowBigDownDash className="text-[#6366f1] w-8 h-8 " />
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Subtle version for empty states - semi-transparent background
          </p>
        </div>

        {/* Settings About Section */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-lg mb-4">About Section Design</h2>
          <div className="flex items-center justify-center">
            <div className="bg-[#1a1a1a] rounded-xl p-3 border border-[#404040] text-center">
              <div className="w-12 h-12 bg-[#6366f1] rounded-xl flex items-center justify-center mx-auto mb-3">
                <ArrowBigDownDash className="text-white w-6 h-6 " />
              </div>
              <div className="text-sm font-medium text-white mb-1">Dropit</div>
              <div className="text-xs text-gray-400 mb-2">v1.0.0</div>
              <div className="text-xs text-gray-500">
                Secure temporary file sharing
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Compact version for settings panel
          </p>
        </div>

        {/* ArrowBigDownDash Button with Drop Text */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-lg mb-4">ArrowBigDownDash Button Design</h2>
          <div className="flex items-center justify-center">
            <button className="bg-[#6366f1] hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center space-x-2">
              <span className="text-sm font-medium">Drop</span>
              <ArrowBigDownDash className="w-4 h-4 " />
            </button>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Action button with fixed &quot;Drop&quot; text (brand identity)
          </p>
        </div>

        {/* Icon Size Variations */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-lg mb-4">Icon Size Variations</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center mx-auto mb-2">
                <ArrowBigDownDash className="text-white w-4 h-4 " />
              </div>
              <span className="text-xs text-gray-400">Small (16px)</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#6366f1] rounded-xl flex items-center justify-center mx-auto mb-2">
                <ArrowBigDownDash className="text-white w-6 h-6 " />
              </div>
              <span className="text-xs text-gray-400">Medium (24px)</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-2">
                <ArrowBigDownDash className="text-white w-8 h-8 " />
              </div>
              <span className="text-xs text-gray-400">Large (32px)</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Consistent arrow down styling across all sizes
          </p>
        </div>

        {/* Color Variations */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-lg mb-4">Color Variations</h2>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#6366f1] rounded-xl flex items-center justify-center mx-auto mb-2">
                <ArrowBigDownDash className="text-white w-6 h-6 " />
              </div>
              <span className="text-xs text-gray-400">Primary</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#2d2d2d] border border-[#6366f1] rounded-xl flex items-center justify-center mx-auto mb-2">
                <ArrowBigDownDash className="text-[#6366f1] w-6 h-6 " />
              </div>
              <span className="text-xs text-gray-400">Outline</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#6366f1]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <ArrowBigDownDash className="text-[#6366f1] w-6 h-6 " />
              </div>
              <span className="text-xs text-gray-400">Subtle</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-[#2d2d2d] rounded-lg">
        <h3 className="text-lg mb-2">Design Principles Applied ✅</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• All icons properly centered using flexbox</li>
          <li>• Consistent arrow down icon for brand identity</li>
          <li>• Proper size hierarchy (small: 16px, medium: 24px, large: 32px)</li>
          <li>• Brand color #6366f1 used consistently</li>
          <li>• Rounded containers match icon sizes</li>
          <li>• Drop button with ArrowBigDownDash icon for brand consistency</li>
          <li>• Natural integration with dark theme</li>
        </ul>
      </div>
    </div>
  );
}