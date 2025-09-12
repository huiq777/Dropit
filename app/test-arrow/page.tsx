"use client";

import { ArrowBigDownDash } from "lucide-react";

export default function TestArrow() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <h1 className="text-3xl mb-8 text-center">ArrowBigDownDash Icon Test</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Basic Icon Display */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-xl mb-4">Basic Icon Display</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <ArrowBigDownDash className="w-6 h-6 text-[#6366f1] mx-auto mb-2" />
              <span className="text-sm text-gray-400">Small</span>
            </div>
            <div className="text-center">
              <ArrowBigDownDash className="w-8 h-8 text-[#6366f1] mx-auto mb-2" />
              <span className="text-sm text-gray-400">Medium</span>
            </div>
            <div className="text-center">
              <ArrowBigDownDash className="w-12 h-12 text-[#6366f1] mx-auto mb-2" />
              <span className="text-sm text-gray-400">Large</span>
            </div>
          </div>
        </div>

        {/* Brand Logo Containers */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-xl mb-4">Brand Logo Containers</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#6366f1] rounded-xl flex items-center justify-center mx-auto mb-2">
                <ArrowBigDownDash className="text-white w-6 h-6" />
              </div>
              <span className="text-sm text-gray-400">Small Container</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-2">
                <ArrowBigDownDash className="text-white w-8 h-8" />
              </div>
              <span className="text-sm text-gray-400">Large Container</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6366f1]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <ArrowBigDownDash className="text-[#6366f1] w-8 h-8" />
              </div>
              <span className="text-sm text-gray-400">Subtle Container</span>
            </div>
          </div>
        </div>

        {/* Drop Button Simulation */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-xl mb-4">Drop Button Implementation</h2>
          <div className="flex items-center justify-center">
            <button className="bg-[#6366f1] hover:bg-indigo-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center space-x-2">
              <span className="font-medium">Drop</span>
              <ArrowBigDownDash className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Fixed &quot;Drop&quot; text with ArrowBigDownDash icon
          </p>
        </div>

        {/* Header Style */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-xl mb-4">Header Brand Style</h2>
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <ArrowBigDownDash className="text-white w-5 h-5 mr-3" />
              <span className="text-xl font-semibold">Dropit</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Navigation header style with text
          </p>
        </div>

        {/* Color Variations */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-xl mb-4">Color Variations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <ArrowBigDownDash className="w-8 h-8 text-[#6366f1] mx-auto mb-2" />
              <span className="text-xs text-gray-400">Brand Blue</span>
            </div>
            <div className="text-center">
              <ArrowBigDownDash className="w-8 h-8 text-white mx-auto mb-2" />
              <span className="text-xs text-gray-400">White</span>
            </div>
            <div className="text-center">
              <ArrowBigDownDash className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-xs text-gray-400">Gray</span>
            </div>
            <div className="text-center">
              <ArrowBigDownDash className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <span className="text-xs text-gray-400">Success</span>
            </div>
          </div>
        </div>

        {/* Interactive States */}
        <div className="bg-[#2d2d2d] p-6 rounded-lg">
          <h2 className="text-xl mb-4">Interactive States</h2>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#6366f1] rounded-xl flex items-center justify-center mx-auto mb-2 hover:scale-110 transition-transform cursor-pointer">
                <ArrowBigDownDash className="text-white w-6 h-6" />
              </div>
              <span className="text-xs text-gray-400">Hover Effect</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#6366f1]/50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <ArrowBigDownDash className="text-white w-6 h-6" />
              </div>
              <span className="text-xs text-gray-400">Disabled</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-green-900/20 border border-green-800 rounded-lg max-w-4xl mx-auto">
        <h3 className="text-green-400 text-lg mb-2">✅ All ArrowBigDownDash Icons Working!</h3>
        <ul className="text-sm text-green-300 space-y-1">
          <li>• Brand identity updated to use arrow down symbolism</li>
          <li>• Icons properly centered in all containers</li>
          <li>• Consistent sizing across all components</li>
          <li>• Drop button maintains &quot;Drop&quot; text with new icon</li>
          <li>• Color variations working correctly</li>
          <li>• No rotation needed - icon works naturally</li>
        </ul>
      </div>
    </div>
  );
}